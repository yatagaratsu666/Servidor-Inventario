import { Router } from "express";
import HeroController from "../controller/HeroController";

export default class HeroView{
    router: Router

    constructor(private readonly heroController: HeroController){
        this.router = Router()
        this.routes()
    }

    readonly routes = (): void => {
        this.router.get("/heroes", this.heroController.getHeroes);
        this.router.get("/heroes/:id", this.heroController.getHeroById);
        this.router.post("/heroes/create", this.heroController.createHero);
        this.router.delete("/heroes/delete/:id", this.heroController.deleteHero);
        this.router.put("/heroes/modify/:id", this.heroController.updateHero);
       // inserte rutas aqui :333
    }
}