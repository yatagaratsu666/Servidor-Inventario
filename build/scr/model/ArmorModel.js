"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class ArmorModel {
    uri = "mongodb://localhost:27017";
    dbName = "Inventario";
    collectionName = "armors";
    client;
    constructor() {
        this.client = new mongodb_1.MongoClient(this.uri);
    }
    getAllArmors = async () => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const armors = await collection.find({}).toArray();
            return armors;
        }
        catch (error) {
            console.error("Error al obtener armadura:", error);
            return [];
        }
        finally {
            await this.client.close();
        }
    };
    getArmorById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const armor = await collection.findOne({ id: Number(id) });
            return armor;
        }
        catch (error) {
            console.error("Error al obtener armadura por ID:", error);
            return null;
        }
        finally {
            await this.client.close();
        }
    };
    createArmor = async (armor) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const lastArmor = await collection
                .find()
                .sort({ id: -1 })
                .limit(1)
                .toArray();
            const newId = (lastArmor.at(0)?.id ?? 0) + 1;
            const armorToInsert = { ...armor, id: newId };
            await collection.insertOne(armorToInsert);
            console.log("Armadura creada con éxito:", armorToInsert);
        }
        catch (error) {
            console.error("Error al crear armadura:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    toggleArmorStatusById = async (id) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const armor = await collection.findOne({ id });
            if (!armor) {
                console.log(`No se encontró armadura con id ${id}`);
                return false;
            }
            const newStatus = !armor.status;
            const result = await collection.updateOne({ id }, { $set: { status: newStatus } });
            if (result.modifiedCount && result.modifiedCount > 0) {
                console.log(`armadura con id ${id} cambiado a status = ${newStatus}`);
                return true;
            }
            else {
                console.log(`No se pudo actualizar la armadura con id ${id}`);
                return false;
            }
        }
        catch (error) {
            console.error("Error al cambiar el status de la armadura:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
    updateArmorById = async (id, updatedArmor) => {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const updateResult = await collection.updateOne({ id }, { $set: updatedArmor });
            if (updateResult.matchedCount === 0) {
                console.log(`No se encontró armadura con id ${id}`);
                return null;
            }
            console.log(`armadura con id ${id} actualizado con éxito`);
            const updatedDoc = await collection.findOne({ id });
            return updatedDoc;
        }
        catch (error) {
            console.error("Error al actualizar armadura:", error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    };
}
exports.default = ArmorModel;
