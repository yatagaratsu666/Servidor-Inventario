import { Request, Response } from "express";
import WeaponModel from "../model/WeaponModel";
import { WeaponInterface } from "../types/WeaponInterface";

/**
 * @class WeaponController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con las armas.
 * Contiene métodos para obtener, crear, actualizar y eliminar armas.
 */
export default class WeaponController {
  /**
   * @param {WeaponModel} weaponModel Instancia del modelo `WeaponModel` para interactuar con la base de datos.
   */
  constructor(private readonly weaponModel: WeaponModel) {}

  /**
   * @async
   * @function getWeapons
   * @description Obtiene todas las armas disponibles en la base de datos.
   * @param {_req} _req Objeto de la solicitud HTTP (no se utiliza en este método).
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un JSON con todas las armas registradas.
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
   * @async
   * @function getWeaponById
   * @description Obtiene un arma específica por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el arma encontrada o un error 404 si no existe.
   */
  readonly getWeaponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const weaponId = parseInt(id, 10);

      const weapon = await this.weaponModel.getWeaponById(weaponId);

      if (!weapon) {
        res.status(404).json({ message: "Arma no encontrada" });
        return;
      }

      res.status(200).json(weapon);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener arma por ID", error });
    }
  };

  /**
   * @async
   * @function createWeapon
   * @description Crea una nueva arma en la base de datos.
   * @param {Request} req Objeto de la solicitud HTTP que contiene los datos del arma en el cuerpo.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito y el arma creada.
   */
  readonly createWeapon = async (req: Request, res: Response): Promise<void> => {
    try {
      const weapon: WeaponInterface = req.body;

      if (!weapon || !weapon.name) {
        res.status(400).json({ message: "Faltan datos del arma" });
        return;
      }

      await this.weaponModel.createWeapon(weapon);
      res.status(201).json({ message: "Arma creada con éxito", weapon });
    } catch (error) {
      console.error("Error al crear arma:", error);
      res.status(500).json({ message: "Error al crear arma" });
    }
  };

  /**
   * @async
   * @function deleteWeapon
   * @description Elimina (o desactiva) un arma por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito o error si el arma no existe.
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
        res.status(404).json({ message: `No se encontró arma con id ${weaponId}` });
        return;
      }

      res.status(200).json({ message: `Arma con id ${weaponId} eliminada con éxito` });
    } catch (error) {
      console.error("Error en deleteWeapon:", error);
      res.status(500).json({ message: "Error al eliminar arma", error });
    }
  };

  /**
   * @async
   * @function updateWeapon
   * @description Actualiza los datos de un arma por su ID.
   * @param {Request} req Objeto de la solicitud HTTP que contiene el parámetro `id` y los campos a actualizar en `body`.
   * @param {Response} res Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el arma actualizada o un error si no existe.
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
        res.status(400).json({ message: "No se enviaron campos para actualizar" });
        return;
      }

      const updatedWeapon = await this.weaponModel.updateWeaponById(
        weaponId,
        updatedFields
      );

      if (!updatedWeapon) {
        res.status(404).json({ message: `No se encontró arma con id ${weaponId}` });
        return;
      }

      res.status(200).json({ message: `Arma con id ${weaponId} actualizada con éxito`, updatedWeapon });
    } catch (error) {
      console.error("Error en updateWeapon:", error);
      res.status(500).json({ message: "Error al actualizar arma", error });
    }
  };

    readonly updateWeaponStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const weaponId = parseInt(id, 10);

      if (isNaN(weaponId)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const { status } = req.body as { status: boolean };

      if (typeof status !== "boolean") {
        res.status(400).json({ message: "El campo 'status' debe ser boolean" });
        return;
      }

      const updatedWeapon = await this.weaponModel.updateWeaponStatus(weaponId, { status });

      if (!updatedWeapon) {
        res.status(404).json({ message: `No se encontró arma con id ${weaponId}` });
        return;
      }

      res.status(200).json({
        message: `Arma con id ${weaponId} actualizada con éxito`,
        weapon: updatedWeapon,
      });
    } catch (error) {
      console.error("Error en updateWeaponStatus:", error);
      res.status(500).json({ message: "Error al actualizar status del arma", error });
    }
  };

}
