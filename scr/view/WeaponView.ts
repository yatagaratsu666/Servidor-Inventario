import { Router } from "express";
import WeaponController from "../controller/WeaponController";

export default class WeaponView{
    router: Router

    constructor(private readonly weaponController: WeaponController){
        this.router = Router()
        this.routes()
    }

    readonly routes = (): void => {
        this.router.get("/weapons", this.weaponController.getWeapons);
        this.router.get("/weapons/:id", this.weaponController.getWeaponById);
        this.router.post("/weapons/create", this.weaponController.createWeapon);
        this.router.put("/weapons/delete/:id", this.weaponController.deleteWeapon);
        this.router.put("/weapons/modify/:id", this.weaponController.updateWeapon);
       // inserte rutas aqui :333
    }
}