import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

/**
 * @description Configuración de Swagger para generar documentación de la API.
 * @constant {Options} options - Opciones utilizadas por swagger-jsdoc para generar la especificación OpenAPI.
 */
const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API del Juego",
      version: "1.0.0",
      description: "Documentación de la API del juego con Swagger",
    },
  },
  /**
   * @description Archivos donde Swagger buscará los comentarios JSDoc para generar la documentación de los endpoints.
   * @type {string[]}
   */
  apis: ["./scr/controller/*.ts", "./scr/model/*.ts", "./scr/view/*.ts"],
};

/**
 * @description Genera la especificación de Swagger a partir de las opciones definidas.
 * @constant {object} swaggerSpec - Especificación OpenAPI generada.
 */
const swaggerSpec = swaggerJSDoc(options);

/**
 * @function swaggerDocs
 * @description Inicializa y sirve la documentación de Swagger en la aplicación Express.
 * @param {Application} app - Instancia de la aplicación Express.
 * @param {number} port - Puerto en el que corre la aplicación para mostrar la URL de la documentación.
 */
export const swaggerDocs = (app: Application, port: number) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      /**
       * @description Configuración de Swagger UI.
       * @property {string[]} supportedSubmitMethods - Métodos HTTP habilitados para "Try it Out". Se deja vacío para deshabilitarlo.
       */
      swaggerOptions: {
        supportedSubmitMethods: [],
      },
    })
  );

  console.log(
    `Documentación de los endpoints disponibles en http://localhost:${port}/api-docs`
  );
};
