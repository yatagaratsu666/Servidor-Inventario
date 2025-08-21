import { Request, Response } from "express";
import ArmorModel from "../model/ArmorModel";
import { ArmorInterface } from "../types/ArmorInterface";

export default class ArmorController {
  constructor(private readonly armorModel: ArmorModel) {}

  readonly getArmor = async (_req: Request, res: Response): Promise<void> => {
    try {
      const armors= await this.armorModel.getAllArmors();
      res.status(200).json(armors);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener armaduras", error });
    }
  };

  readonly getArmorById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const armorId = parseInt(id, 10);

      const armor = await this.armorModel.getArmorById(armorId);

      if (!armor) {
        res.status(404).json({ message: "armadura no encontrada" });
        return;
      }

      res.status(200).json(armor);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener armadura por ID", error });
    }
  };

  readonly createArmor = async (req: Request, res: Response): Promise<void> => {
    try {
      const armor: ArmorInterface = req.body;

      if (!armor || !armor.name) {
        res.status(400).json({ message: "Faltan datos de la armadura" });
        return;
      }

      await this.armorModel.createArmor(armor);
      res.status(201).json({ message: "Armadura creada con éxito", armor });
    } catch (error) {
      console.error("Error al crear armadura:", error);
      res.status(500).json({ message: "Error al crear armadura" });
    }
  };

  readonly deleteArmor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const armorId = parseInt(id, 10);

      if (isNaN(armorId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await this.armorModel.toggleArmorStatusById(armorId);

      if (!deleted) {
        res
          .status(404)
          .json({ message: `No se encontró armadura con id ${armorId}` });
        return;
      }

      res
        .status(200)
        .json({ message: `Armadura con id ${armorId} eliminado con éxito` });
    } catch (error) {
      console.error("Error en deleteArmor:", error);
      res.status(500).json({ message: "Error al eliminar armadura", error });
    }
  };

  readonly updateArmor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const armorId = parseInt(id, 10);
      const updatedFields: Partial<ArmorInterface> = req.body;

      if (isNaN(armorId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        res
          .status(400)
          .json({ message: "No se enviaron campos para actualizar" });
        return;
      }

      const updatedArmor = await this.armorModel.updateArmorById(
        armorId,
        updatedFields
      );

      if (!updatedArmor) {
        res
          .status(404)
          .json({ message: `No se encontró armadura con id ${armorId}` });
        return;
      }

      res
        .status(200)
        .json({
          message: `armadura con id ${armorId} actualizado con éxito`,
          updatedArmor,
        });
    } catch (error) {
      console.error("Error en updateArmor:", error);
      res.status(500).json({ message: "Error al actualizar armadura", error });
    }
  };
}
