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
    const files = fs.readdirSync(folder)
      .filter(file => {
        // Look for both .ts (source) and .js (compiled) files
        // Skip declaration files and source maps
        return (file.endsWith(".ts") || file.endsWith(".js")) && 
               !file.endsWith(".d.ts") && 
               !file.endsWith(".d.ts.map") && 
               !file.endsWith(".js.map");
      });
    
    for (const file of files) {
      const filePath = path.join(folder, file);
      await registerClassFromFile(filePath, basePath);
    }
  }
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
      
      // Check if it's a class/constructor function
      // Skip if it's an interface (interfaces are functions in JS but don't have prototype)
      if (typeof exported === "function" && exported.prototype && exportName[0] !== "I") {
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
          // Find the corresponding interface (starts with 'I' + className)
          const interfaceName = "I" + exportName;
          const interfaceToken = module[interfaceName] ? interfaceName : undefined;
          
          if (interfaceToken) {
            // Register as singleton with the interface token
            container.registerSingleton(interfaceToken, exported);
            // eslint-disable-next-line no-console
            console.log(`✓ Auto-registered: ${interfaceToken} -> ${exportName}`);
          } else {
            // If no interface found, register with class name as token
            container.registerSingleton(exportName, exported);
            // eslint-disable-next-line no-console
            console.log(`✓ Auto-registered: ${exportName} (no interface found)`);
          }
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Could not auto-register from ${filePath}:`, error);
  }
}

