import { Router } from "express";
import ArmorController from "../controller/ArmorController";

export default class ArmorView{
    router: Router

    constructor(private readonly armorController: ArmorController){
        this.router = Router()
        this.routes()
    }

    readonly routes = (): void => {
        this.router.get("/armors", this.armorController.getArmor);
        this.router.get("/armors/:id", this.armorController.getArmorById);
        this.router.post("/armors/create", this.armorController.createArmor);
        this.router.delete("/armors/delete/:id", this.armorController.deleteArmor);
        this.router.put("/armors/modify/:id", this.armorController.updateArmor);
       // inserte rutas aqui :333
    }
}