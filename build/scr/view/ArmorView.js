"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ArmorView {
    armorController;
    router;
    constructor(armorController) {
        this.armorController = armorController;
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes = () => {
        this.router.get("/armors", this.armorController.getArmor);
        this.router.get("/armors/:id", this.armorController.getArmorById);
        this.router.post("/armors/create", this.armorController.createArmor);
        this.router.put("/armors/delete/:id", this.armorController.deleteArmor);
        this.router.put("/armors/modify/:id", this.armorController.updateArmor);
        // inserte rutas aqui :333
    };
}
exports.default = ArmorView;
