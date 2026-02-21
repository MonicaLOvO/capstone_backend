import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { useExpressServer, type Action } from "routing-controllers";
import { AppDataSource } from "./data-source";
import { setupContainer } from "./container";
import { JwtAuthMiddleware } from "./common/middleware/JwtAuthMiddleware";
import { RequestContext } from "./common/context/RequestContext";
import { runSeeds } from "./common/seed/seed-runner";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Note: Do NOT add express.json() here - routing-controllers adds its own body parser.
// Having both causes "stream is not readable" because the stream gets consumed twice.

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
        __dirname + "/**/controller/**/*.ts",
        __dirname + "/**/controller/**/*.js",
      ],
      middlewares: [JwtAuthMiddleware],
      currentUserChecker: (action: Action) => RequestContext.current(),
      cors: true,
      validation: true,
      plainToClassTransformOptions: { enableImplicitConversion: true },
      defaultErrorHandler: true,
    });

    await runSeeds(AppDataSource);
    
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


