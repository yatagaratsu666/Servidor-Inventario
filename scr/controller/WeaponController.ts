import { Request, Response } from "express";
import WeaponModel from "../model/WeaponModel";
import { WeaponInterface } from "../types/WeaponInterface";

export default class WeaponController {
  constructor(private readonly weaponModel: WeaponModel) {}

  readonly getWeapons = async (_req: Request, res: Response): Promise<void> => {
    try {
      const weapons = await this.weaponModel.getAllWeapons();
      res.status(200).json(weapons);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener armas", error });
    }
  };

  readonly getWeaponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const weaponId = parseInt(id, 10);

      const weapon = await this.weaponModel.getWeaponById(weaponId);

      if (!weapon) {
        res.status(404).json({ message: "arma no encontrada" });
        return;
      }

      res.status(200).json(weapon);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener arma por ID", error });
    }
  };

  readonly createWeapon = async (req: Request, res: Response): Promise<void> => {
    try {
      const weapon: WeaponInterface = req.body;

      if (!weapon || !weapon.name) {
        res.status(400).json({ message: "Faltan datos de el arma" });
        return;
      }

      await this.weaponModel.createWeapon(weapon);
      res.status(201).json({ message: "Arma creada con éxito", epic: weapon });
    } catch (error) {
      console.error("Error al crear arma:", error);
      res.status(500).json({ message: "Error al crear arma" });
    }
  };

  readonly deleteWeapon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const weaponId = parseInt(id, 10);

      if (isNaN(weaponId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await this.weaponModel.toggleWeaponStatusById(weaponId);

      if (!deleted) {
        res
          .status(404)
          .json({ message: `No se encontró arma con id ${weaponId}` });
        return;
      }

      res
        .status(200)
        .json({ message: `Arma con id ${weaponId} eliminado con éxito` });
    } catch (error) {
      console.error("Error en deleteWeapon:", error);
      res.status(500).json({ message: "Error al eliminar arma", error });
    }
  };

  readonly updateWeapon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const weaponId = parseInt(id, 10);
      const updatedFields: Partial<WeaponInterface> = req.body;

      if (isNaN(weaponId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        res
          .status(400)
          .json({ message: "No se enviaron campos para actualizar" });
        return;
      }

      const updatedWeapon = await this.weaponModel.updateWeaponById(
        weaponId,
        updatedFields
      );

      if (!updatedWeapon) {
        res
          .status(404)
          .json({ message: `No se encontró item con id ${weaponId}` });
        return;
      }

      res
        .status(200)
        .json({
          message: `Arma con id ${weaponId} actualizado con éxito`,
          updatedWeapon,
        });
    } catch (error) {
      console.error("Error en updateWeapon:", error);
      res.status(500).json({ message: "Error al actualizar arma", error });
    }
  };
}
