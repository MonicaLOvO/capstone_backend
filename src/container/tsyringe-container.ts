import { container } from "tsyringe";
import { useContainer, IocAdapter } from "routing-controllers";

/**
 * Adapter to make tsyringe container work with routing-controllers
 * This allows routing-controllers to resolve dependencies from tsyringe
 * Services can be used anywhere - they're registered globally in the DI container
 */
export function setupRoutingControllersContainer(): void {
  // Create adapter that bridges tsyringe with routing-controllers
  const adapter: IocAdapter = {
    get<T>(someClass: { new (...args: any[]): T }): T {
      // First, try to resolve directly from tsyringe container
      try {
        return container.resolve(someClass as any);
      } catch {
        // If not found, try to resolve by interface token
        // This handles cases where we register with interface tokens (IUserService, etc.)
        const className = someClass.name;
        const interfaceToken = "I" + className;
        
        try {
          return container.resolve(interfaceToken) as T;
        } catch {
          // If still not found, try resolving by class name (for controllers that might not have interfaces)
          try {
            return container.resolve(className) as T;
          } catch {
            // Last resort: create a new instance
            // This allows routing-controllers to work even if class isn't in DI container
            return new someClass();
          }
        }
      }
    },
  };

  // Register the adapter with routing-controllers
  useContainer(adapter);
}

