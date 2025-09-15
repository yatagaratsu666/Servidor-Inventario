// src/controller/UsuarioController.ts
import { Request, Response } from 'express';
import UsuarioModel from '../model/UserModel';
import { UserInterface } from '../types/UserInterface';
import InventarioInterface from '../types/InventarioInterface';

/**
 * @class UsuarioController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con los usuarios.
 */
export default class UsuarioController {
  constructor(private readonly usuarioModel: UsuarioModel) {}

  /** Obtener un usuario por ID */
  readonly getUsuarioById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params as { nombreUsuario: string };
      const usuario = await this.usuarioModel.getUsuarioById(nombreUsuario);

      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error en getUsuarioById:', error);
      res.status(500).json({ message: 'Error al obtener usuario', error });
    }
  };

  getHeroByUsuarioId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const hero = await this.usuarioModel.getUsuarioHeroById(id);

      if (!hero) {
        res.status(404).json({
          message: `No se encontró un héroe equipado para el usuario con id: ${id}`,
        });
        return;
      }

      res.status(200).json(hero);
    } catch (error) {
      console.error('Error en getHeroByUsuarioId:', error);
      res.status(500).json({
        message: 'Error interno al obtener el héroe del usuario',
      });
    }
  };

  /** Crear uno o varios usuarios */
  readonly createUsuarios = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const usuarios = req.body as UserInterface | UserInterface[];

      if (!usuarios || (Array.isArray(usuarios) && usuarios.length === 0)) {
        res.status(400).json({ message: 'No se recibieron datos de usuario' });
        return;
      }

      const created = await this.usuarioModel.createUsuarios(usuarios);

      if (!created) {
        res.status(400).json({ message: 'Todos los usuarios ya existen' });
        return;
      }

      res.status(201).json({ message: 'Usuarios creados con éxito', usuarios });
    } catch (error) {
      console.error('Error en createUsuarios:', error);
      res.status(500).json({ message: 'Error al crear usuarios', error });
    }
  };

  readonly addProductoToInventario = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario, categoria } = req.params as {
        nombreUsuario: string;
        categoria: keyof InventarioInterface;
      };
      const producto = req.body;

      const result = await this.usuarioModel.addProductoToInventario(
        nombreUsuario,
        categoria,
        producto,
      );

      if (!result) {
        res.status(400).json({ message: 'No se pudo agregar el producto' });
        return;
      }

      res
        .status(200)
        .json({ message: 'Producto agregado al inventario con éxito' });
    } catch (error) {
      console.error('Error en addProductoToInventario:', error);
      res.status(500).json({ message: 'Error al agregar producto', error });
    }
  };

  readonly equipEpic = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { epicName } = req.body;

      const result = await this.usuarioModel.equipEpicAbility(nombreUsuario, epicName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }


      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipWeapon = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { weaponName } = req.body;

      const result = await this.usuarioModel.equipWeapon(nombreUsuario, weaponName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipItem = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { itemName } = req.body;

      const result = await this.usuarioModel.equipItem(nombreUsuario, itemName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipArmor = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { armorName } = req.body;

      const result = await this.usuarioModel.equipArmor(nombreUsuario, armorName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipHero = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { heroName } = req.body;

      const result = await this.usuarioModel.equipHero(nombreUsuario, heroName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar heroe' });
        return;
      }

      res.status(200).json({ message: 'heroe equipado con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar heroe', error });
    }
  };

  // ---------- UNEQUIP ----------
  readonly unequipArmor = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { armorName } = req.body;

      const result = await this.usuarioModel.unequipArmor(nombreUsuario, armorName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar la armadura' });
        return;
      }

      res.status(200).json({ message: 'Armadura desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipArmor:', error);
      res.status(500).json({ message: 'Error al desequipar armadura', error });
    }
  };

  readonly unequipWeapon = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { weaponName } = req.body;

      const result = await this.usuarioModel.unequipWeapon(nombreUsuario, weaponName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el arma' });
        return;
      }
     
      res.status(200).json({ message: 'Arma desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipWeapon:', error);
      res.status(500).json({ message: 'Error al desequipar arma', error });
    }
  };

  readonly unequipItem = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { itemName } = req.body;

      const result = await this.usuarioModel.unequipItem(nombreUsuario, itemName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el item' });
        return;
      }

      res.status(200).json({ message: 'Item desequipado con éxito' });
    } catch (error) {
      console.error('Error en unequipItem:', error);
      res.status(500).json({ message: 'Error al desequipar item', error });
    }
  };

  readonly unequipEpic = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { epicName } = req.body;

      const result = await this.usuarioModel.unequipEpicAbility(
        nombreUsuario,
        epicName,
      );
      if (!result) {
        res
          .status(400)
          .json({ message: 'No se pudo desequipar la habilidad épica' });
        return;
      }

      res
        .status(200)
        .json({ message: 'Habilidad épica desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipEpic:', error);
      res
        .status(500)
        .json({ message: 'Error al desequipar habilidad épica', error });
    }
  };

  readonly unequipHero = async (
    req: Request<{ nombreUsuario: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { nombreUsuario } = req.params;
      const { heroName } = req.body;

      const result = await this.usuarioModel.unequipHero(nombreUsuario, heroName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el heroe' });
        return;
      }

      res.status(200).json({ message: 'Heroe desequipado con éxito' });
    } catch (error) {
      console.error('Error en unequipEpic:', error);
      res.status(500).json({ message: 'Error al desequipar heroe', error });
    }
  };
}
