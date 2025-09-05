"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class ItemModel {
    uri = "mongodb://localhost:27017"; // Cambiar por "mongodb://mongo-contenedor:27017" una vez se use Docker
    dbName = "Inventario";
    collectionName = "items";
    client;
    constructor() {
        this.client = new mongodb_1.MongoClient(this.uri);
    }
    getAllItems = async () => {
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
    getItemById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const hero = await collection.findOne({ id: Number(id) });
            return hero;
        }
        catch (error) {
            console.error("Error al obtener item por ID:", error);
            return null;
        }
        finally {
            await this.client.close();
        }
    };
    createItem = async (hero) => {
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
            const item = await collection.findOne({ id });
            if (!item) {
                console.log(`No se encontró item con id ${id}`);
                return false;
            }
            // Cambiamos el status al valor opuesto
            const newStatus = !item.status;
            const result = await collection.updateOne({ id }, { $set: { status: newStatus } });
            if (result.modifiedCount && result.modifiedCount > 0) {
                console.log(`Item con id ${id} cambiado a status = ${newStatus}`);
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
    updateItemById = async (id, updatedItem) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            // Actualiza el documento
            const updateResult = await collection.updateOne({ id }, { $set: updatedItem });
            if (updateResult.matchedCount === 0) {
                console.log(`No se encontró item con id ${id}`);
                return null;
            }
            console.log(`Item con id ${id} actualizado con éxito`);
            // Trae el documento actualizado
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
exports.default = ItemModel;
