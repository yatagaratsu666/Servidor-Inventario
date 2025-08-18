import { Router } from "express";
import ItemController from "../controller/ItemController";

export default class ItemView {
    router: Router;

    constructor(private readonly itemController: ItemController) {
        this.router = Router();
        this.routes();
    }

    readonly routes = (): void => {
        this.router.get("/items", this.itemController.getItems);
        this.router.get("/items/:id", this.itemController.getItemById);
        this.router.post("/items/create", this.itemController.createItem);
        this.router.delete("/items/delete/:id", this.itemController.deleteItem);
        this.router.put("/items/modify/:id", this.itemController.updateItem);
    };
}
