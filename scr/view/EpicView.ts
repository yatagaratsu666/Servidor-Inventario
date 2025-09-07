import { Router } from "express";
import EpicController from "../controller/EpicController";

/**
 * @swagger
 * tags:
 *   name: Epics
 *   description: Endpoints para la gestión de objetos Épicos en el sistema.
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
   */
  readonly routes = (): void => {
    /**
     * @swagger
     * /epics:
     *   get:
     *     summary: Obtener todas las épicas
     *     description: Retorna un listado completo de todos los objetos épicos registrados en el sistema.
     *     tags: [Epics]
     *     responses:
     *       200:
     *         description: Lista de épicas obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Epic'
     */
    this.router.get("/epics", this.epicController.getEpics);

    /**
     * @swagger
     * /epics/{id}:
     *   get:
     *     summary: Obtener una épica por ID
     *     description: Retorna la información detallada de un objeto épico específico.
     *     tags: [Epics]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del objeto épico.
     *     responses:
     *       200:
     *         description: Objeto épico encontrado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Epic'
     *       404:
     *         description: Objeto épico no encontrado.
     */
    this.router.get("/epics/:id", this.epicController.getEpicById);

    /**
     * @swagger
     * /epics/create:
     *   post:
     *     summary: Crear un nuevo objeto épico
     *     description: Permite registrar un nuevo objeto épico en el sistema.
     *     tags: [Epics]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Epic'
     *     responses:
     *       201:
     *         description: Objeto épico creado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Epic'
     *       400:
     *         description: Datos inválidos enviados en la solicitud.
     */
    this.router.post("/epics/create", this.epicController.createEpic);

    /**
     * @swagger
     * /epics/delete/{id}:
     *   put:
     *     summary: Eliminar (desactivar) un objeto épico
     *     description: Cambia el estado del objeto épico a inactivo o lo elimina lógicamente.
     *     tags: [Epics]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del objeto épico.
     *     responses:
     *       200:
     *         description: Objeto épico desactivado exitosamente.
     *       404:
     *         description: Objeto épico no encontrado.
     */
    this.router.put("/epics/delete/:id", this.epicController.deleteEpic);

    /**
     * @swagger
     * /epics/modify/{id}:
     *   put:
     *     summary: Modificar un objeto épico
     *     description: Actualiza la información de un objeto épico existente.
     *     tags: [Epics]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del objeto épico.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Epic'
     *     responses:
     *       200:
     *         description: Objeto épico modificado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Epic'
     *       404:
     *         description: Objeto épico no encontrado.
     */
    this.router.put("/epics/modify/:id", this.epicController.updateEpic);
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Epic:
 *       type: object
 *       description: Representa un objeto épico en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del objeto.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del objeto épico.
 *           example: "Espada Legendaria"
 *         heroType:
 *           type: string
 *           description: Tipo de héroe al que está destinado el objeto.
 *           example: "guerrero"
 *         description:
 *           type: string
 *           description: Descripción detallada del objeto.
 *           example: "Espada mágica que aumenta el ataque del héroe."
 *         image:
 *           type: string
 *           description: URL de la imagen asociada al objeto.
 *           example: "http://imagen.epica.com/espada.png"
 *         status:
 *           type: boolean
 *           description: Estado actual del objeto.
 *           example: true
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario.
 *           example: 2
 *         effects:
 *           type: array
 *           description: Lista de efectos asociados al objeto.
 *           items:
 *             type: object
 *             properties:
 *               effectType:
 *                 type: string
 *                 description: Tipo de efecto.
 *                 example: " "
 *               value:
 *                 type: string
 *                 description: Valor del efecto.
 *                 example: "0"
 *               durationTurns:
 *                 type: integer
 *                 description: Duración del efecto en turnos.
 *                 example: 0
 *         cooldown:
 *           type: integer
 *           description: Tiempo de espera (cooldown) en turnos para volver a usar el objeto.
 *           example: 3
 *         isAvailable:
 *           type: boolean
 *           description: Indica si el objeto está disponible para ser utilizado.
 *           example: true
 *         masterChance:
 *           type: number
 *           description: Probabilidad de éxito al usar el objeto maestro.
 *           example: 0.15
*/