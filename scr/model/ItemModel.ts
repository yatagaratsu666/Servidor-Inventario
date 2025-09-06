import { MongoClient } from "mongodb";
import ItemInterface from "../types/ItemInterface";

/**
 * Clase ItemModel
 * Maneja todas las operaciones CRUD relacionadas con los ítems en la base de datos MongoDB.
 * Incluye métodos para obtener, crear, actualizar y cambiar el estado de un ítem.
 */
export default class ItemModel {
  // URI de conexión a MongoDB definida en las variables de entorno
  private uri = process.env.MONGO_URI!;
  // Nombre de la base de datos
  private dbName = process.env.MONGO_DB!;
  // Nombre de la colección de ítems
  private collectionName = process.env.MONGO_COLLECTION_ITEMS!;
  // Cliente de conexión a MongoDB
  private client: MongoClient;

  constructor() {
    // Inicializa el cliente de MongoDB con la URI configurada
    this.client = new MongoClient(this.uri);
  }

  /**
   * Obtiene todos los ítems de la base de datos.
   * @returns Un arreglo de ítems (ItemInterface[]).
   */
  readonly getAllItems = async (): Promise<ItemInterface[]> => {
    try {
      await this.client.connect(); // Conexión con el servidor
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const heroes = await collection.find({}).toArray(); // Busca todos los documentos
      return heroes;
    } catch (error) {
      console.error("Error al obtener héroes:", error);
      return [];
    } finally {
      await this.client.close(); // Cierra la conexión
    }
  };

  /**
   * Obtiene un ítem específico por su ID.
   * @param id - Identificador del ítem.
   * @returns El ítem encontrado o null si no existe.
   */
  readonly getItemById = async (id: number): Promise<ItemInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      const hero = await collection.findOne({ id: Number(id) });
      return hero;
    } catch (error) {
      console.error("Error al obtener item por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Crea un nuevo ítem en la base de datos.
   * Genera un nuevo ID de forma incremental.
   * @param hero - Datos del ítem a insertar.
   */
  readonly createItem = async (hero: ItemInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      // Busca el último ítem por ID descendente
      const lastHero = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      // Si no existe, inicia en 0; luego incrementa en 1
      const newId = (lastHero.at(0)?.id ?? 0) + 1;

      const heroToInsert = { ...hero, id: newId };

      await collection.insertOne(heroToInsert);
      console.log("Héroe creado con éxito:", heroToInsert);
    } catch (error) {
      console.error("Error al crear héroe:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Cambia el estado (activo/inactivo) de un ítem por su ID.
   * @param id - Identificador del ítem.
   * @returns true si se actualizó el estado, false en caso contrario.
   */
  readonly toggleItemStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      // Busca el ítem actual
      const item = await collection.findOne({ id });

      if (!item) {
        console.log(`No se encontró item con id ${id}`);
        return false;
      }

      // Invierte el estado actual
      const newStatus = !item.status;

      const result = await collection.updateOne(
        { id },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`Item con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar el item con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status del item:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Actualiza un ítem por su ID con los nuevos valores proporcionados.
   * @param id - Identificador del ítem.
   * @param updatedItem - Campos a actualizar (parcial de ItemInterface).
   * @returns El ítem actualizado o null si no se encontró.
   */
  readonly updateItemById = async (
    id: number,
    updatedItem: Partial<ItemInterface>
  ): Promise<ItemInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<ItemInterface>(this.collectionName);

      // Actualiza el documento
      const updateResult = await collection.updateOne(
        { id },
        { $set: updatedItem }
      );

      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró item con id ${id}`);
        return null;
      }

      console.log(`Item con id ${id} actualizado con éxito`);

      // Devuelve el documento actualizado
      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar item:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}
