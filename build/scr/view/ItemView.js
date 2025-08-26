"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ItemView {
    itemController;
    router;
    constructor(itemController) {
        this.itemController = itemController;
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes = () => {
        this.router.get("/items", this.itemController.getItems);
        this.router.get("/items/:id", this.itemController.getItemById);
        this.router.post("/items/create", this.itemController.createItem);
        this.router.put("/items/delete/:id", this.itemController.deleteItem);
        this.router.put("/items/modify/:id", this.itemController.updateItem);
    };
}
exports.default = ItemView;
