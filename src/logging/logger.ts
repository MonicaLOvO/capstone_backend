import fs from "fs";
import path from "path";

const logDir = process.env.LOG_DIR || path.join(process.cwd(), "logs");


if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const appLogStream = fs.createWriteStream(
  path.join(logDir, "app.log"),
  { flags: "a" }
);

const write = (level: string, message: string, meta?: unknown) => {
  const line = `[${new Date().toISOString()}] [${level}] ${message} ${
    meta ? JSON.stringify(meta) : ""
  }\n`;

  appLogStream.write(line);
};

export const logInfo = (message: string, meta?: unknown) => {
  write("INFO", message, meta);
};

export const logWarn = (message: string, meta?: unknown) => {
  write("WARN", message, meta);
};

export const logError = (message: string, error?: unknown) => {
  write("ERROR", message, error);
};