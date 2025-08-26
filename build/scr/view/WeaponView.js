"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class WeaponView {
    weaponController;
    router;
    constructor(weaponController) {
        this.weaponController = weaponController;
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes = () => {
        this.router.get("/weapons", this.weaponController.getWeapons);
        this.router.get("/weapons/:id", this.weaponController.getWeaponById);
        this.router.post("/weapons/create", this.weaponController.createWeapon);
        this.router.put("/weapons/delete/:id", this.weaponController.deleteWeapon);
        this.router.put("/weapons/modify/:id", this.weaponController.updateWeapon);
        // inserte rutas aqui :333
    };
}
exports.default = WeaponView;
