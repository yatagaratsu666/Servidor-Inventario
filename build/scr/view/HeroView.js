"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class HeroView {
    heroController;
    router;
    constructor(heroController) {
        this.heroController = heroController;
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes = () => {
        this.router.get("/heroes", this.heroController.getHeroes);
        this.router.get("/heroes/:id", this.heroController.getHeroById);
        this.router.post("/heroes/create", this.heroController.createHero);
        this.router.put("/heroes/delete/:id", this.heroController.deleteHero);
        this.router.put("/heroes/modify/:id", this.heroController.updateHero);
        // inserte rutas aqui :333
    };
}
exports.default = HeroView;
