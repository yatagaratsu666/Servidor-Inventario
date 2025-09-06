import { MongoClient } from "mongodb";
import { WeaponInterface } from "../types/WeaponInterface"

/**
 * Clase responsable de manejar las operaciones CRUD sobre la colección de armas en MongoDB.
 * 
 * Proporciona métodos para obtener, crear, actualizar y cambiar el estado de las armas en la base de datos.
 */
export default class WeaponModel {
  /** URI de conexión a la base de datos. */
  private uri = process.env.MONGO_URI!;

  /** Nombre de la base de datos. */
  private dbName = process.env.MONGO_DB!;

  /** Nombre de la colección de armas. */
  private collectionName = process.env.MONGO_COLLECTION_WEAPONS!;

  /** Cliente de MongoDB utilizado para las conexiones. */
  private client: MongoClient;

  /**
   * Crea una instancia del modelo `WeaponModel` e inicializa el cliente de MongoDB.
   */
  constructor() {
    this.client = new MongoClient(this.uri);
  }

  /**
   * Obtiene todas las armas de la colección.
   * @async
   * @returns {Promise<WeaponInterface[]>} Lista de todas las armas disponibles.
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
   * Busca un arma por su ID en la base de datos.
   * @async
   * @param {number} id - ID único del arma.
   * @returns {Promise<WeaponInterface | null>} El arma encontrada o `null` si no existe.
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
   * Crea un nuevo arma en la colección.
   * El ID se asigna automáticamente tomando el último valor existente y sumando 1.
   * @async
   * @param {WeaponInterface} weapon - Objeto que representa el arma a crear.
   * @returns {Promise<void>} No retorna valor, pero inserta el arma en la colección.
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
      console.log("Arma creado con éxito:", weaponToInsert);
    } catch (error) {
      console.error("Error al crear arma:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Cambia el estado (`status`) de un arma de activo a inactivo o viceversa.
   * @async
   * @param {number} id - ID del arma a modificar.
   * @returns {Promise<boolean>} `true` si el estado se actualizó correctamente, `false` en caso contrario.
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
        console.log(`armadura con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar la armadura con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status de la armadura:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Actualiza los datos de un arma existente en la base de datos.
   * Solo se actualizan los campos especificados en `updatedWeapon`.
   * @async
   * @param {number} id - ID del arma a actualizar.
   * @param {Partial<WeaponInterface>} updatedWeapon - Campos a modificar en el arma.
   * @returns {Promise<WeaponInterface | null>} El arma actualizada o `null` si no existe.
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
  
      console.log(`armadura con id ${id} actualizado con éxito`);
  
      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar armadura:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}
