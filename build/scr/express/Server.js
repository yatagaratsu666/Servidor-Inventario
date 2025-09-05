"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const enviroment_1 = require("../enviroment/enviroment");
class Server {
    productView;
    itemView;
    weaponView;
    epicView;
    armorView;
    app;
    constructor(productView, itemView, weaponView, epicView, armorView) {
        this.productView = productView;
        this.itemView = itemView;
        this.weaponView = weaponView;
        this.epicView = epicView;
        this.armorView = armorView;
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.static();
    }
    configure = () => {
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || enviroment_1.environment.allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error(`CORS policy: ${origin} no permitido`));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
    };
    routes = () => {
        this.app.use("/", this.productView.router);
        this.app.use("/", this.itemView.router);
        this.app.use("/", this.weaponView.router);
        this.app.use("/", this.epicView.router);
        this.app.use("/", this.armorView.router);
    };
    static = () => {
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "../../", enviroment_1.environment.staticPath)));
    };
    start = () => {
        this.app.listen(enviroment_1.environment.port, "0.0.0.0", () => {
            console.log(`Server running on port ${enviroment_1.environment.port}`);
        });
    };
}
exports.default = Server;
