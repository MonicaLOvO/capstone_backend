import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "mariadb" | "postgres" | "mongodb" ?? "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3308", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "CapstoneDatabase",
  synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in development only
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/**/entity/**/*.ts", 
    __dirname + "/**/entity/**/*.js",
     __dirname + "/**/entity/*.ts",
     __dirname + "/**/entity/*.js",
     __dirname + "/entity/*.ts",
     __dirname + "/entity/*.js"],
  // migrations: [__dirname + "/migrations/**/*.ts", __dirname + "/migrations/**/*.js"],
  subscribers: [__dirname + "/subscribers/**/*.ts", __dirname + "/subscribers/**/*.js"],
  // migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
});

