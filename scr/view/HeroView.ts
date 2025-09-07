import { Router } from "express";
import HeroController from "../controller/HeroController";

/**
 * @swagger
 * tags:
 *   name: Heroes
 *   description: Endpoints para la gestión de Héroes en el sistema.
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
   */
  readonly routes = (): void => {
    /**
     * @swagger
     * /heroes:
     *   get:
     *     summary: Obtener todos los héroes
     *     description: Retorna un listado completo de todos los héroes registrados en el sistema.
     *     tags: [Heroes]
     *     responses:
     *       200:
     *         description: Lista de héroes obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Hero'
     */
    this.router.get("/heroes", this.heroController.getHeroes);

    /**
     * @swagger
     * /heroes/{id}:
     *   get:
     *     summary: Obtener un héroe por ID
     *     description: Retorna la información detallada de un héroe específico.
     *     tags: [Heroes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del héroe.
     *     responses:
     *       200:
     *         description: Héroe encontrado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Hero'
     *       404:
     *         description: Héroe no encontrado.
     */
    this.router.get("/heroes/:id", this.heroController.getHeroById);

    /**
     * @swagger
     * /heroes/create:
     *   post:
     *     summary: Crear un nuevo héroe
     *     description: Permite registrar un nuevo héroe en el sistema.
     *     tags: [Heroes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Hero'
     *     responses:
     *       201:
     *         description: Héroe creado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Hero'
     *       400:
     *         description: Datos inválidos enviados en la solicitud.
     */
    this.router.post("/heroes/create", this.heroController.createHero);

    /**
     * @swagger
     * /heroes/delete/{id}:
     *   put:
     *     summary: Eliminar (desactivar) un héroe
     *     description: Cambia el estado del héroe a inactivo o lo elimina lógicamente.
     *     tags: [Heroes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del héroe.
     *     responses:
     *       200:
     *         description: Héroe desactivado exitosamente.
     *       404:
     *         description: Héroe no encontrado.
     */
    this.router.put("/heroes/delete/:id", this.heroController.deleteHero);

    /**
     * @swagger
     * /heroes/modify/{id}:
     *   put:
     *     summary: Modificar un héroe
     *     description: Actualiza la información de un héroe existente.
     *     tags: [Heroes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del héroe.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Hero'
     *     responses:
     *       200:
     *         description: Héroe modificado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Hero'
     *       404:
     *         description: Héroe no encontrado.
     */
    this.router.put("/heroes/modify/:id", this.heroController.updateHero);
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       description: Representa la estructura de un héroe en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del héroe.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del héroe.
 *           example: "Arthas"
 *         heroType:
 *           type: string
 *           description: Tipo de héroe, por ejemplo guerrero, mago o arquero.
 *           example: "guerrero"
 *         description:
 *           type: string
 *           description: Descripción detallada del héroe.
 *           example: "Héroe valiente especializado en combate cuerpo a cuerpo."
 *         image:
 *           type: string
 *           description: URL de la imagen asociada al héroe.
 *           example: "http://imagen.heroe.com/arthas.png"
 *         level:
 *           type: integer
 *           description: Nivel actual del héroe.
 *           example: 10
 *         power:
 *           type: integer
 *           description: Cantidad de poder del héroe.
 *           example: 50
 *         health:
 *           type: integer
 *           description: Puntos de salud del héroe.
 *           example: 200
 *         defense:
 *           type: integer
 *           description: Puntos de defensa del héroe.
 *           example: 30
 *         status:
 *           type: boolean
 *           description: Estado actual del héroe.
 *           example: true
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario.
 *           example: 1
 *         attack:
 *           type: integer
 *           description: Puntos de ataque base del héroe.
 *           example: 40
 *         attackBoost:
 *           type: object
 *           description: Rango de incremento de ataque que puede obtener el héroe.
 *           properties:
 *             min:
 *               type: integer
 *               description: Valor mínimo del incremento de ataque.
 *               example: 5
 *             max:
 *               type: integer
 *               description: Valor máximo del incremento de ataque.
 *               example: 10
 *         damage:
 *           type: object
 *           description: Rango de daño que puede infligir el héroe.
 *           properties:
 *             min:
 *               type: integer
 *               description: Daño mínimo.
 *               example: 10
 *             max:
 *               type: integer
 *               description: Daño máximo.
 *               example: 25
 *         specialActions:
 *           type: array
 *           description: Lista de acciones especiales que el héroe puede realizar, estas van cambiando durante una partida pero por defecto están vacías.
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la acción especial.
 *                 example: " "
 *               actionType:
 *                 type: string
 *                 description: Tipo de acción especial, por ejemplo ataque, defensa o soporte.
 *                 example: " "
 *               powerCost:
 *                 type: integer
 *                 description: Costo en poder para ejecutar la acción.
 *                 example: 0
 *               cooldown:
 *                 type: integer
 *                 description: Tiempo de espera en turnos para volver a usar la acción.
 *                 example: 0
 *               isAvailable:
 *                 type: boolean
 *                 description: Indica si la acción está disponible.
 *                 example: true
 *         effect:
 *           type: object
 *           description: Efecto especial que puede aplicar el héroe, estas van cambiando durante una partida pero por defecto están vacías.
 *           properties:
 *             effectType:
 *               type: string
 *               description: Tipo de efecto.
 *               example: " "
 *             value:
 *               type: string
 *               description: Valor del efecto.
 *               example: "0"
 *             durationTurns:
 *               type: integer
 *               description: Duración del efecto en turnos.
 *               example: 0
 */
