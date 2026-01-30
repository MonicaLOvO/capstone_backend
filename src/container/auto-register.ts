import "reflect-metadata";
import { container } from "tsyringe";
import * as fs from "fs";
import * as path from "path";

/**
 * Automatically discovers and registers all services and repositories
 * from the service and repository folders
 */
export async function autoRegisterServices(): Promise<void> {
  // __dirname will be dist/container in compiled code, or src/container in ts-node
  // We want to search from the parent directory (dist/ or src/)
  const basePath = path.join(__dirname, "..");
  
  // Register all repositories
  await registerFromFolder(basePath, "repository");
  
  // Register all services
  await registerFromFolder(basePath, "service");
  
  // Register all controllers (so they can be injected elsewhere if needed)
  await registerFromFolder(basePath, "controller");
}

/**
 * Recursively finds and registers classes from a specific folder type
 */
async function registerFromFolder(basePath: string, folderName: string): Promise<void> {
  const folders = findFolders(basePath, folderName);
  
  for (const folder of folders) {
    const files = findFilesRecursive(folder, (file) =>
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      !file.endsWith(".d.ts") &&
      !file.endsWith(".d.ts.map") &&
      !file.endsWith(".js.map")
    );
    
    for (const filePath of files) {
      await registerClassFromFile(filePath, basePath);
    }
  }
}

/**
 * Recursively finds all files matching the predicate in a directory
 */
function findFilesRecursive(dir: string, predicate: (filename: string) => boolean): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, predicate));
    } else if (entry.isFile() && predicate(entry.name)) {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Finds all folders with the given name recursively
 */
function findFolders(dir: string, folderName: string): string[] {
  const folders: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return folders;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name === folderName) {
        folders.push(fullPath);
      } else {
        // Recursively search in subdirectories
        folders.push(...findFolders(fullPath, folderName));
      }
    }
  }
  
  return folders;
}

/**
 * Registers a class from a file if it's marked as @injectable
 */
async function registerClassFromFile(filePath: string, basePath: string): Promise<void> {
  try {
    // Convert to module path relative to __dirname (where this file is located)
    // This ensures imports work correctly in both dev and production
    let relativePath = path.relative(__dirname, filePath)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "")
      .replace(/\.js$/, "");
    
    // Ensure path starts with ./ or ../ (don't double-prefix)
    const modulePath = relativePath.startsWith("..") 
      ? relativePath 
      : "./" + relativePath;
    
    // Dynamic import - path is relative to this file's location
    const module = await import(modulePath);
    
    // Find all exports that are classes
    for (const exportName in module) {
      const exported = module[exportName];
      
      // Check if it's a class/constructor function (interfaces compile to nothing, so they won't match)
      if (typeof exported === "function" && exported.prototype) {
        // Check if it has paramtypes metadata (indicates it's been decorated)
        // This works because @injectable decorator sets this metadata
        const paramTypes = Reflect.getMetadata("design:paramtypes", exported);
        
        // If it has metadata, it's likely decorated with @injectable
        // OR if the class name ends with Repository, Service, or Controller, assume it should be registered
        const isLikelyInjectable = paramTypes !== undefined || 
                                   exportName.endsWith("Repository") || 
                                   exportName.endsWith("Service") ||
                                   exportName.endsWith("Controller");
        
        if (isLikelyInjectable) {
          const interfaceToken = "I" + exportName;
          
          if (exportName.endsWith("Service") || exportName.endsWith("Repository")) {
            // Register with interface token (for @inject("IInventoryItemService"))
            container.registerSingleton(interfaceToken, exported);
            // Also register class token -> interface token (for @inject(InventoryItemRepository))
            container.register(exported as any, { useToken: interfaceToken });
            // eslint-disable-next-line no-console
            console.log(`✓ Auto-registered: ${interfaceToken} -> ${exportName}`);
          } else {
            container.registerSingleton(exportName, exported);
            // eslint-disable-next-line no-console
            console.log(`✓ Auto-registered: ${exportName}`);
          }
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Could not auto-register from ${filePath}:`, error);
  }
}

