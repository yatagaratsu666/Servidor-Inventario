import { MongoClient } from "mongodb";
import { WeaponInterface } from "../types/WeaponInterface";

/**
 * @class WeaponModel
 * @classdesc Modelo para gestionar operaciones CRUD de armas en la base de datos MongoDB.
 * Contiene métodos para obtener, crear, actualizar y cambiar el estado de las armas.
 */
export default class WeaponModel {
  /** URI de conexión a MongoDB */
  private uri = process.env.MONGO_URI!;

  /** Nombre de la base de datos en MongoDB */
  private dbName = process.env.MONGO_DB!;

  /** Nombre de la colección de armas en MongoDB */
  private collectionName = process.env.MONGO_COLLECTION_WEAPONS!;

  /** Cliente de conexión a MongoDB */
  private client: MongoClient;

  /**
   * @constructor
   * Inicializa el cliente de conexión a MongoDB.
   */
  constructor() {
    this.client = new MongoClient(this.uri);
  }

  /**
   * @async
   * @function getAllWeapons
   * @description Obtiene todas las armas de la colección.
   * @returns {Promise<WeaponInterface[]>} Devuelve un arreglo con todas las armas.
   */
  readonly getAllWeapons = async (): Promise<WeaponInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<WeaponInterface>(this.collectionName);

      const weapons = await collection.find({}).toArray();
      return weapons;
    } catch (error) {
      console.error("Error al obtener arma:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function getWeaponById
   * @description Obtiene un arma por su ID.
   * @param {number} id - ID del arma a buscar.
   * @returns {Promise<WeaponInterface | null>} Devuelve el arma encontrada o null si no existe.
   */
  readonly getWeaponById = async (id: number): Promise<WeaponInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<WeaponInterface>(this.collectionName);

      const weapon = await collection.findOne({ id: Number(id) });
      return weapon;
    } catch (error) {
      console.error("Error al obtener arma por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function createWeapon
   * @description Crea un nuevo arma en la colección con un ID incremental automático.
   * @param {WeaponInterface} weapon - Objeto que representa el arma a crear.
   * @returns {Promise<void>} Inserta el arma en la base de datos.
   */
  readonly createWeapon = async (weapon: WeaponInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<WeaponInterface>(this.collectionName);

      const lastWeapon = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      const newId = (lastWeapon.at(0)?.id ?? 0) + 1;

      const weaponToInsert = { ...weapon, id: newId };

      await collection.insertOne(weaponToInsert);
      console.log("Arma creada con éxito:", weaponToInsert);
    } catch (error) {
      console.error("Error al crear arma:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function toggleWeaponStatusById
   * @description Cambia el estado (`status`) de un arma (activo/inactivo) por su ID.
   * @param {number} id - ID del arma a actualizar.
   * @returns {Promise<boolean>} True si se actualizó correctamente, false si no se encontró.
   */
  readonly toggleWeaponStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<WeaponInterface>(this.collectionName);

      const weapon = await collection.findOne({ id });

      if (!weapon) {
        console.log(`No se encontró arma con id ${id}`);
        return false;
      }

      const newStatus = !weapon.status;

      const result = await collection.updateOne(
        { id },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`Arma con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar el arma con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status del arma:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function updateWeaponById
   * @description Actualiza los datos de un arma existente por su ID.
   * @param {number} id - ID del arma a actualizar.
   * @param {Partial<WeaponInterface>} updatedWeapon - Campos a modificar en el arma.
   * @returns {Promise<WeaponInterface | null>} Devuelve el arma actualizada o null si no se encontró.
   */
  readonly updateWeaponById = async (
    id: number,
    updatedWeapon: Partial<WeaponInterface>
  ): Promise<WeaponInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<WeaponInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedWeapon }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró arma con id ${id}`);
        return null;
      }

      console.log(`Arma con id ${id} actualizado con éxito`);

      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar arma:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}
