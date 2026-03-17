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

// Body parsing middleware
// Note: routing-controllers also has built-in body parsing, but we can use express.json() for any custom routes or middleware before controllers
// If you have custom routes that need body parsing before hitting controllers, keep this. Otherwise, routing-controllers will handle it for controller routes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware
// CORS setup with dynamic origins from environment variable
// use a comma-separated list in .env, e.g. CORS_ORIGINS=http://localhost:3000,http://example.com
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


const PORT = parseInt(process.env.PORT || "4000", 10);

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
      console.log(`Backend listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
    process.exit(1);
  });


