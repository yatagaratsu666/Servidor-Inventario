import { Router } from "express";
import EpicController from "../controller/EpicController";

export default class EpicView{
    router: Router

    constructor(private readonly epicController: EpicController){
        this.router = Router()
        this.routes()
    }

    readonly routes = (): void => {
        this.router.get("/epics", this.epicController.getEpics);
        this.router.get("/epics/:id", this.epicController.getEpicById);
        this.router.post("/epics/create", this.epicController.createEpic);
        this.router.delete("/epics/delete/:id", this.epicController.deleteEpic);
        this.router.put("/epics/modify/:id", this.epicController.updateEpic);
       // inserte rutas aqui :333
    }
}