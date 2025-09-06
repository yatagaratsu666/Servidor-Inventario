import { Router } from "express"; 
import EpicController from "../controller/EpicController";

/**
 * @description Vista encargada de definir las rutas relacionadas con la gestión de Épicas.
 */
export default class EpicView {
  /** @description Instancia del enrutador de Express utilizada para definir las rutas. */
  router: Router;

  /**
   * @description Inicializa la vista de Épicas con el controlador correspondiente.
   * @param epicController Controlador que contiene la lógica de negocio para las épicas.
   */
  constructor(private readonly epicController: EpicController) {
    this.router = Router();
    this.routes();
  }

  /**
   * @description Define todas las rutas disponibles para la gestión de épicas.
   * - `GET /epics`: Obtiene todas las épicas.
   * - `GET /epics/:id`: Obtiene una épica específica por su ID.
   * - `POST /epics/create`: Crea una nueva épica.
   * - `PUT /epics/delete/:id`: Elimina (o desactiva) una épica por ID.
   * - `PUT /epics/modify/:id`: Modifica una épica existente.
   */
  readonly routes = (): void => {
    this.router.get("/epics", this.epicController.getEpics);
    this.router.get("/epics/:id", this.epicController.getEpicById);
    this.router.post("/epics/create", this.epicController.createEpic);
    this.router.put("/epics/delete/:id", this.epicController.deleteEpic);
    this.router.put("/epics/modify/:id", this.epicController.updateEpic);
  };
}
