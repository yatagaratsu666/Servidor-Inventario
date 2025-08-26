"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class EpicView {
    epicController;
    router;
    constructor(epicController) {
        this.epicController = epicController;
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes = () => {
        this.router.get("/epics", this.epicController.getEpics);
        this.router.get("/epics/:id", this.epicController.getEpicById);
        this.router.post("/epics/create", this.epicController.createEpic);
        this.router.put("/epics/delete/:id", this.epicController.deleteEpic);
        this.router.put("/epics/modify/:id", this.epicController.updateEpic);
        // inserte rutas aqui :333
    };
}
exports.default = EpicView;
