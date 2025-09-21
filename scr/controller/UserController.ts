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
  constructor(private readonly usuarioModel: UsuarioModel) { }

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

  /** Actualizar créditos de un usuario */
readonly incrementarCreditos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nombreUsuario } = req.params as { nombreUsuario: string };
    const { creditos } = req.body as { creditos: number };

    if (typeof creditos !== 'number') {
      res.status(400).json({ message: 'El campo "creditos" debe ser un número válido' });
      return;
    }

    const nuevosCreditos = await this.usuarioModel.incrementarCreditos(nombreUsuario, creditos);

    if (nuevosCreditos === null) {
      res.status(404).json({ message: `Usuario ${nombreUsuario} no encontrado` });
      return;
    }

    res.status(200).json({
      message: `Créditos actualizados con éxito para el usuario ${nombreUsuario}`,
      creditos: nuevosCreditos,
    });
  } catch (error) {
    console.error('Error en incrementarCreditos:', error);
    res.status(500).json({ message: 'Error al actualizar créditos', error });
  }
};


readonly applyRewards = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recompensa = req.body as {
      Rewards: {
        playerRewarded: string;
        credits: number;  // ahora puede ser negativo
        exp: number;      // ahora puede ser negativo
      };
      WonItem: { originPlayer: string; itemName: string }[];
    };

    // Validaciones básicas (solo verificar tipo number, sin importar signo)
    if (
      !recompensa ||
      !recompensa.Rewards ||
      typeof recompensa.Rewards.playerRewarded !== 'string' ||
      typeof recompensa.Rewards.credits !== 'number' ||   // permite negativos
      typeof recompensa.Rewards.exp !== 'number' ||       // permite negativos
      !Array.isArray(recompensa.WonItem)
    ) {
      res.status(400).json({ message: 'Datos de recompensa inválidos' });
      return;
    }

    // Opcional: log para debug valores negativos
    if (recompensa.Rewards.credits < 0 || recompensa.Rewards.exp < 0) {
      console.log('Recompensa con valores negativos:', recompensa);
    }

    const success = await this.usuarioModel.aplicarRecompensas(recompensa);

    if (!success) {
      res.status(400).json({ message: 'No se pudo aplicar la recompensa' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Recompensa aplicada correctamente', recompensa });
  } catch (error) {
    console.error('Error en applyRewards:', error);
    res.status(500).json({ message: 'Error al aplicar recompensas', error });
  }
};

  /**
 * @async
 * @function transferItem
 * @description Transfiere un ítem del inventario de un usuario a otro.
 * @param {Request} req Objeto de la solicitud HTTP que contiene `originUser`, `targetUser` y `itemName` en el body.
 * @param {Response} res Objeto de la respuesta HTTP.
 * @returns {Promise<void>} Devuelve un mensaje de éxito o error según el resultado.
 * @example
 * // PATCH /users/transfer-item
 * {
 *   "originUser": "Player1",
 *   "targetUser": "Player2",
 *   "itemName": "Espada Legendaria"
 * }
 */
readonly transferItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { originUser, targetUser, itemName } = req.body;

    if (!originUser || !targetUser || !itemName) {
      res.status(400).json({ message: "Faltan datos: originUser, targetUser o itemName" });
      return;
    }

    const success = await this.usuarioModel.transferItem(originUser, targetUser, itemName);

    if (!success) {
      res.status(404).json({
        message: `No se pudo transferir el ítem "${itemName}" de ${originUser} a ${targetUser}`,
      });
      return;
    }

    res.status(200).json({
      message: `Ítem "${itemName}" transferido de ${originUser} a ${targetUser} con éxito`,
    });
  } catch (error) {
    console.error("Error en transferItem:", error);
    res.status(500).json({ message: "Error al transferir ítem", error });
  }
};



}
