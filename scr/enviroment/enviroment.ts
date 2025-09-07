import dotenv from "dotenv";
dotenv.config();

/**
 * @module Environment
 * @description Configuración de variables de entorno de la aplicación. 
 * Proporciona el puerto del servidor, orígenes permitidos para CORS y la ruta a los archivos estáticos.
 */
export const environment = {
  /**
   * @property {number} port
   * @description Puerto en el que se ejecuta el servidor. Si no se define la variable de entorno `PORT`, se usará el valor por defecto `3000`.
   */
  port: parseInt(process.env["PORT"] || "3000", 10),

  /**
   * @property {string[]} allowedOrigins
   * @description Lista de orígenes permitidos para CORS. Se obtiene de la variable de entorno `ALLOWED_ORIGINS` separando los valores por coma.
   * Ejemplo: `"http://localhost:3000,http://example.com"`
   */
  allowedOrigins: (process.env["ALLOWED_ORIGINS"] || "").split(","),

  /**
   * @property {string} staticPath
   * @description Ruta a los archivos estáticos de la aplicación. Por defecto se establece como `"assets/img"` si no se define `STATIC_PATH`.
   */
  staticPath: process.env["STATIC_PATH"] || "assets/img",
};
