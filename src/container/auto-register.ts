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
    // Convert to module path - use absolute path for reliable loading across platforms
    const relativePath = path.relative(__dirname, filePath)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "")
      .replace(/\.js$/, "");
    const modulePath = relativePath.startsWith("..") ? relativePath : "./" + relativePath;
    const absolutePath = path.resolve(__dirname, modulePath);
    
    // Use require for reliable module loading (works with CommonJS)
    const module = require(absolutePath);
    
    // First pass: collect all class exports
    const classExports: Array<{ name: string; cls: new (...args: unknown[]) => unknown }> = [];
    for (const exportName in module) {
      const exported = module[exportName];
      if (typeof exported === "function" && exported.prototype) {
        const paramTypes = Reflect.getMetadata("design:paramtypes", exported);
        const isLikelyInjectable =
          paramTypes !== undefined ||
          exportName.endsWith("Repository") ||
          exportName.endsWith("Service") ||
          exportName.endsWith("Controller");
        if (isLikelyInjectable) {
          classExports.push({ name: exportName, cls: exported });
        }
      }
    }
    
    // Second pass: register implementations and abstract class -> implementation bindings
    for (const { name: exportName, cls: exported } of classExports) {
      const interfaceToken = "I" + exportName;
      
      if (exportName.endsWith("Service") || exportName.endsWith("Repository")) {
        // Abstract class (IX) -> Implementation (X): for @inject(IX) and @inject(IX.name)
        if (exportName.startsWith("I")) {
          const implementationName = exportName.slice(1);
          const implementation = module[implementationName];
          if (implementation && typeof implementation === "function") {
            container.registerSingleton(exported, implementation);
            // Also register string token (IX.name) for @inject(IInventoryItemService.name)
            container.registerSingleton(exported.name, implementation);
            // eslint-disable-next-line no-console
            console.log(`✓ Auto-registered: ${exportName} -> ${implementationName}`);
          }
        } else {
          // Implementation (X): register string token and class alias
          container.registerSingleton(interfaceToken, exported);
          container.register(exported, { useToken: interfaceToken });
          // eslint-disable-next-line no-console
          console.log(`✓ Auto-registered: ${interfaceToken} -> ${exportName}`);
        }
      } else {
        container.registerSingleton(exportName, exported);
        // eslint-disable-next-line no-console
        console.log(`✓ Auto-registered: ${exportName}`);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Could not auto-register from ${filePath}:`, error);
  }
}

