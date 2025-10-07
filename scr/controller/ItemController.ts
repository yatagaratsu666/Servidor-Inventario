import { Request, Response } from "express";
import ItemModel from "../model/ItemModel";
import ItemInterface from "../types/ItemInterface";

/**
 * @class ItemController
 * @classdesc Controlador encargado de manejar las operaciones CRUD relacionadas con los items.
 * Proporciona métodos para obtener, crear, actualizar y eliminar items.
 */
export default class ItemController {

  /**
 * @param {ItemModel} itemModel Instancia del modelo `ItemModel` para interactuar con la base de datos.
 */
  constructor(private readonly itemModel: ItemModel) { }

  /**
   * @async
   * @function getItems
   * @description Obtiene todos los items disponibles en la base de datos.
   * @param {_req} _req Objeto de la solicitud HTTP (no se utiliza en este método).
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un JSON con todos los items registrados.
   */
  readonly getItems = async (_req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemModel.getAllItems();
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener items", error });
    }
  };

  /**
   * @async
   * @function getItemById
   * @description Obtiene un item específico por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el item encontrado o un error 404 si no existe.
   */
  readonly getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      const hero = await this.itemModel.getItemById(heroId);

      if (!hero) {
        res.status(404).json({ message: "Héroe no encontrado" });
        return;
      }

      res.status(200).json(hero);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener héroe por ID", error });
    }
  };

  /**
   * @async
   * @function createItem
   * @description Crea un nuevo item en la base de datos.
   * @param {Request} req Objeto de la solicitud HTTP que contiene los datos del item en el cuerpo.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito y el item creado.
   * @example
   * // Body de ejemplo para creación
   * {
   *   "name": "Armadura del Dragón",
   *   "heroType": "guerrero",
   *   "description": "Proporciona alta defensa y resistencia al fuego",
   *   "status": true,
   *   "stock": 5,
   *   "effects": [
   *     { "effectType": "defensa", "value": 20, "durationTurns": 0 }
   *   ],
   *   "dropRate": 0.15
   * }
   */
  readonly createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const hero: ItemInterface = req.body;

      if (!hero || !hero.name) {
        res.status(400).json({ message: "Faltan datos del héroe" });
        return;
      }

      await this.itemModel.createItem(hero);
      res.status(201).json({ message: "Héroe creado con éxito", hero });
    } catch (error) {
      console.error("Error en createHero:", error);
      res.status(500).json({ message: "Error al crear héroe" });
    }
  };

  /**
   * @async
   * @function deleteItem
   * @description Elimina (o desactiva) un item por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito o error si el item no existe.
   */
  readonly deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const itemId = parseInt(id, 10);

      if (isNaN(itemId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await this.itemModel.toggleItemStatusById(itemId);

      if (!deleted) {
        res
          .status(404)
          .json({ message: `No se encontró item con id ${itemId}` });
        return;
      }

      res
        .status(200)
        .json({ message: `item con id ${itemId} eliminado con éxito` });
    } catch (error) {
      console.error("Error en deleteItem:", error);
      res.status(500).json({ message: "Error al eliminar item", error });
    }
  };

  /**
   * @async
   * @function updateItem
   * @description Actualiza los datos de un item por su ID con los campos proporcionados en el cuerpo.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id` y los campos a actualizar.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el item actualizado o un error si no existe.
   * @example
   * // Body de ejemplo para actualización
   * {
   *   "name": "Armadura del Dragón",
   *   "heroType": "medico",
   *   "description": "Proporciona alta defensa y resistencia al fuego",
   *   "status": true,
   *   "stock": 5,
   *   "effects": [
   *     { "effectType": "defensa", "value": 20, "durationTurns": 0 }
   *   ],
   *   "dropRate": 0.15
   * }
   */
  readonly updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const itemId = parseInt(id, 10);
      const updatedFields: Partial<ItemInterface> = req.body;

      if (isNaN(itemId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        res
          .status(400)
          .json({ message: "No se enviaron campos para actualizar" });
        return;
      }

      const updatedItem = await this.itemModel.updateItemById(
        itemId,
        updatedFields
      );

      if (!updatedItem) {
        res
          .status(404)
          .json({ message: `No se encontró item con id ${itemId}` });
        return;
      }

      res
        .status(200)
        .json({
          message: `Item con id ${itemId} actualizado con éxito`,
          updatedItem,
        });
    } catch (error) {
      console.error("Error en updateItem:", error);
      res.status(500).json({ message: "Error al actualizar item", error });
    }
  };

  /**
   * @async
   * @function updateItemStatus
   * @description Actualiza el estado (activo/inactivo) de un ítem por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id` y el body con el nuevo estado.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el ítem actualizado o un error si no existe.
   */
readonly updateItemStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const { status } = req.body as { status: boolean };

    if (typeof status !== "boolean") {
      res.status(400).json({ message: "El campo 'status' debe ser boolean" });
      return;
    }


    const currentStatus = await this.itemModel.getItemStatusById(itemId);

    if (currentStatus === null) {
      res.status(404).json({ message: `No se encontró ítem con id ${itemId}` });
      return;
    }

    if (currentStatus === false && status === false) {
      res.status(400).json({
        message: `El ítem con id ${itemId} ya está desactivado y no puede volver a subastarse`
      });
      return;
    }

    const updatedItem = await this.itemModel.updateItemById(itemId, { status });

    if (!updatedItem) {
      res.status(404).json({ message: `No se encontró ítem con id ${itemId}` });
      return;
    }

    res.status(200).json({
      message: `Ítem con id ${itemId} actualizado con éxito`,
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error en updateItemStatus:", error);
    res.status(500).json({ message: "Error al actualizar status del ítem", error });
  }
};

}
