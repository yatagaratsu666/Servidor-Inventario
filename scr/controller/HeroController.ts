import { Request, Response } from "express";
import HeroModel from "../model/HeroModel";
import HeroInterface from "../types/HeroInterface";

export default class HeroController {
  constructor(private readonly heroModel: HeroModel) {}

  readonly getHeroes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const heroes = await this.heroModel.getAllHeroes();
      res.status(200).json(heroes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener héroes", error });
    }
  };

  readonly getHeroById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      const hero = await this.heroModel.getHeroById(heroId);

      if (!hero) {
        res.status(404).json({ message: "Héroe no encontrado" });
        return;
      }

      res.status(200).json(hero);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener héroe por ID", error });
    }
  };

  readonly createHero = async (req: Request, res: Response): Promise<void> => {
    try {
      const hero: HeroInterface = req.body;

      if (!hero || !hero.name) {
        res.status(400).json({ message: "Faltan datos del héroe" });
        return;
      }

      await this.heroModel.createHero(hero);
      res.status(201).json({ message: "Héroe creado con éxito", hero });
    } catch (error) {
      console.error("Error en createHero:", error);
      res.status(500).json({ message: "Error al crear héroe" });
    }
  };

  readonly deleteHero = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      if (isNaN(heroId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await this.heroModel.toggleItemStatusById(heroId);

      if (!deleted) {
        res
          .status(404)
          .json({ message: `No se encontró héroe con id ${heroId}` });
        return;
      }

      res
        .status(200)
        .json({ message: `Héroe con id ${heroId} eliminado con éxito` });
    } catch (error) {
      console.error("Error en deleteHero:", error);
      res.status(500).json({ message: "Error al eliminar héroe", error });
    }
  };

    readonly updateHero = async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params as { id: string };
        const heroId = parseInt(id, 10);
        const updatedFields: Partial<HeroInterface> = req.body;
  
        if (isNaN(heroId)) {
          res.status(400).json({ message: "ID inválido" });
          return;
        }
  
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
          res
            .status(400)
            .json({ message: "No se enviaron campos para actualizar" });
          return;
        }
  
        const updatedItem = await this.heroModel.updateHeroById(
          heroId,
          updatedFields
        );
  
        if (!updatedItem) {
          res
            .status(404)
            .json({ message: `No se encontró heroe con id ${heroId}` });
          return;
        }
  
        res
          .status(200)
          .json({
            message: `heroe con id ${heroId} actualizado con éxito`,
            updatedItem,
          });
      } catch (error) {
        console.error("Error en updateItem:", error);
        res.status(500).json({ message: "Error al actualizar item", error });
      }
    };
}
