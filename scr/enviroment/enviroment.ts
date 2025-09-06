import dotenv from "dotenv";
dotenv.config();

/**
 * @description Configuración de variables de entorno de la aplicación
 *
 * @property {number} port - Puerto en el que se ejecuta el servidor (por defecto 3000 si no está definido).
 * @property {string[]} allowedOrigins - Lista de orígenes permitidos para CORS, separados por coma en la variable ALLOWED_ORIGINS.
 * @property {string} staticPath - Ruta a los archivos estáticos (por defecto "assets/img").
 */
export const environment = {
  port: parseInt(process.env["PORT"] || "3000", 10),
  allowedOrigins: (process.env["ALLOWED_ORIGINS"] || "").split(","),
  staticPath: process.env["STATIC_PATH"] || "assets/img",
};
