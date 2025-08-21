import { MongoClient } from "mongodb";
import { WeaponInterface } from "../types/WeaponInterface"

export default class WeaponModel {
  private uri = "mongodb://localhost:27017";
  private dbName = "Inventario";
  private collectionName = "weapons";
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

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
