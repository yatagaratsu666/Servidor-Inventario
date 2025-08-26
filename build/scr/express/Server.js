"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
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
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    };
    routes = () => {
        this.app.use('/', this.productView.router);
        this.app.use('/', this.itemView.router);
        this.app.use('/', this.weaponView.router);
        this.app.use('/', this.epicView.router);
        this.app.use('/', this.armorView.router);
    };
    static = () => {
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../assets/img')));
    };
    start = () => {
        const port = 1882;
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    };
}
exports.default = Server;
