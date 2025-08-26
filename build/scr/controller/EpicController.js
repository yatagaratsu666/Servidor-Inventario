"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EpicController {
    epicModel;
    constructor(epicModel) {
        this.epicModel = epicModel;
    }
    getEpics = async (_req, res) => {
        try {
            const heroes = await this.epicModel.getAllEpics();
            res.status(200).json(heroes);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener héroes", error });
        }
    };
    getEpicById = async (req, res) => {
        try {
            const { id } = req.params;
            const heroId = parseInt(id, 10);
            const hero = await this.epicModel.getEpicById(heroId);
            if (!hero) {
                res.status(404).json({ message: "epica no encontrada" });
                return;
            }
            res.status(200).json(hero);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener epica por ID", error });
        }
    };
    createEpic = async (req, res) => {
        try {
            const epic = req.body;
            if (!epic || !epic.name) {
                res.status(400).json({ message: "Faltan datos de la epica" });
                return;
            }
            await this.epicModel.createEpic(epic);
            res.status(201).json({ message: "Epica creada con éxito", epic });
        }
        catch (error) {
            console.error("Error al crear epica:", error);
            res.status(500).json({ message: "Error al crear epica" });
        }
    };
    deleteEpic = async (req, res) => {
        try {
            const { id } = req.params;
            const epicId = parseInt(id, 10);
            if (isNaN(epicId)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const deleted = await this.epicModel.toggleEpicStatusById(epicId);
            if (!deleted) {
                res
                    .status(404)
                    .json({ message: `No se encontró epica con id ${epicId}` });
                return;
            }
            res
                .status(200)
                .json({ message: `Epica con id ${epicId} eliminado con éxito` });
        }
        catch (error) {
            console.error("Error en deleteEpic:", error);
            res.status(500).json({ message: "Error al eliminar epica", error });
        }
    };
    updateEpic = async (req, res) => {
        try {
            const { id } = req.params;
            const epicId = parseInt(id, 10);
            const updatedFields = req.body;
            if (isNaN(epicId)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            if (!updatedFields || Object.keys(updatedFields).length === 0) {
                res
                    .status(400)
                    .json({ message: "No se enviaron campos para actualizar" });
                return;
            }
            const updatedEpic = await this.epicModel.updateEpicById(epicId, updatedFields);
            if (!updatedEpic) {
                res
                    .status(404)
                    .json({ message: `No se encontró epica con id ${epicId}` });
                return;
            }
            res
                .status(200)
                .json({
                message: `Epica con id ${epicId} actualizado con éxito`,
                updatedEpic,
            });
        }
        catch (error) {
            console.error("Error en updateEpic:", error);
            res.status(500).json({ message: "Error al actualizar epica", error });
        }
    };
}
exports.default = EpicController;
