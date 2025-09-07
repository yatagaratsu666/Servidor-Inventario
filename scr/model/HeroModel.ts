import { MongoClient } from "mongodb";
import HeroInterface from "../types/HeroInterface";

/**
 * @class HeroModel
 * @classdesc Modelo para gestionar operaciones CRUD de héroes en la base de datos MongoDB.
 * Contiene métodos para obtener, crear, actualizar y cambiar el estado de los héroes.
 */
export default class HeroModel {
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
   * Nombre de la colección de héroes en MongoDB.
   * @private
   */
  private collectionName = process.env.MONGO_COLLECTION_HEROES!;

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
   * @function getAllHeroes
   * @description Obtiene todos los héroes registrados en la colección.
   * @returns {Promise<HeroInterface[]>} Devuelve un array con todos los héroes.
   */
  readonly getAllHeroes = async (): Promise<HeroInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      const heroes = await collection.find({}).toArray();
      return heroes;
    } catch (error) {
      console.error("Error al obtener héroes:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  /**
   * @async
   * @function getHeroById
   * @description Obtiene un héroe por su ID.
   * @param {number} id - ID del héroe a buscar.
   * @returns {Promise<HeroInterface | null>} Devuelve el héroe encontrado o null si no existe.
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
   * @async
   * @function createHero
   * @description Crea un nuevo héroe en la colección con un ID incremental automático.
   * @param {HeroInterface} hero - Datos del héroe a crear.
   * @returns {Promise<void>}
   */
  readonly createHero = async (hero: HeroInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      const lastHero = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

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
   * @async
   * @function toggleItemStatusById
   * @description Cambia el estado (activo/inactivo) de un héroe por su ID.
   * @param {number} id - ID del héroe a actualizar.
   * @returns {Promise<boolean>} True si se modificó correctamente, False si no se encontró el héroe.
   */
  readonly toggleItemStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      const hero = await collection.findOne({ id });

      if (!hero) {
        console.log(`No se encontró item con id ${id}`);
        return false;
      }

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
   * @async
   * @function updateHeroById
   * @description Actualiza un héroe por su ID con los campos proporcionados.
   * @param {number} id - ID del héroe a actualizar.
   * @param {Partial<HeroInterface>} updatedItem - Campos a actualizar.
   * @returns {Promise<HeroInterface | null>} Devuelve el héroe actualizado o null si no existe.
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
