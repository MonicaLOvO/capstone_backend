import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path/win32";
dotenv.config();

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE || "mysql") as "mysql" | "mariadb" | "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3308", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "CapstoneDatabase",
  // synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in development only
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/**/entity/**/*.ts", 
    __dirname + "/**/entity/**/*.js",
     __dirname + "/**/entity/*.ts",
     __dirname + "/**/entity/*.js",
     __dirname + "/entity/*.ts",
     __dirname + "/entity/*.js"],
  // migrations: [__dirname + "/migrations/**/*.ts", __dirname + "/migrations/**/*.js"],
  // subscribers: [__dirname + "/subscribers/**/*.ts", __dirname + "/subscribers/**/*.js"],
  subscribers: [path.join(__dirname, "subscribers", "**", "*.{ts,js}")],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
});

