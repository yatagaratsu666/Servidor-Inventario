// src/model/UsuarioModel.ts
import { MongoClient } from 'mongodb';
import { UserInterface } from '../types/UserInterface';
import InventarioInterface from '../types/InventarioInterface';

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
          .find({ id: { $in: usuarios.map((u) => u.id) } })
          .project<{ id: string }>({ id: 1 })
          .toArray();

        const existingIdsSet = new Set(existingUsers.map((u) => u['id']));

        const newUsers = usuarios.filter((u) => !existingIdsSet.has(u.id));
        if (newUsers.length === 0) return false;

        await collection.insertMany(newUsers);
        console.log(
          `Usuarios creados: ${newUsers.map((u) => u.id).join(', ')}`,
        );
      } else {
        const existingUser = await collection.findOne({ id: usuarios.id });
        if (existingUser) return false;
        await collection.insertOne(usuarios);
        console.log(`Usuario creado: ${usuarios.id}`);
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
    id: string,
  ): Promise<UserInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      return await collection.findOne({ id });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
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
    userId: string,
    armorName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ id: userId });
      if (!usuario) return false;

      const armor = usuario.inventario.armors.find(
        (a) => a.name.toLowerCase() === armorName.toLowerCase(),
      );
      if (!armor) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { id: userId },
            update: { $pull: { 'inventario.armors': { id: armor.id } } },
          },
        },
        {
          updateOne: {
            filter: { id: userId },
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
    userId: string,
    itemName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ id: userId });
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
            filter: { id: userId },
            update: { $pull: { 'inventario.items': { id: item.id } } },
          },
        },
        {
          updateOne: {
            filter: { id: userId },
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
    userId: string,
    weaponName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ id: userId });
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
            filter: { id: userId },
            update: { $pull: { 'inventario.weapons': { id: weapon.id } } },
          },
        },
        {
          updateOne: {
            filter: { id: userId },
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
    userId: string,
    epicName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      // Buscar usuario
      const usuario = await collection.findOne({ id: userId });
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
            filter: { id: userId },
            update: { $pull: { 'inventario.epicAbility': { id: epic.id } } },
          },
        },
        {
          updateOne: {
            filter: { id: userId },
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
    userId: string,
    heroName: string,
  ): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<UserInterface>(this.collectionName);

      const usuario = await collection.findOne({ id: userId });
      if (!usuario) return false;

      const hero = usuario.inventario.hero.find(
        (e) => e.name.toLowerCase() === heroName.toLowerCase(),
      );
      if (!hero) return false;

      const ops: any[] = [
        {
          updateOne: {
            filter: { id: userId },
            update: { $pull: { 'inventario.hero': { id: hero.id } } },
          },
        },
        {
          updateOne: {
            filter: { id: userId },
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
  userId: string,
  weaponName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const usuario = await collection.findOne({ id: userId });
    if (!usuario) return false;

    // Buscar arma en los equipados
    const weapon = usuario.equipados.weapons.find(
      (w) => w.name.toLowerCase() === weaponName.toLowerCase(),
    );
    if (!weapon) return false;

    const ops: any[] = [
      {
        updateOne: {
          filter: { id: userId },
          update: { $pull: { 'equipados.weapons': { id: weapon.id } } },
        },
      },
      {
        updateOne: {
          filter: { id: userId },
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
  userId: string,
  armorName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const usuario = await collection.findOne({ id: userId });
    if (!usuario) return false;

    const armor = usuario.equipados.armors.find(
      (a) => a.name.toLowerCase() === armorName.toLowerCase(),
    );
    if (!armor) return false;

    const ops: any[] = [
      {
        updateOne: {
          filter: { id: userId },
          update: { $pull: { 'equipados.armors': { id: armor.id } } },
        },
      },
      {
        updateOne: {
          filter: { id: userId },
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
  userId: string,
  itemName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const usuario = await collection.findOne({ id: userId });
    if (!usuario) return false;

    const item = usuario.equipados.items.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase(),
    );
    if (!item) return false;

    const ops: any[] = [
      {
        updateOne: {
          filter: { id: userId },
          update: { $pull: { 'equipados.items': { id: item.id } } },
        },
      },
      {
        updateOne: {
          filter: { id: userId },
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
  userId: string,
  epicName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const usuario = await collection.findOne({ id: userId });
    if (!usuario) return false;

    const epic = usuario.equipados.epicAbility.find(
      (e) => e.name.toLowerCase() === epicName.toLowerCase(),
    );
    if (!epic) return false;

    const ops: any[] = [
      {
        updateOne: {
          filter: { id: userId },
          update: { $pull: { 'equipados.epicAbility': { id: epic.id } } },
        },
      },
      {
        updateOne: {
          filter: { id: userId },
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
  userId: string,
  heroName: string,
): Promise<boolean> => {
  try {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection<UserInterface>(this.collectionName);

    const usuario = await collection.findOne({ id: userId });
    if (!usuario) return false;

    // Buscar arma en los equipados
    const hero = usuario.equipados.hero.find(
      (w) => w.name.toLowerCase() === heroName.toLowerCase(),
    );
    if (!hero) return false;

    const ops: any[] = [
      {
        updateOne: {
          filter: { id: userId },
          update: { $pull: { 'equipados.hero': { id: hero.id } } },
        },
      },
      {
        updateOne: {
          filter: { id: userId },
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
}
