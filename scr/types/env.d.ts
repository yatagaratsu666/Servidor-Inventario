/**
 * @description Declaración del espacio de nombres para las variables de entorno en Node.js.
 */
declare namespace NodeJS {
  /**
   * @description Interfaz que define las variables de entorno utilizadas por la aplicación.
   */
  interface ProcessEnv {
    /** @description Puerto en el que se ejecutará el servidor. */
    PORT?: string;

    /** @description Lista de orígenes permitidos para CORS, separados por comas. */
    ALLOWED_ORIGINS?: string;

    /** @description Ruta al directorio de archivos estáticos. */
    STATIC_PATH?: string;

    /** @description URI de conexión a la base de datos MongoDB. */
    MONGO_URI?: string;

    /** @description Nombre de la base de datos en MongoDB. */
    MONGO_DB?: string;

    /** @description Nombre de la colección de armaduras en MongoDB. */
    MONGO_COLLECTION_ARMORS?: string;

    /** @description Nombre de la colección de armas en MongoDB. */
    MONGO_COLLECTION_WEAPONS?: string;

    /** @description Nombre de la colección de ítems en MongoDB. */
    MONGO_COLLECTION_ITEMS?: string;

    /** @description Nombre de la colección de héroes en MongoDB. */
    MONGO_COLLECTION_HEROES?: string;

    /** @description Nombre de la colección de épicas en MongoDB. */
    MONGO_COLLECTION_EPICAS?: string;

    MONGO_COLLECTION_USERS?: string;
  }
}
