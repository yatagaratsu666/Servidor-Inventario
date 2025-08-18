import { MongoClient } from "mongodb";
import HeroInterface from "../types/HeroInterface";

export default class HeroModel {
  private uri = "mongodb://localhost:27017";
  private dbName = "Inventario";
  private collectionName = "heroes";
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

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

  readonly createHero = async (hero: HeroInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<HeroInterface>(this.collectionName);

      // Buscar el último héroe ordenado por id descendente
      const lastHero = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      // Si no existe, asigna 0 y luego +1
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

 readonly toggleItemStatusById = async (id: number): Promise<boolean> => {
   try {
     await this.client.connect();
     const db = this.client.db(this.dbName);
     const collection = db.collection<HeroInterface>(this.collectionName);
 
     // Primero obtenemos el item actual
     const hero = await collection.findOne({ id });
 
     if (!hero) {
       console.log(`No se encontró item con id ${id}`);
       return false;
     }
 
     // Cambiamos el status al valor opuesto
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

  
    readonly updateHeroById = async (
      id: number,
      updatedHero: Partial<HeroInterface>
    ): Promise<HeroInterface | null> => {
      try {
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection<HeroInterface>(this.collectionName);
  
        // Actualiza el documento
        const updateResult = await collection.updateOne(
          { id },
          { $set: updatedHero }
        );
  
        if (updateResult.matchedCount === 0) {
          console.log(`No se encontró heroe con id ${id}`);
          return null;
        }
  
        console.log(`heroe con id ${id} actualizado con éxito`);
  
        // Trae el documento actualizado
        const updatedDoc = await collection.findOne({ id });
        return updatedDoc;
      } catch (error) {
        console.error("Error al actualizar heroe:", error);
        throw error;
      } finally {
        await this.client.close();
      }
    };
}
