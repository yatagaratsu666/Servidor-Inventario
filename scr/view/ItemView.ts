import { Router } from "express";
import ItemController from "../controller/ItemController";

/**
 * @description Vista encargada de definir las rutas relacionadas con la gestión de Ítems.
 */
export default class ItemView {
  /** @description Instancia del enrutador de Express utilizada para definir las rutas. */
  router: Router;

  /**
   * @description Inicializa la vista de Ítems con el controlador correspondiente.
   * @param itemController Controlador que contiene la lógica de negocio para los ítems.
   */
  constructor(private readonly itemController: ItemController) {
    this.router = Router();
    this.routes();
  }

  /**
   * @description Define todas las rutas disponibles para la gestión de ítems.
   * - `GET /items`: Obtiene todos los ítems.
   * - `GET /items/:id`: Obtiene un ítem específico por su ID.
   * - `POST /items/create`: Crea un nuevo ítem.
   * - `PUT /items/delete/:id`: Elimina (o desactiva) un ítem por ID.
   * - `PUT /items/modify/:id`: Modifica un ítem existente.
   */
  readonly routes = (): void => {
    this.router.get("/items", this.itemController.getItems);
    this.router.get("/items/:id", this.itemController.getItemById);
    this.router.post("/items/create", this.itemController.createItem);
    this.router.put("/items/delete/:id", this.itemController.deleteItem);
    this.router.put("/items/modify/:id", this.itemController.updateItem);
  };
}
