import { Request, Response } from "express";
import EpicModel from "../model/EpicModel";
import { EpicInterface } from "../types/EpicInterface";

/**
 * @class EpicController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con las épicas.
 * Contiene métodos para obtener, crear, actualizar y eliminar épicas.
 */
export default class EpicController {
  /**
   * @param {EpicModel} epicModel Instancia del modelo `EpicModel` para interactuar con la base de datos.
   */
  constructor(private readonly epicModel: EpicModel) {}

  /**
   * @async
   * @function getEpics
   * @description Obtiene todas las épicas disponibles en la base de datos.
   * @param {_req} _req Objeto de la petición HTTP (no se utiliza en este método).
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un JSON con todas las épicas registradas.
   */
  readonly getEpics = async (_req: Request, res: Response): Promise<void> => {
    try {
      const heroes = await this.epicModel.getAllEpics();
      res.status(200).json(heroes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener héroes", error });
    }
  };

  /**
   * @async
   * @function getEpicById
   * @description Obtiene una épica específica por su ID.
   * @param {Request} req Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve la épica encontrada o un error 404 si no existe.
   */
  readonly getEpicById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      const hero = await this.epicModel.getEpicById(heroId);

      if (!hero) {
        res.status(404).json({ message: "epica no encontrada" });
        return;
      }

      res.status(200).json(hero);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener epica por ID", error });
    }
  };

  /**
   * @async
   * @function createEpic
   * @description Crea una nueva épica en la base de datos.
   * @param {Request} req Objeto de la petición HTTP que contiene los datos de la épica en el body.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito y la épica creada.
   * @example
   * // Body de ejemplo para la creación
   * {
   *   "name": "Espada Épica",
   *   "heroType": "guerrero",
   *   "description": "Aumenta el ataque del héroe en 20 puntos",
   *   "status": true,
   *   "stock": 5,
   *   "effects": [
   *     { "effectType": "daño", "value": 10, "durationTurns": 0 }
   *   ],
   *   "cooldown": 2,
   *   "isAvailable": true,
   *   "masterChance": 0.1
   * }
   */
  readonly createEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const epic: EpicInterface = req.body;

      if (!epic || !epic.name) {
        res.status(400).json({ message: "Faltan datos de la epica" });
        return;
      }

      await this.epicModel.createEpic(epic);
      res.status(201).json({ message: "Epica creada con éxito", epic });
    } catch (error) {
      console.error("Error al crear epica:", error);
      res.status(500).json({ message: "Error al crear epica" });
    }
  };

  /**
   * @async
   * @function deleteEpic
   * @description Elimina (o desactiva) una épica por su ID.
   * @param {Request} req Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito o error si la épica no existe.
   */
  readonly deleteEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const epicId = parseInt(id, 10);

      if (isNaN(epicId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await this.epicModel.toggleEpicStatusById(epicId);

      if (!deleted) {
        res
          .status(404)
          .json({ message: `No se encontró epica con id ${epicId}` });
        return;
      }

      res
        .status(200)
        .json({ message: `Epica con id ${epicId} eliminado con éxito` });
    } catch (error) {
      console.error("Error en deleteEpic:", error);
      res.status(500).json({ message: "Error al eliminar epica", error });
    }
  };

  /**
   * @async
   * @function updateEpic
   * @description Actualiza los datos de una épica por su ID.
   * @param {Request} req Objeto de la petición HTTP que contiene el parámetro `id` y los campos a actualizar en body.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve la épica actualizada o un error si no existe.
   * @example
   * // Body de ejemplo para actualización
   * {
   *   "name": "Espada Épica Mejorada",
   *   "stock": 10,
   *   "effects": [
   *     { "effectType": "defensa", "value": 15, "durationTurns": 0 }
   *   ]
   * }
   */
  readonly updateEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const epicId = parseInt(id, 10);
      const updatedFields: Partial<EpicInterface> = req.body;

      if (isNaN(epicId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        res
          .status(400)
          .json({ message: "No se enviaron campos para actualizar" });
        return;
      }

      const updatedEpic = await this.epicModel.updateEpicById(
        epicId,
        updatedFields
      );

      if (!updatedEpic) {
        res
          .status(404)
          .json({ message: `No se encontró epica con id ${epicId}` });
        return;
      }

      res
        .status(200)
        .json({
          message: `Epica con id ${epicId} actualizado con éxito`,
          updatedEpic,
        });
    } catch (error) {
      console.error("Error en updateEpic:", error);
      res.status(500).json({ message: "Error al actualizar epica", error });
    }
  };
}
