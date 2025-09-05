declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    ALLOWED_ORIGINS?: string;
    STATIC_PATH?: string;

    MONGO_URI?: string;
    MONGO_DB?: string;
    MONGO_COLLECTION_ARMORS?: string;
    MONGO_COLLECTION_WEAPONS?: string;
    MONGO_COLLECTION_ITEMS?: string;
    MONGO_COLLECTION_HEROES?: string;
    MONGO_COLLECTION_EPICAS?: string;
  }
}
