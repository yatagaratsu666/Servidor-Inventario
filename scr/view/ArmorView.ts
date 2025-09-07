import { Router } from "express";
import ArmorController from "../controller/ArmorController";

/**
 * @swagger
 * tags:
 *   name: Armors
 *   description: Endpoints para la gestión de Armaduras en el sistema.
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
   */
  readonly routes = (): void => {
    /**
     * @swagger
     * /armors:
     *   get:
     *     summary: Obtener todas las armaduras
     *     description: Retorna un listado completo de todas las armaduras registradas en el sistema.
     *     tags: [Armors]
     *     responses:
     *       200:
     *         description: Lista de armaduras obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Armor'
     */
    this.router.get("/armors", this.armorController.getArmor);

    /**
     * @swagger
     * /armors/{id}:
     *   get:
     *     summary: Obtener una armadura por ID
     *     description: Retorna la información detallada de una armadura específica.
     *     tags: [Armors]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único de la armadura.
     *     responses:
     *       200:
     *         description: Armadura encontrada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Armor'
     *       404:
     *         description: Armadura no encontrada.
     */
    this.router.get("/armors/:id", this.armorController.getArmorById);

    /**
     * @swagger
     * /armors/create:
     *   post:
     *     summary: Crear una nueva armadura
     *     description: Permite registrar una nueva armadura en el sistema.
     *     tags: [Armors]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Armor'
     *     responses:
     *       201:
     *         description: Armadura creada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Armor'
     *       400:
     *         description: Datos inválidos enviados en la solicitud.
     */
    this.router.post("/armors/create", this.armorController.createArmor);

    /**
     * @swagger
     * /armors/delete/{id}:
     *   put:
     *     summary: Eliminar (desactivar) una armadura
     *     description: Cambia el estado de la armadura a inactiva o la elimina lógicamente.
     *     tags: [Armors]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único de la armadura.
     *     responses:
     *       200:
     *         description: Armadura desactivada exitosamente.
     *       404:
     *         description: Armadura no encontrada.
     */
    this.router.put("/armors/delete/:id", this.armorController.deleteArmor);

    /**
     * @swagger
     * /armors/modify/{id}:
     *   put:
     *     summary: Modificar una armadura
     *     description: Actualiza la información de una armadura existente.
     *     tags: [Armors]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID único de la armadura.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Armor'
     *     responses:
     *       200:
     *         description: Armadura modificada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Armor'
     *       404:
     *         description: Armadura no encontrada.
     */
    this.router.put("/armors/modify/:id", this.armorController.updateArmor);
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Armor:
 *       type: object
 *       description: Representa la estructura de una armadura en el sistema.
 *       properties:
 *         image:
 *           type: string
 *           description: URL o ruta de la imagen asociada a la armadura.
 *           example: "https://example.com/armor.png"
 *         id:
 *           type: integer
 *           description: Identificador único de la armadura.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre de la armadura.
 *           example: "Armadura de Dragón"
 *         armorType:
 *           type: string
 *           description: Tipo de armadura como ligera, pesada, mágica, etc.
 *           example: "pesada"
 *         heroType:
 *           type: string
 *           description: Tipo de héroe que puede equipar esta armadura.
 *           example: "guerrero"
 *         description:
 *           type: string
 *           description: Descripción detallada de la armadura.
 *           example: "Una armadura forjada con escamas de dragón, altamente resistente."
 *         status:
 *           type: boolean
 *           description: Estado de la armadura activa o inactiva.
 *           example: true
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario.
 *           example: 10
 *         effects:
 *           type: array
 *           description: Lista de efectos que otorga la armadura.
 *           items:
 *             type: object
 *             properties:
 *               effectType:
 *                 type: string
 *                 description: Tipo de efecto como defensa, resistencia, regeneración, etc
 *                 example: "defensa"
 *               value:
 *                 type: string
 *                 description: Valor del efecto.
 *                 example: "+15"
 *               durationTurns:
 *                 type: integer
 *                 description: Número de turnos en que el efecto está activo.
 *                 example: 5
 *         dropRate:
 *           type: number
 *           description: Probabilidad de que la armadura aparezca como botín.
 *           example: 0.25
 */
