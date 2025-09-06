import { Request, Response } from 'express';
import HeroModel from '../model/HeroModel';
import HeroInterface from '../types/HeroInterface';

/**
 * @class HeroController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con los héroes.
 * Contiene métodos para obtener, crear, actualizar y eliminar héroes.
 */
export default class HeroController {
  /**
   * @constructor
   * @param {HeroModel} heroModel - Instancia del modelo HeroModel para interactuar con la base de datos.
   */
  constructor(private readonly heroModel: HeroModel) {}

  /**
   * @description Obtiene todos los héroes disponibles en la base de datos.
   * @param {Request} _req - Objeto de la petición HTTP (no se utiliza en este método).
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un JSON con todos los héroes.
   */
  readonly getHeroes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const heroes = await this.heroModel.getAllHeroes();
      res.status(200).json(heroes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener héroes', error });
    }
  };

  /**
   * @description Obtiene un héroe específico por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el héroe encontrado o un error 404 si no existe.
   */
  readonly getHeroById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      const hero = await this.heroModel.getHeroById(heroId);

      if (!hero) {
        res.status(404).json({ message: 'Héroe no encontrado' });
        return;
      }

      res.status(200).json(hero);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener héroe por ID', error });
    }
  };

  /**
   * @description Crea un nuevo héroe en la base de datos.
   * @param {Request} req - Objeto de la petición HTTP que contiene los datos del héroe en el body.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito y el héroe creado.
   */
  readonly createHero = async (req: Request, res: Response): Promise<void> => {
    try {
      const hero: HeroInterface = req.body;

      if (!hero || !hero.name) {
        res.status(400).json({ message: 'Faltan datos del héroe' });
        return;
      }

      await this.heroModel.createHero(hero);
      res.status(201).json({ message: 'Héroe creado con éxito', hero });
    } catch (error) {
      console.error('Error en createHero:', error);
      res.status(500).json({ message: 'Error al crear héroe' });
    }
  };

  /**
   * @description Elimina (o desactiva) un héroe por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id`.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve un mensaje de éxito o error si el héroe no existe.
   */
  readonly deleteHero = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      if (isNaN(heroId)) {
        res.status(400).json({ message: 'ID inválido' });
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
      console.error('Error en deleteHero:', error);
      res.status(500).json({ message: 'Error al eliminar héroe', error });
    }
  };

  /**
   * @description Actualiza los datos de un héroe por su ID.
   * @param {Request} req - Objeto de la petición HTTP que contiene el parámetro `id` y los campos a actualizar en el body.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>} Devuelve el héroe actualizado o un error si no existe.
   */
  readonly updateHero = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const heroId = parseInt(id, 10);

      if (isNaN(heroId)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }

      const { ...updatedFields } = req.body;

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        res
          .status(400)
          .json({ message: 'No se enviaron campos para actualizar' });
        return;
      }

      const updatedHero = await this.heroModel.updateHeroById(
        heroId,
        updatedFields,
      );

      if (!updatedHero) {
        res
          .status(404)
          .json({ message: `No se encontró item con id ${heroId}` });
        return;
      }

      res.status(200).json({
        message: `Item con id ${heroId} actualizado con éxito`,
        updatedHero,
      });
    } catch (error) {
      console.error('Error en updateItem:', error);
      res.status(500).json({ message: 'Error al actualizar item', error });
    }
  };
}
