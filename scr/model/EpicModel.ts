import { MongoClient } from "mongodb";
import { EpicInterface } from "../types/EpicInterface";

/**
 * @class EpicModel
 * @classdesc Modelo para gestionar operaciones CRUD de épicas en la base de datos MongoDB.
 * Contiene métodos para obtener, crear, actualizar y cambiar el estado de las épicas.
 */
export default class EpicModel {
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
   * Nombre de la colección de épicas en MongoDB.
   * @private
   */
  private collectionName = process.env.MONGO_COLLECTION_EPICAS!;

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
   * @function getAllEpics
   * @description Obtiene todas las épicas registradas en la colección.
   * @returns {Promise<EpicInterface[]>} Devuelve un array con todas las épicas.
   */
  readonly getAllEpics = async (): Promise<EpicInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const heroes = await collection.find({}).toArray();
      return heroes;
    } catch (error) {
      console.error("Error al obtener epicas:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function getEpicById
   * @description Obtiene una épica por su ID.
   * @param {number} id - ID de la épica a buscar.
   * @returns {Promise<EpicInterface | null>} Devuelve la épica encontrada o null si no existe.
   */
  readonly getEpicById = async (id: number): Promise<EpicInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const epic = await collection.findOne({ id: Number(id) });
      return epic;
    } catch (error) {
      console.error("Error al obtener epica por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function createEpic
   * @description Crea una nueva épica en la colección con un ID incremental automático.
   * @param {EpicInterface} epic - Datos de la épica a crear.
   * @returns {Promise<void>}
   */
  readonly createEpic = async (epic: EpicInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const lastHero = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      const newId = (lastHero.at(0)?.id ?? 0) + 1;

      const epicToInsert = { ...epic, id: newId };

      await collection.insertOne(epicToInsert);
      console.log("Epica creada con éxito:", epicToInsert);
    } catch (error) {
      console.error("Error al crear epica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function toggleEpicStatusById
   * @description Cambia el estado (activo/inactivo) de una épica por su ID.
   * @param {number} id - ID de la épica a actualizar.
   * @returns {Promise<boolean>} True si se modificó correctamente, False si no se encontró la épica.
   */
  readonly toggleEpicStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const epic = await collection.findOne({ id });

      if (!epic) {
        console.log(`No se encontró epica con id ${id}`);
        return false;
      }

      const newStatus = !epic.status;

      const result = await collection.updateOne(
        { id },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`epica con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar la epica con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status de la epica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function updateEpicById
   * @description Actualiza los campos de una épica existente por su ID.
   * @param {number} id - ID de la épica a actualizar.
   * @param {Partial<EpicInterface>} updatedEpic - Campos a actualizar.
   * @returns {Promise<EpicInterface | null>} Devuelve la épica actualizada o null si no existe.
   */
  readonly updateEpicById = async (
    id: number,
    updatedEpic: Partial<EpicInterface>
  ): Promise<EpicInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedEpic }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró epica con id ${id}`);
        return null;
      }

      console.log(`epica con id ${id} actualizado con éxito`);

      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar epica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

    /**
   * @async
   * @function updateEpicById
   * @description Actualiza una épica por su ID con los datos proporcionados.
   * @param {number} id - ID de la épica a actualizar.
   * @param {Partial<EpicInterface>} updatedEpic - Campos a actualizar.
   * @returns {Promise<EpicInterface | null>} Devuelve la épica actualizada o null si no existe.
   */
  readonly updateEpicStatus = async (
    id: number,
    updatedEpic: Partial<EpicInterface>
  ): Promise<EpicInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedEpic }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró épica con id ${id}`);
        return null;
      }

      console.log(`Épica con id ${id} actualizada con éxito`);

      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar épica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };


}
