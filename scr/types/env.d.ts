declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    ALLOWED_ORIGINS?: string;
    STATIC_PATH?: string;
  }
}
