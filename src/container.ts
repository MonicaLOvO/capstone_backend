import "reflect-metadata";
import { container } from "tsyringe";
import { AppDataSource } from "./data-source";
import { autoRegisterServices } from "./container/auto-register";
import { setupRoutingControllersContainer } from "./container/tsyringe-container";

/**
 * Initialize and configure the dependency injection container
 * This should be called once when the application starts
 */
export async function setupContainer(): Promise<void> {
  // Register the DataSource as a singleton
  container.registerInstance("DataSource", AppDataSource);
  
  // Automatically discover and register all services and repositories
  // This scans all folders named "service" and "repository" recursively
  await autoRegisterServices();
  
  // Setup routing-controllers to use tsyringe container
  setupRoutingControllersContainer();
  
  // Any manual registrations can go here if needed
}

/**
 * Get the container instance (useful for manual registrations)
 */
export { container };

