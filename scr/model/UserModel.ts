// src/model/UsuarioModel.ts
import { MongoClient } from 'mongodb';
import { UserInterface } from '../types/UserInterface';
import InventarioInterface from '../types/InventarioInterface';
import HeroInterface from '../types/HeroInterface';
import EquipmentInterface from '../types/EquipementInterface';

/**
 * @class UsuarioModel
 * @classdesc Modelo para gestionar operaciones CRUD de usuarios en MongoDB.
 * Ahora soporta creación y lectura de múltiples usuarios.
 */
export default class UsuarioModel {
  private uri = process.env.MONGO_URI!;
  private dbName = process.env.MONGO_DB!;
  private collectionName = process.env.MONGO_COLLECTION_USERS!;
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  /** Crear uno o varios usuarios */
  readonly createUsuarios = async (
    usuarios: UserInterface | UserInterface[],
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      if (Array.isArray(usuarios)) {
        // Filtramos los usuarios que ya existen
        const existingUsers = await collection
          .find({ id: { $in: usuarios.map((u) => u.nombreUsuario) } })
          .project<{ id: string }>({ id: 1 })
          .toArray();

        const existingIdsSet = new Set(existingUsers.map((u) => u['id']));

        const newUsers = usuarios.filter((u) => !existingIdsSet.has(u.nombreUsuario));
        if (newUsers.length === 0) return false;

        await collection.insertMany(newUsers);
        console.log(
          `Usuarios creados: ${newUsers.map((u) => u.nombreUsuario).join(', ')}`,
        );
      } else {
        const existingUser = await collection.findOne({ id: usuarios.nombreUsuario });
        if (existingUser) return false;
        await collection.insertOne(usuarios);
        console.log(`Usuario creado: ${usuarios.nombreUsuario}`);
      }

      return true;
    } catch (error) {
      console.error('Error al crear usuarios:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Obtener usuario por ID */
  readonly getUsuarioById = async (
    nombreUsuario: string,
  ): Promise<UserInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      return await collection.findOne({ nombreUsuario });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  readonly getUsuarioHeroById = async (
    id: string,
  ): Promise<HeroInterface | undefined> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Busca el usuario por su campo id (en tu caso es un string tipo "u005")
      const user = await collection.findOne({ id });

      if (!user || !user.equipados || !Array.isArray(user.equipados.hero)) {
        return undefined;
      }

      // Retorna solo el primer héroe equipado si existe
      return user.equipados.hero.length > 0 ? user.equipados.hero[0] : undefined;
    } catch (error) {
      console.error('Error al obtener héroe por ID de usuario:', error);
      return undefined;
    } finally {
      await this.client.close();
    }
  };

  /** Obtener todos los usuarios */
  readonly getAllUsuarios = async (): Promise<UserInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      return await collection.find({}).toArray();
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /** Agregar producto al inventario */
  readonly addProductoToInventario = async (
    userId: string,
    categoria: keyof InventarioInterface,
    producto: any,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const update =
        categoria === 'epicAbility'
          ? { $set: { 'inventario.epicAbility': producto } }
          : { $push: { [`inventario.${categoria}`]: producto } };

      const result = await collection.updateOne({ id: userId }, update);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al agregar producto al inventario:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  readonly equipArmor = async (
    nombreUsuario: string,
    armorName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      const armor = usuario.inventario.armors.find(
        (a) => a.name.toLowerCase() === armorName.toLowerCase(),
      );
      if (!armor) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'inventario.armors': { id: armor.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'equipados.armors': armor } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al equipar armadura:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Equipar un item */
  readonly equipItem = async (
    nombreUsuario: string,
    itemName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      // Buscar item en el inventario por nombre
      const item = usuario.inventario.items.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase(),
      );
      if (!item) return false;

      // Operaciones: sacar del inventario y agregar a equipados
      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'inventario.items': { id: item.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'equipados.items': item } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al equipar item:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };


  /** Equipar un arma */
  readonly equipWeapon = async (
    nombreUsuario: string,
    weaponName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      // Buscar arma en el inventario por nombre
      const weapon = usuario.inventario.weapons.find(
        (w) => w.name.toLowerCase() === weaponName.toLowerCase(),
      );
      if (!weapon) return false;

      // Operaciones: sacar del inventario y agregar a equipados
      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'inventario.weapons': { id: weapon.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'equipados.weapons': weapon } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al equipar arma:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Equipar una habilidad épica */
  readonly equipEpicAbility = async (
    nombreUsuario: string,
    epicName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      // Buscar la habilidad épica por nombre
      const epic = usuario.inventario.epicAbility.find(
        (e) => e.name.toLowerCase() === epicName.toLowerCase(),
      );
      if (!epic) return false;

      // Operaciones: sacar del inventario y agregar a equipados
      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'inventario.epicAbility': { id: epic.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'equipados.epicAbility': epic } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al equipar habilidad épica:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  readonly equipHero = async (
    nombreUsuario: string,
    heroName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      const hero = usuario.inventario.hero.find(
        (e) => e.name.toLowerCase() === heroName.toLowerCase(),
      );
      if (!hero) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'inventario.hero': { id: hero.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'equipados.hero': hero } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al equipar heroe:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Desequipar un arma */
  readonly unequipWeapon = async (
    nombreUsuario: string,
    weaponName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      // Buscar arma en los equipados
      const weapon = usuario.equipados.weapons.find(
        (w) => w.name.toLowerCase() === weaponName.toLowerCase(),
      );
      if (!weapon) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'equipados.weapons': { id: weapon.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'inventario.weapons': weapon } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desequipar arma:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Desequipar armadura */
  readonly unequipArmor = async (
    nombreUsuario: string,
    armorName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      const armor = usuario.equipados.armors.find(
        (a) => a.name.toLowerCase() === armorName.toLowerCase(),
      );
      if (!armor) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'equipados.armors': { id: armor.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'inventario.armors': armor } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desequipar armadura:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Desequipar item */
  readonly unequipItem = async (
    nombreUsuario: string,
    itemName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      const item = usuario.equipados.items.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase(),
      );
      if (!item) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'equipados.items': { id: item.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'inventario.items': item } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desequipar item:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Desequipar habilidad épica */
  readonly unequipEpicAbility = async (
    nombreUsuario: string,
    epicName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      const epic = usuario.equipados.epicAbility.find(
        (e) => e.name.toLowerCase() === epicName.toLowerCase(),
      );
      if (!epic) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'equipados.epicAbility': { id: epic.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'inventario.epicAbility': epic } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desequipar habilidad épica:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

  /** Desequipar un arma */
  readonly unequipHero = async (
    nombreUsuario: string,
    heroName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ nombreUsuario: nombreUsuario });
      if (!usuario) return false;

      // Buscar arma en los equipados
      const hero = usuario.equipados.hero.find(
        (w) => w.name.toLowerCase() === heroName.toLowerCase(),
      );
      if (!hero) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $pull: { 'equipados.hero': { id: hero.id } } },
          },
        },
        {
          updateOne: {
            filter: { nombreUsuario: nombreUsuario },
            update: { $push: { 'inventario.hero': hero } },
          },
        },
      ];

      const result = await collection.bulkWrite(ops);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desequipar heroe:', error);
      return false;
    } finally {
      await this.client.close();
    }
  };

readonly incrementarCreditos = async (
  nombreUsuario: string,
  creditosExtra: number,
): Promise<number | null> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    // Incrementar créditos
    const result = await collection.updateOne(
      { nombreUsuario },
      { $inc: { creditos: creditosExtra } }
    );

    if (result.modifiedCount === 0) {
      return null; // no se encontró o no se modificó nada
    }

    // Obtener el valor actualizado
    const user = await collection.findOne({ nombreUsuario });
    return user ? user.creditos : null;
  } catch (error) {
    console.error('Error al incrementar créditos:', error);
    return null;
  } finally {
    await this.client.close();
  }
};



readonly aplicarRecompensas = async (
  recompensa: {
    Rewards: { playerRewarded: string; credits: number; exp: number };
    WonItem: { originPlayer: string; itemName: string }[];
  },
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const { playerRewarded, credits, exp } = recompensa.Rewards;

    const jugadorDestino = await collection.findOne({ nombreUsuario: playerRewarded });
    if (!jugadorDestino) {
      console.error('Jugador recompensado no encontrado');
      return false;
    }

    const bulkOps: any[] = [];

    // Sumar créditos y experiencia
    bulkOps.push({
      updateOne: {
        filter: { nombreUsuario: playerRewarded },
        update: { $inc: { creditos: credits, exp: exp } },
      },
    });

    // Validar que WonItem sea un array
    const wonItems = Array.isArray(recompensa.WonItem) ? recompensa.WonItem : [];

    // Procesar cada item ganado
    for (const item of wonItems) {
      const { originPlayer, itemName } = item;

      const jugadorOrigen = await collection.findOne({ nombreUsuario: originPlayer });
      if (!jugadorOrigen) continue;

      // Buscar el item en EQUIPMENT del jugador origen (no inventario)
      let itemEncontrado = null;
      let categoria: keyof EquipmentInterface | null = null;

      const categorias: (keyof EquipmentInterface)[] = [
        'weapons',
        'armors',
        'items',
        'epicAbility',
        'hero',
      ];

      for (const cat of categorias) {
        const found = jugadorOrigen.equipados[cat].find(
          (i: any) => i.name.toLowerCase() === itemName.toLowerCase(),
        );
        if (found) {
          itemEncontrado = found;
          categoria = cat;
          break;
        }
      }

      if (!itemEncontrado || !categoria) continue;

      // Remover del origen
      bulkOps.push({
        updateOne: {
          filter: { nombreUsuario: originPlayer },
          update: { $pull: { [`equipados.${categoria}`]: { id: itemEncontrado.id } } },
        },
      });

      // Agregar al destino
      bulkOps.push({
        updateOne: {
          filter: { nombreUsuario: playerRewarded },
          update: { $push: { [`inventario.${categoria}`]: itemEncontrado } },
        },
      });
    }

    if (bulkOps.length > 0) {
      const result = await collection.bulkWrite(bulkOps);
      console.log('Recompensas aplicadas:', result.modifiedCount);
      return result.modifiedCount > 0;
    }

    return false;
  } catch (error) {
    console.error('Error al aplicar recompensas:', error);
    return false;
  } finally {
    await this.client.close();
  }
};

/**
 * @async
 * @function transferItem
 * @description Transfiere un ítem del inventario de un usuario a otro.
 * @param {string} originUser - Nombre del usuario que entrega el ítem.
 * @param {string} targetUser - Nombre del usuario que recibe el ítem.
 * @param {string} itemName - Nombre del ítem a transferir.
 * @returns {Promise<boolean>} True si la transferencia fue exitosa, False si no se encontró o falló.
 */
readonly transferItem = async (
  originUser: string,
  targetUser: string,
  itemName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    // Validar que ambos usuarios existan
    const [usuarioOrigen, usuarioDestino] = await Promise.all([
      collection.findOne({ nombreUsuario: originUser }),
      collection.findOne({ nombreUsuario: targetUser }),
    ]);

    if (!usuarioOrigen || !usuarioDestino) {
      console.error("Usuario origen o destino no encontrado");
      return false;
    }

    // Categorías posibles donde buscar
    const categorias: (keyof EquipmentInterface)[] = [
      "weapons",
      "armors",
      "items",
      "epicAbility",
      "hero",
    ];

    let itemEncontrado: any = null;
    let categoria: keyof EquipmentInterface | null = null;
    let origen: "inventario" | "equipados" | null = null;

    // 1. Buscar en inventario
    for (const cat of categorias) {
      const found = usuarioOrigen.inventario[cat].find(
        (i: any) => i.name.toLowerCase() === itemName.toLowerCase(),
      );
      if (found) {
        itemEncontrado = found;
        categoria = cat;
        origen = "inventario";
        break;
      }
    }

    // 2. Si no está en inventario, buscar en equipados
    if (!itemEncontrado) {
      for (const cat of categorias) {
        const found = usuarioOrigen.equipados[cat].find(
          (i: any) => i.name.toLowerCase() === itemName.toLowerCase(),
        );
        if (found) {
          itemEncontrado = found;
          categoria = cat;
          origen = "equipados";
          break;
        }
      }
    }

    if (!itemEncontrado || !categoria || !origen) {
      console.error(`Ítem ${itemName} no encontrado en ${originUser}`);
      return false;
    }

    // Bulk operations: quitar del origen y agregar al destino
    const bulkOps: any[] = [
      {
        updateOne: {
          filter: { nombreUsuario: originUser },
          update: { $pull: { [`${origen}.${categoria}`]: { id: itemEncontrado.id } } },
        },
      },
      {
        updateOne: {
          filter: { nombreUsuario: targetUser },
          update: { $push: { [`inventario.${categoria}`]: itemEncontrado } },
        },
      },
    ];

    const result = await collection.bulkWrite(bulkOps);

    if (result.modifiedCount > 0) {
      console.log(
        `Ítem "${itemName}" transferido de ${originUser} (${origen}) a ${targetUser}`,
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al transferir ítem:", error);
    return false;
  } finally {
    await this.client.close();
  }
};



}
