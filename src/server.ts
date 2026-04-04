import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Action, useExpressServer } from "routing-controllers";
import { AppDataSource } from "./data-source";
import { setupContainer } from "./container";

import morgan from "morgan";
import fs from "fs";
import path from "path";
import { runSeeds } from "./common/seed/seed-runner";
import { RequestContext } from "./common/context/RequestContext";
import { JwtAuthMiddleware } from "./common/middleware/JwtAuthMiddleware";

dotenv.config();

const app = express();

const logDirectory = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
}

app.get("/__ping", (_req: Request, res: Response) => {
  res.send("pong");
});

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options(/.*/, cors());

const PORT = parseInt(process.env.PORT || "4000", 10);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "capstone-backend" });
});

AppDataSource.initialize()

  .then(async () => {
    console.log("Database connection established successfully");

    await setupContainer();

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
      console.log(`Backend listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
    process.exit(1);
  });