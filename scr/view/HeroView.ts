import { Router } from "express";
import HeroController from "../controller/HeroController";

/**
 * @description Vista encargada de definir las rutas relacionadas con la gestión de Héroes.
 */
export default class HeroView {
  /** @description Instancia del enrutador de Express utilizada para definir las rutas. */
  router: Router;

  /**
   * @description Inicializa la vista de Héroes con el controlador correspondiente.
   * @param heroController Controlador que contiene la lógica de negocio para los héroes.
   */
  constructor(private readonly heroController: HeroController) {
    this.router = Router();
    this.routes();
  }

  /**
   * @description Define todas las rutas disponibles para la gestión de héroes.
   * - `GET /heroes`: Obtiene todos los héroes.
   * - `GET /heroes/:id`: Obtiene un héroe específico por su ID.
   * - `POST /heroes/create`: Crea un nuevo héroe.
   * - `PUT /heroes/delete/:id`: Elimina (o desactiva) un héroe por ID.
   * - `PUT /heroes/modify/:id`: Modifica un héroe existente.
   */
  readonly routes = (): void => {
    this.router.get("/heroes", this.heroController.getHeroes);
    this.router.get("/heroes/:id", this.heroController.getHeroById);
    this.router.post("/heroes/create", this.heroController.createHero);
    this.router.put("/heroes/delete/:id", this.heroController.deleteHero);
    this.router.put("/heroes/modify/:id", this.heroController.updateHero);
  };
}
