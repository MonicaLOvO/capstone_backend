import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./data-source";
import { setupContainer } from "./container";
import * as path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health check route – your Next.js app can use this to verify backend is up
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "capstone-backend" });
});

// Initialize database connection and DI container
AppDataSource.initialize()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Database connection established successfully");
    
    // Initialize dependency injection container
    await setupContainer();
    
    // Setup routing-controllers to automatically discover and register controllers
    useExpressServer(app, {
      controllers: [
        // Auto-discover controllers from all controller folders
        // Use glob pattern that works in both dev and production
        __dirname + "/**/controller/**/*.ts",
        __dirname + "/**/controller/**/*.js",
      ],
      // Enable CORS
      cors: true,
      // Enable validation
      validation: true,
      // Default error handler
      defaultErrorHandler: false,
    });
    
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Error during database initialization:", error);
    process.exit(1);
  });


