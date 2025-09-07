import { Router } from "express";
import WeaponController from "../controller/WeaponController";

/**
 * @swagger
 * tags:
 *   name: Weapons
 *   description: Endpoints para la gestión de Armas en el sistema.
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
   */
  readonly routes = (): void => {
    /**
     * @swagger
     * /weapons:
     *   get:
     *     summary: Obtener todas las armas
     *     description: Retorna un listado completo de todas las armas registradas en el sistema.
     *     tags: [Weapons]
     *     responses:
     *       200:
     *         description: Lista de armas obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Weapon'
     */
    this.router.get("/weapons", this.weaponController.getWeapons);

    /**
     * @swagger
     * /weapons/{id}:
     *   get:
     *     summary: Obtener un arma por ID
     *     description: Retorna la información detallada de un arma específica.
     *     tags: [Weapons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del arma.
     *     responses:
     *       200:
     *         description: Arma encontrada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Weapon'
     *       404:
     *         description: Arma no encontrada.
     */
    this.router.get("/weapons/:id", this.weaponController.getWeaponById);

    /**
     * @swagger
     * /weapons/create:
     *   post:
     *     summary: Crear un nuevo arma
     *     description: Permite registrar un nuevo arma en el sistema.
     *     tags: [Weapons]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Weapon'
     *     responses:
     *       201:
     *         description: Arma creada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Weapon'
     *       400:
     *         description: Datos inválidos enviados en la solicitud.
     */
    this.router.post("/weapons/create", this.weaponController.createWeapon);

    /**
     * @swagger
     * /weapons/delete/{id}:
     *   put:
     *     summary: Eliminar (desactivar) un arma
     *     description: Cambia el estado del arma a inactiva o la elimina lógicamente.
     *     tags: [Weapons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del arma.
     *     responses:
     *       200:
     *         description: Arma desactivada exitosamente.
     *       404:
     *         description: Arma no encontrada.
     */
    this.router.put("/weapons/delete/:id", this.weaponController.deleteWeapon);

    /**
     * @swagger
     * /weapons/modify/{id}:
     *   put:
     *     summary: Modificar un arma
     *     description: Actualiza la información de un arma existente.
     *     tags: [Weapons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del arma.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Weapon'
     *     responses:
     *       200:
     *         description: Arma modificada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Weapon'
     *       404:
     *         description: Arma no encontrada.
     */
    this.router.put("/weapons/modify/:id", this.weaponController.updateWeapon);
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Weapon:
 *       type: object
 *       description: Representa la estructura de un arma en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del arma.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del arma.
 *           example: "Espada Larga"
 *         weaponType:
 *           type: string
 *           description: Tipo de arma como espada, arco, mágica, etc.
 *           example: "espada"
 *         heroType:
 *           type: string
 *           description: Tipo de héroe que puede usar el arma.
 *           example: "guerrero"
 *         damage:
 *           type: integer
 *           description: Cantidad de daño que inflige el arma.
 *           example: 35
 *         description:
 *           type: string
 *           description: Descripción detallada del arma.
 *           example: "Una espada forjada en acero valyrio, muy resistente."
 *         status:
 *           type: boolean
 *           description: Estado del arma como activa o inactiva
 *           example: true
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario.
 *           example: 5
 *         effects:
 *           type: array
 *           description: Lista de efectos que otorga el arma al héroe que la equipa.
 *           items:
 *             type: object
 *             properties:
 *               effectType:
 *                 type: string
 *                 description: Tipo de efecto como daño extra, crítico, veneno
 *                 example: "crítico"
 *               value:
 *                 type: string
 *                 description: Valor del efecto.
 *                 example: "+10%"
 *               durationTurns:
 *                 type: integer
 *                 description: Número de turnos que dura el efecto.
 *                 example: 3
 *         dropRate:
 *           type: number
 *           description: Probabilidad de que el arma aparezca como botín.
 *           example: 0.15
 */
