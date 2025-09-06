import { Request, Response } from "express";
import WeaponModel from "../model/WeaponModel";
import { WeaponInterface } from "../types/WeaponInterface";

/**
 * Controlador para gestionar las operaciones CRUD sobre Armas.
 */
export default class WeaponController {
  constructor(private readonly weaponModel: WeaponModel) {}

  /**
   * Obtiene todas las armas.
   *
   * @param {Request} _req - Objeto de la solicitud (no usado en este caso).
   * @param {Response} res - Objeto de la respuesta para enviar las armas.
   * @returns {Promise<void>} - Promesa que resuelve sin valor.
   */
  readonly getWeapons = async (_req: Request, res: Response): Promise<void> => {
    try {
      const weapons = await this.weaponModel.getAllWeapons();
      res.status(200).json(weapons);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener armas", error });
    }
  };

  /**
   * Obtiene un arma por su ID.
   *
   * @param {Request} req - Objeto de la solicitud, que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta para enviar el arma encontrada.
   * @returns {Promise<void>} - Promesa que resuelve sin valor.
   */
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

  /**
   * Crea una nueva arma.
   *
   * @param {Request} req - Objeto de la solicitud, que contiene los datos del arma en el cuerpo.
   * @param {Response} res - Objeto de la respuesta para confirmar la creación.
   * @returns {Promise<void>} - Promesa que resuelve sin valor.
   */
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

  /**
   * Cambia el estado de un arma por su ID.
   *
   * @param {Request} req - Objeto de la solicitud, que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta para confirmar la eliminación.
   * @returns {Promise<void>} - Promesa que resuelve sin valor.
   */
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

  /**
   * Actualiza un arma por su ID con los campos proporcionados.
   *
   * @param {Request} req - Objeto de la solicitud, que contiene el parámetro `id` y los datos en el cuerpo.
   * @param {Response} res - Objeto de la respuesta para confirmar la actualización.
   * @returns {Promise<void>} - Promesa que resuelve sin valor.
   */
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
