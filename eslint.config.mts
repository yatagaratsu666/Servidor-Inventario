import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["scr/**/*.ts"], // Solo TypeScript en scr/
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  tseslint.configs.recommended,
  {
    ignores: [
      "build/",
      "node_modules/",
      "coverage/",
      "**/*.js",
      "test/" // Ignorar JS si solo quieres TS
    ],
  },
]);
