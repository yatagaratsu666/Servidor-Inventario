"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemController {
    itemModel;
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    getItems = async (_req, res) => {
        try {
            const item = await this.itemModel.getAllItems();
            res.status(200).json(item);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener items", error });
        }
    };
    getItemById = async (req, res) => {
        try {
            const { id } = req.params;
            const heroId = parseInt(id, 10);
            const hero = await this.itemModel.getItemById(heroId);
            if (!hero) {
                res.status(404).json({ message: "Héroe no encontrado" });
                return;
            }
            res.status(200).json(hero);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener héroe por ID", error });
        }
    };
    createItem = async (req, res) => {
        try {
            const hero = req.body;
            if (!hero || !hero.name) {
                res.status(400).json({ message: "Faltan datos del héroe" });
                return;
            }
            await this.itemModel.createItem(hero);
            res.status(201).json({ message: "Héroe creado con éxito", hero });
        }
        catch (error) {
            console.error("Error en createHero:", error);
            res.status(500).json({ message: "Error al crear héroe" });
        }
    };
    deleteItem = async (req, res) => {
        try {
            const { id } = req.params;
            const itemId = parseInt(id, 10);
            if (isNaN(itemId)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const deleted = await this.itemModel.toggleItemStatusById(itemId);
            if (!deleted) {
                res
                    .status(404)
                    .json({ message: `No se encontró item con id ${itemId}` });
                return;
            }
            res
                .status(200)
                .json({ message: `item con id ${itemId} eliminado con éxito` });
        }
        catch (error) {
            console.error("Error en deleteItem:", error);
            res.status(500).json({ message: "Error al eliminar item", error });
        }
    };
    updateItem = async (req, res) => {
        try {
            const { id } = req.params;
            const itemId = parseInt(id, 10);
            const updatedFields = req.body;
            if (isNaN(itemId)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            if (!updatedFields || Object.keys(updatedFields).length === 0) {
                res
                    .status(400)
                    .json({ message: "No se enviaron campos para actualizar" });
                return;
            }
            const updatedItem = await this.itemModel.updateItemById(itemId, updatedFields);
            if (!updatedItem) {
                res
                    .status(404)
                    .json({ message: `No se encontró item con id ${itemId}` });
                return;
            }
            res
                .status(200)
                .json({
                message: `Item con id ${itemId} actualizado con éxito`,
                updatedItem,
            });
        }
        catch (error) {
            console.error("Error en updateItem:", error);
            res.status(500).json({ message: "Error al actualizar item", error });
        }
    };
}
exports.default = ItemController;
