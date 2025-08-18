import { Request, Response } from "express";
import ItemModel from "../model/ItemModel";
import ItemInterface from "../types/ItemInterface";

export default class ItemController {
  constructor(private readonly itemModel: ItemModel) {}

  readonly getItems = async (_req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemModel.getAllItems();
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener items", error });
    }
  };

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
}
