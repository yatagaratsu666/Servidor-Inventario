import dotenv from "dotenv";
dotenv.config();

export const environment = {
  port: parseInt(process.env["PORT"] || "3000", 10),
  allowedOrigins: (process.env["ALLOWED_ORIGINS"] || "").split(","),
  staticPath: process.env["STATIC_PATH"] || "assets/img",
};
