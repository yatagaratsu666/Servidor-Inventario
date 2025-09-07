import { MongoClient } from "mongodb";
import ItemInterface from "../types/ItemInterface";

/**
 * @class ItemModel
 * @classdesc Modelo para gestionar operaciones CRUD de ítems en la base de datos MongoDB.
 * Contiene métodos para obtener, crear, actualizar y cambiar el estado de los ítems.
 */
export default class ItemModel {
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
   * Nombre de la colección de ítems en MongoDB.
   * @private
   */
  private collectionName = process.env.MONGO_COLLECTION_ITEMS!;

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
   * @function getAllItems
   * @description Obtiene todos los ítems registrados en la colección.
   * @returns {Promise<ItemInterface[]>} Devuelve un array con todos los ítems.
   */
  readonly getAllItems = async (): Promise<ItemInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const items = await collection.find({}).toArray();
      return items;
    } catch (error) {
      console.error("Error al obtener ítems:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function getItemById
   * @description Obtiene un ítem por su ID.
   * @param {number} id - ID del ítem a buscar.
   * @returns {Promise<ItemInterface | null>} Devuelve el ítem encontrado o null si no existe.
   */
  readonly getItemById = async (id: number): Promise<ItemInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const item = await collection.findOne({ id: Number(id) });
      return item;
    } catch (error) {
      console.error("Error al obtener ítem por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function createItem
   * @description Crea un nuevo ítem en la colección con un ID incremental automático.
   * @param {ItemInterface} item - Datos del ítem a crear.
   * @returns {Promise<void>}
   */
  readonly createItem = async (item: ItemInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const lastItem = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      const newId = (lastItem.at(0)?.id ?? 0) + 1;

      const itemToInsert = { ...item, id: newId };

      await collection.insertOne(itemToInsert);
      console.log("Ítem creado con éxito:", itemToInsert);
    } catch (error) {
      console.error("Error al crear ítem:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function toggleItemStatusById
   * @description Cambia el estado (activo/inactivo) de un ítem por su ID.
   * @param {number} id - ID del ítem a actualizar.
   * @returns {Promise<boolean>} True si se modificó correctamente, False si no se encontró el ítem.
   */
  readonly toggleItemStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const item = await collection.findOne({ id });

      if (!item) {
        console.log(`No se encontró ítem con id ${id}`);
        return false;
      }

      const newStatus = !item.status;

      const result = await collection.updateOne(
        { id },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`Ítem con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar el ítem con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status del ítem:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function updateItemById
   * @description Actualiza un ítem por su ID con los campos proporcionados.
   * @param {number} id - ID del ítem a actualizar.
   * @param {Partial<ItemInterface>} updatedItem - Campos a actualizar.
   * @returns {Promise<ItemInterface | null>} Devuelve el ítem actualizado o null si no existe.
   */
  readonly updateItemById = async (
    id: number,
    updatedItem: Partial<ItemInterface>
  ): Promise<ItemInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedItem }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró ítem con id ${id}`);
        return null;
      }

      console.log(`Ítem con id ${id} actualizado con éxito`);

      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar ítem:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}
