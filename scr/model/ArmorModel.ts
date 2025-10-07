import { MongoClient } from "mongodb";
import { ArmorInterface } from "../types/ArmorInterface";

/**
 * @class ArmorModel
 * @classdesc Modelo para gestionar operaciones CRUD de armaduras en la base de datos MongoDB.
 */
export default class ArmorModel {
  /**
   * URI de conexión a MongoDB.
   * @private
   */
  private uri = process.env.MONGO_URI!;

  /**
   * Nombre de la base de datos en MongoDB.
   * @private
   */
  private dbName = process.env.MONGO_DB!;

  /**
   * Nombre de la colección de armaduras en MongoDB.
   * @private
   */
  private collectionName = process.env.MONGO_COLLECTION_ARMORS!;

  /**
   * Cliente de conexión a MongoDB.
   * @private
   */
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
   * @function getAllArmors
   * @description Obtiene todas las armaduras de la colección.
   * @returns {Promise<ArmorInterface[]>} Devuelve un array con todas las armaduras registradas.
   */
  readonly getAllArmors = async (): Promise<ArmorInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const armors = await collection.find({}).toArray();
      return armors;
    } catch (error) {
      console.error("Error al obtener armadura:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function getArmorById
   * @description Obtiene una armadura por su ID.
   * @param {number} id - ID de la armadura a buscar.
   * @returns {Promise<ArmorInterface | null>} Devuelve la armadura encontrada o null si no existe.
   */
  readonly getArmorById = async (id: number): Promise<ArmorInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const armor = await collection.findOne({ id: Number(id) });
      return armor;
    } catch (error) {
      console.error("Error al obtener armadura por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function createArmor
   * @description Crea una nueva armadura en la colección.
   * @param {ArmorInterface} armor - Datos de la armadura a crear.
   * @returns {Promise<void>} Devuelve void.
   */
  readonly createArmor = async (armor: ArmorInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const lastArmor = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      const newId = (lastArmor.at(0)?.id ?? 0) + 1;

      const armorToInsert = { ...armor, id: newId };

      await collection.insertOne(armorToInsert);
      console.log("Armadura creada con éxito:", armorToInsert);
    } catch (error) {
      console.error("Error al crear armadura:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function toggleArmorStatusById
   * @description Cambia el estado (activo/inactivo) de una armadura por su ID.
   * @param {number} id - ID de la armadura a actualizar.
   * @returns {Promise<boolean>} True si se actualizó correctamente, False si no se encontró la armadura.
   */
  readonly toggleArmorStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const armor = await collection.findOne({ id });

      if (!armor) {
        console.log(`No se encontró armadura con id ${id}`);
        return false;
      }

      const newStatus = !armor.status;

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
   * @async
   * @function updateArmorById
   * @description Actualiza los campos de una armadura por su ID.
   * @param {number} id - ID de la armadura a actualizar.
   * @param {Partial<ArmorInterface>} updatedArmor - Campos a actualizar.
   * @returns {Promise<ArmorInterface | null>} Devuelve la armadura actualizada o null si no existe.
   */
  readonly updateArmorById = async (
    id: number,
    updatedArmor: Partial<ArmorInterface>
  ): Promise<ArmorInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedArmor }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró armadura con id ${id}`);
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

    /**
   * @async
   * @function updateArmorById
   * @description Actualiza una armadura por su ID con los datos proporcionados.
   * @param {number} id - ID de la armadura a actualizar.
   * @param {Partial<ArmorInterface>} updatedArmor - Campos a actualizar.
   * @returns {Promise<ArmorInterface | null>} Devuelve la armadura actualizada o null si no existe.
   */
  readonly updateArmorStatus = async (
    id: number,
    updatedArmor: Partial<ArmorInterface>
  ): Promise<ArmorInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ArmorInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedArmor }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró armadura con id ${id}`);
        return null;
      }

      console.log(`Armadura con id ${id} actualizada con éxito`);

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
