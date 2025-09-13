// src/controller/UsuarioController.ts
import { Request, Response } from 'express';
import UsuarioModel from '../model/UserModel';
import { UserInterface } from '../types/UserInterface';
import InventarioInterface from '../types/InventarioInterface';
import { Server as IOServer } from 'socket.io';

/**
 * @class UsuarioController
 * @classdesc Controlador encargado de manejar las operaciones relacionadas con los usuarios.
 */
export default class UsuarioController {
  private io?: IOServer; // Instancia de Socket.IO
  constructor(private readonly usuarioModel: UsuarioModel) {}

  setIO(io: IOServer) {
    this.io = io;
  }

  /** Obtener un usuario por ID */
  readonly getUsuarioById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const usuario = await this.usuarioModel.getUsuarioById(id);

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
        return
      }

      // Emitir evento por Socket.IO
      this.io?.emit('usuariosCreado', usuarios);

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
      const { userId, categoria } = req.params as {
        userId: string;
        categoria: keyof InventarioInterface;
      };
      const producto = req.body;

      const result = await this.usuarioModel.addProductoToInventario(
        userId,
        categoria,
        producto,
      );

      if (!result) {
        res.status(400).json({ message: 'No se pudo agregar el producto' });
        return;
      }

      // Emitir evento por Socket.IO
      this.io?.emit('productoAgregado', { userId, categoria, producto });

      res
        .status(200)
        .json({ message: 'Producto agregado al inventario con éxito' });
    } catch (error) {
      console.error('Error en addProductoToInventario:', error);
      res.status(500).json({ message: 'Error al agregar producto', error });
    }
  };

  readonly equipEpic = async (
    req: Request<{ userId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { epicName } = req.body;

      const result = await this.usuarioModel.equipEpicAbility(userId, epicName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      // Emitir evento por Socket.IO
      this.io?.emit('epicEquipado', { userId, epicName });

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipWeapon = async (
    req: Request<{ userId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { weaponName } = req.body;

      const result = await this.usuarioModel.equipWeapon(userId, weaponName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      // Emitir evento por Socket.IO
      this.io?.emit('weaponEquipado', { userId, weaponName });

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipItem = async (
    req: Request<{ userId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { itemName } = req.body;

      const result = await this.usuarioModel.equipItem(userId, itemName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      // Emitir evento por Socket.IO
      this.io?.emit('itemEquipado', { userId, itemName });

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

  readonly equipArmor = async (
    req: Request<{ userId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { armorName } = req.body;

      const result = await this.usuarioModel.equipArmor(userId, armorName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar la armadura' });
        return;
      }

      this.io?.emit('armorEquipado', { userId, armorName });

      res.status(200).json({ message: 'Armadura equipada con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar armadura', error });
    }
  };

    readonly equipHero = async (
    req: Request<{ userId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { heroName } = req.body;

      const result = await this.usuarioModel.equipHero(userId, heroName);

      if (!result) {
        res.status(400).json({ message: 'No se pudo equipar heroe' });
        return;
      }

      this.io?.emit('heroEquipado', { userId, heroName });

      res.status(200).json({ message: 'heroe equipado con éxito' });
    } catch (error) {
      console.error('Error en equipArmor:', error);
      res.status(500).json({ message: 'Error al equipar heroe', error });
    }
  };

  // ---------- UNEQUIP ----------
  readonly unequipArmor = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { armorName } = req.body;

      const result = await this.usuarioModel.unequipArmor(userId, armorName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar la armadura' });
        return;
      }

      this.io?.emit('armorDesequipado', { userId, armorName });
      res.status(200).json({ message: 'Armadura desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipArmor:', error);
      res.status(500).json({ message: 'Error al desequipar armadura', error });
    }
  };

  readonly unequipWeapon = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { weaponName } = req.body;

      const result = await this.usuarioModel.unequipWeapon(userId, weaponName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el arma' });
        return;
      }

      this.io?.emit('weaponDesequipado', { userId, weaponName });
      res.status(200).json({ message: 'Arma desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipWeapon:', error);
      res.status(500).json({ message: 'Error al desequipar arma', error });
    }
  };

  readonly unequipItem = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { itemName } = req.body;

      const result = await this.usuarioModel.unequipItem(userId, itemName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el item' });
        return;
      }

      this.io?.emit('itemDesequipado', { userId, itemName });
      res.status(200).json({ message: 'Item desequipado con éxito' });
    } catch (error) {
      console.error('Error en unequipItem:', error);
      res.status(500).json({ message: 'Error al desequipar item', error });
    }
  };

  readonly unequipEpic = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { epicName } = req.body;

      const result = await this.usuarioModel.unequipEpicAbility(userId, epicName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar la habilidad épica' });
        return;
      }

      this.io?.emit('epicDesequipado', { userId, epicName });
      res.status(200).json({ message: 'Habilidad épica desequipada con éxito' });
    } catch (error) {
      console.error('Error en unequipEpic:', error);
      res.status(500).json({ message: 'Error al desequipar habilidad épica', error });
    }
  };

    readonly unequipHero = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { heroName } = req.body;

      const result = await this.usuarioModel.unequipHero(userId, heroName);
      if (!result) {
        res.status(400).json({ message: 'No se pudo desequipar el heroe' });
        return;
      }

      this.io?.emit('heroDesequipado', { userId, heroName });
      res.status(200).json({ message: 'Heroe desequipado con éxito' });
    } catch (error) {
      console.error('Error en unequipEpic:', error);
      res.status(500).json({ message: 'Error al desequipar heroe', error });
    }
  };
}
