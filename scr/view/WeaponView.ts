import { Router } from "express";
import WeaponController from "../controller/WeaponController";

/**
 * @description Vista encargada de definir las rutas relacionadas con la gestión de Armas.
 */
export default class WeaponView {
  /** @description Instancia del enrutador de Express utilizada para definir las rutas. */
  router: Router;

  /**
   * @description Inicializa la vista de Armas con el controlador correspondiente.
   * @param weaponController Controlador que contiene la lógica de negocio para las armas.
   */
  constructor(private readonly weaponController: WeaponController) {
    this.router = Router();
    this.routes();
  }

  /**
   * @description Define todas las rutas disponibles para la gestión de armas.
   * - `GET /weapons`: Obtiene todas las armas.
   * - `GET /weapons/:id`: Obtiene un arma específica por su ID.
   * - `POST /weapons/create`: Crea una nueva arma.
   * - `PUT /weapons/delete/:id`: Elimina (o desactiva) un arma por ID.
   * - `PUT /weapons/modify/:id`: Modifica un arma existente.
   */
  readonly routes = (): void => {
    this.router.get("/weapons", this.weaponController.getWeapons);
    this.router.get("/weapons/:id", this.weaponController.getWeaponById);
    this.router.post("/weapons/create", this.weaponController.createWeapon);
    this.router.put("/weapons/delete/:id", this.weaponController.deleteWeapon);
    this.router.put("/weapons/modify/:id", this.weaponController.updateWeapon);
  };
}
