import { Request, Response } from "express";
import ArmorModel from "../model/ArmorModel";
import { ArmorInterface } from "../types/ArmorInterface";

/**
 * @class ArmorController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con las armaduras.
 * Contiene métodos para obtener, crear, actualizar y eliminar armaduras.
 */
export default class ArmorController {
  /**
   * @constructor
   * @param {ArmorModel} armorModel - Instancia del modelo ArmorModel para interactuar con la base de datos.
   */
  constructor(private readonly armorModel: ArmorModel) {}

  /**
   * @description Obtiene todas las armaduras disponibles en la base de datos.
   * @param {Request} _req - Objeto de la petición HTTP (no se utiliza en este caso).
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un JSON con todas las armaduras.
   */
  readonly getArmor = async (_req: Request, res: Response): Promise<void> => {
    try {
      const armors= await this.armorModel.getAllArmors();
      res.status(200).json(armors);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener armaduras", error });
    }
  };

  /**
   * @description Obtiene una armadura específica por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve la armadura encontrada o un error 404 si no existe.
   */
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

  /**
   * @description Crea una nueva armadura en la base de datos.
   * @param {Request} req - Objeto de la petición HTTP que contiene los datos de la armadura en el body.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito y la armadura creada.
   */
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

  /**
   * @description Elimina (o desactiva) una armadura por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito o error si la armadura no existe.
   */
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

  /**
   * @description Actualiza los datos de una armadura por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id` y los campos a actualizar en el body.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve la armadura actualizada o un error si no existe.
   */
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
