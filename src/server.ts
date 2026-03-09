import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./data-source";
import { setupContainer } from "./container";

// Morgan + file logging imports
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { logInfo } from "./logging/logger";

dotenv.config();

const app = express();

// ---------- Logging Setup  ----------
const logDirectory = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// Dev = console, Prod = file
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
}
// ---------------------------------------------

// guaranteed test route (logs will show in terminal or file)
app.get("/__ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


const PORT = process.env.PORT || 4000;

// Health check route – your Next.js app can use this to verify backend is up
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "capstone-backend" });
});

// Initialize database connection and DI container
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection established successfully");

    // Initialize dependency injection container
    await setupContainer();

    // Setup routing-controllers to automatically discover and register controllers
    useExpressServer(app, {
      controllers: [
        __dirname + "/**/controller/**/*.ts",
        __dirname + "/**/controller/**/*.js",
      ],
      cors: true,
      validation: true,
      plainToClassTransformOptions: { enableImplicitConversion: true },
      defaultErrorHandler: true,
    });

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
    process.exit(1);
  });



logInfo("test");


