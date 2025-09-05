"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = {
    port: parseInt(process.env["PORT"] || "3000", 10),
    allowedOrigins: (process.env["ALLOWED_ORIGINS"] || "").split(","),
    staticPath: process.env["STATIC_PATH"] || "assets/img",
};
