"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class EpicModel {
    uri = "mongodb://localhost:27017";
    dbName = "Inventario";
    collectionName = "epics";
    client;
    constructor() {
        this.client = new mongodb_1.MongoClient(this.uri);
    }
    getAllEpics = async () => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const heroes = await collection.find({}).toArray();
            return heroes;
        }
        catch (error) {
            console.error("Error al obtener epicas:", error);
            return [];
        }
        finally {
            await this.client.close();
        }
    };
    getEpicById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const epic = await collection.findOne({ id: Number(id) });
            return epic;
        }
        catch (error) {
            console.error("Error al obtener epica por ID:", error);
            return null;
        }
        finally {
            await this.client.close();
        }
    };
    createEpic = async (epic) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const lastHero = await collection
                .find()
                .sort({ id: -1 })
                .limit(1)
                .toArray();
            const newId = (lastHero.at(0)?.id ?? 0) + 1;
            const epicToInsert = { ...epic, id: newId };
            await collection.insertOne(epicToInsert);
            console.log("Epica creada con éxito:", epicToInsert);
        }
        catch (error) {
            console.error("Error al crear epica:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    toggleEpicStatusById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const epic = await collection.findOne({ id });
            if (!epic) {
                console.log(`No se encontró epica con id ${id}`);
                return false;
            }
            const newStatus = !epic.status;
            const result = await collection.updateOne({ id }, { $set: { status: newStatus } });
            if (result.modifiedCount && result.modifiedCount > 0) {
                console.log(`epica con id ${id} cambiado a status = ${newStatus}`);
                return true;
            }
            else {
                console.log(`No se pudo actualizar la epica con id ${id}`);
                return false;
            }
        }
        catch (error) {
            console.error("Error al cambiar el status de la epica:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    updateEpicById = async (id, updatedEpic) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const updateResult = await collection.updateOne({ id }, { $set: updatedEpic });
            if (updateResult.matchedCount === 0) {
                console.log(`No se encontró epica con id ${id}`);
                return null;
            }
            console.log(`epica con id ${id} actualizado con éxito`);
            const updatedDoc = await collection.findOne({ id });
            return updatedDoc;
        }
        catch (error) {
            console.error("Error al actualizar epica:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
}
exports.default = EpicModel;
