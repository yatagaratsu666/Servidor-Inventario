import { MongoClient } from "mongodb";
import HeroInterface from "../types/HeroInterface";

/**
 * Clase HeroModel
 * Maneja todas las operaciones CRUD relacionadas con los héroes en la base de datos MongoDB.
 * Incluye métodos para obtener, crear, actualizar y cambiar el estado de un héroe.
 */
export default class HeroModel {
  // URI de conexión a MongoDB definida en las variables de entorno
  private uri = process.env.MONGO_URI!;
  // Nombre de la base de datos
  private dbName = process.env.MONGO_DB!;
  // Nombre de la colección de héroes
  private collectionName = process.env.MONGO_COLLECTION_HEROES!;
  // Cliente de conexión a MongoDB
  private client: MongoClient;

  constructor() {
    // Inicializa el cliente de MongoDB con la URI configurada
    this.client = new MongoClient(this.uri);
  }

  /**
   * Obtiene todos los héroes de la base de datos.
   * @returns Un arreglo de héroes (HeroInterface[]).
   */
  readonly getAllHeroes = async (): Promise<HeroInterface[]> => {
    try {
      await this.client.connect(); // Conexión con el servidor
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

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
   * Obtiene un héroe específico por su ID.
   * @param id - Identificador del héroe.
   * @returns El héroe encontrado o null si no existe.
   */
  readonly getHeroById = async (id: number): Promise<HeroInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      const hero = await collection.findOne({ id: Number(id) });
      return hero;
    } catch (error) {
      console.error("Error al obtener héroe por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  /**
   * Crea un nuevo héroe en la base de datos.
   * Genera un nuevo ID de forma incremental.
   * @param hero - Datos del héroe a insertar.
   */
  readonly createHero = async (hero: HeroInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      // Busca el último héroe por ID descendente
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
   * Cambia el estado (activo/inactivo) de un héroe por su ID.
   * @param id - Identificador del héroe.
   * @returns true si se actualizó el estado, false en caso contrario.
   */
  readonly toggleItemStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      // Busca el héroe actual
      const hero = await collection.findOne({ id });

      if (!hero) {
        console.log(`No se encontró item con id ${id}`);
        return false;
      }

      // Invierte el estado actual
      const newStatus = !hero.status;

      const result = await collection.updateOne(
        { id },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`heroe con id ${id} cambiado a status = ${newStatus}`);
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
   * Actualiza un héroe por su ID con los nuevos valores proporcionados.
   * @param id - Identificador del héroe.
   * @param updatedItem - Campos a actualizar (parcial de HeroInterface).
   * @returns El héroe actualizado o null si no se encontró.
   */
  readonly updateHeroById = async (
    id: number,
    updatedItem: Partial<HeroInterface>
  ): Promise<HeroInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

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
