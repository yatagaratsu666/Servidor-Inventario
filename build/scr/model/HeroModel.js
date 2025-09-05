"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class HeroModel {
    uri = "mongodb://localhost:27017"; // Cambiar por "mongodb://mongo-contenedor:27017" una vez se use Docker
    dbName = "Inventario";
    collectionName = "heroes";
    client;
    constructor() {
        this.client = new mongodb_1.MongoClient(this.uri);
    }
    getAllHeroes = async () => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const heroes = await collection.find({}).toArray();
            return heroes;
        }
        catch (error) {
            console.error("Error al obtener héroes:", error);
            return [];
        }
        finally {
            await this.client.close();
        }
    };
    getHeroById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const hero = await collection.findOne({ id: Number(id) });
            return hero;
        }
        catch (error) {
            console.error("Error al obtener héroe por ID:", error);
            return null;
        }
        finally {
            await this.client.close();
        }
    };
    createHero = async (hero) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
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
        }
        catch (error) {
            console.error("Error al crear héroe:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    toggleItemStatusById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            // Primero obtenemos el item actual
            const hero = await collection.findOne({ id });
            if (!hero) {
                console.log(`No se encontró item con id ${id}`);
                return false;
            }
            // Cambiamos el status al valor opuesto
            const newStatus = !hero.status;
            const result = await collection.updateOne({ id }, { $set: { status: newStatus } });
            if (result.modifiedCount && result.modifiedCount > 0) {
                console.log(`heroe con id ${id} cambiado a status = ${newStatus}`);
                return true;
            }
            else {
                console.log(`No se pudo actualizar el item con id ${id}`);
                return false;
            }
        }
        catch (error) {
            console.error("Error al cambiar el status del item:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    updateHeroById = async (id, updatedItem) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const updateResult = await collection.updateOne({ id }, { $set: updatedItem });
            if (updateResult.matchedCount === 0) {
                console.log(`No se encontró item con id ${id}`);
                return null;
            }
            console.log(`Item con id ${id} actualizado con éxito`);
            const updatedDoc = await collection.findOne({ id });
            return updatedDoc;
        }
        catch (error) {
            console.error("Error al actualizar item:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
}
exports.default = HeroModel;
