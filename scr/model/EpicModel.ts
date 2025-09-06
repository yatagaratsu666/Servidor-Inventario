import { MongoClient } from "mongodb";
import { EpicInterface } from "../types/EpicInterface";

/**
 * Clase EpicModel
 * Se encarga de gestionar todas las operaciones relacionadas con las épicas en la base de datos MongoDB.
 * Implementa métodos CRUD: obtener, crear, actualizar y cambiar estado de las épicas.
 */
export default class EpicModel {
  // URI de conexión a MongoDB obtenida desde variables de entorno
  private uri = process.env.MONGO_URI!;
  // Nombre de la base de datos definido en variables de entorno
  private dbName = process.env.MONGO_DB!;
  // Nombre de la colección donde se guardan las épicas
  private collectionName = process.env.MONGO_COLLECTION_EPICAS!;
  // Cliente de conexión a MongoDB
  private client: MongoClient;

  constructor() {
    // Inicializa el cliente de MongoDB con la URI
    this.client = new MongoClient(this.uri);
  }

  /**
   * Obtiene todas las épicas de la base de datos.
   * @returns Lista de épicas como un arreglo de EpicInterface.
   */
  readonly getAllEpics = async (): Promise<EpicInterface[]> => {
    try {
      await this.client.connect(); // Conexión al servidor MongoDB
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      const heroes = await collection.find({}).toArray(); // Busca todas las épicas
      return heroes;
    } catch (error) {
      console.error("Error al obtener epicas:", error);
      return [];
    } finally {
      await this.client.close(); // Cierra la conexión
    }
  };

  /**
   * Obtiene una épica por su ID.
   * @param id - Identificador de la épica a buscar.
   * @returns La épica encontrada o null si no existe.
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
   * Crea una nueva épica en la base de datos.
   * Genera un ID incremental automáticamente.
   * @param epic - Datos de la épica a crear.
   */
  readonly createEpic = async (epic: EpicInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);

      // Busca el último ID para asignar el siguiente
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
   * Cambia el estado (activo/inactivo) de una épica por su ID.
   * @param id - Identificador de la épica.
   * @returns true si se modificó el estado, false en caso contrario.
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

      // Invierte el estado actual
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
   * Actualiza una épica existente por su ID.
   * @param id - Identificador de la épica a actualizar.
   * @param updatedEpic - Objeto parcial con los campos a modificar.
   * @returns La épica actualizada o null si no se encontró.
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

      // Devuelve el documento actualizado
      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar epica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}
