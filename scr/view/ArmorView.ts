import { Router } from "express";
import ArmorController from "../controller/ArmorController";

/**
 * @description Vista encargada de definir las rutas relacionadas con la gestión de Armaduras.
 */
export default class ArmorView {
  /** @description Instancia del enrutador de Express utilizada para definir las rutas. */
  router: Router;

  /**
   * @description Inicializa la vista de Armaduras con el controlador correspondiente.
   * @param armorController Controlador que contiene la lógica de negocio para las armaduras.
   */
  constructor(private readonly armorController: ArmorController) {
    this.router = Router();
    this.routes();
  }

  /**
   * @description Define todas las rutas disponibles para la gestión de armaduras.
   * - `GET /armors`: Obtiene todas las armaduras.
   * - `GET /armors/:id`: Obtiene una armadura específica por su ID.
   * - `POST /armors/create`: Crea una nueva armadura.
   * - `PUT /armors/delete/:id`: Elimina (o desactiva) una armadura por ID.
   * - `PUT /armors/modify/:id`: Modifica una armadura existente.
   */
  readonly routes = (): void => {
    this.router.get("/armors", this.armorController.getArmor);
    this.router.get("/armors/:id", this.armorController.getArmorById);
    this.router.post("/armors/create", this.armorController.createArmor);
    this.router.put("/armors/delete/:id", this.armorController.deleteArmor);
    this.router.put("/armors/modify/:id", this.armorController.updateArmor);
  };
}
