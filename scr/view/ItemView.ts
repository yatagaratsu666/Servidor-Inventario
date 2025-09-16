import { Router } from "express";
import ItemController from "../controller/ItemController";

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Endpoints para la gestión de Ítems en el sistema.
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
   */
  readonly routes = (): void => {
    /**
     * @swagger
     * /items:
     *   get:
     *     summary: Obtener todos los ítems
     *     description: Retorna un listado completo de todos los ítems registrados en el sistema.
     *     tags: [Items]
     *     responses:
     *       200:
     *         description: Lista de ítems obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Item'
     */
    this.router.get("/items", this.itemController.getItems);

    /**
     * @swagger
     * /items/{id}:
     *   get:
     *     summary: Obtener un ítem por ID
     *     description: Retorna la información detallada de un ítem específico.
     *     tags: [Items]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del ítem.
     *     responses:
     *       200:
     *         description: Ítem encontrado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     *       404:
     *         description: Ítem no encontrado.
     */
    this.router.get("/items/:id", this.itemController.getItemById);

    /**
     * @swagger
     * /items/create:
     *   post:
     *     summary: Crear un nuevo ítem
     *     description: Permite registrar un nuevo ítem en el sistema.
     *     tags: [Items]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *     responses:
     *       201:
     *         description: Ítem creado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     *       400:
     *         description: Datos inválidos enviados en la solicitud.
     */
    this.router.post("/items/create", this.itemController.createItem);

    /**
     * @swagger
     * /items/delete/{id}:
     *   put:
     *     summary: Eliminar (desactivar) un ítem
     *     description: Cambia el estado del ítem a inactivo o lo elimina lógicamente.
     *     tags: [Items]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del ítem.
     *     responses:
     *       200:
     *         description: Ítem desactivado exitosamente.
     *       404:
     *         description: Ítem no encontrado.
     */
    this.router.put("/items/delete/:id", this.itemController.deleteItem);

    /**
     * @swagger
     * /items/modify/{id}:
     *   put:
     *     summary: Modificar un ítem
     *     description: Actualiza la información de un ítem existente.
     *     tags: [Items]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único del ítem.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *     responses:
     *       200:
     *         description: Ítem modificado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     *       404:
     *         description: Ítem no encontrado.
     */
    this.router.put("/items/modify/:id", this.itemController.updateItem);



    this.router.patch("/items/:id/status", this.itemController.updateItemStatus);
  };


}

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       description: Representa la estructura de un ítem en el sistema.
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del ítem.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del ítem.
 *           example: "Poción de Vida"
 *         itemType:
 *           type: string
 *           description: Tipo de ítem, por ejemplo poción, llave, consumible.
 *           example: "poción"
 *         description:
 *           type: string
 *           description: Descripción detallada del ítem y sus efectos.
 *           example: "Restaura 50 puntos de vida al héroe que la usa."
 *         status:
 *           type: boolean
 *           description: Estado del ítem como activo o inactivo.
 *           example: true
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario.
 *           example: 20
 *         effects:
 *           type: array
 *           description: Lista de efectos que otorga el ítem al héroe que lo usa.
 *           items:
 *             type: object
 *             properties:
 *               effectType:
 *                 type: string
 *                 description: Tipo de efecto como curación, aumento de ataque, resistencia.
 *                 example: "curación"
 *               value:
 *                 type: string
 *                 description: Valor del efecto.
 *                 example: "+50 HP"
 *               durationTurns:
 *                 type: integer
 *                 description: Número de turnos que dura el efecto.
 *                 example: 1
 *         dropRate:
 *           type: number
 *           description: Probabilidad de que el ítem aparezca como botín.
 *           example: 0.2
 */
