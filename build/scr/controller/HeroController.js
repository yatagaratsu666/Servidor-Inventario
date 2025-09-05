"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeroController {
    heroModel;
    constructor(heroModel) {
        this.heroModel = heroModel;
    }
    getHeroes = async (_req, res) => {
        try {
            const heroes = await this.heroModel.getAllHeroes();
            res.status(200).json(heroes);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener héroes', error });
        }
    };
    getHeroById = async (req, res) => {
        try {
            const { id } = req.params;
            const heroId = parseInt(id, 10);
            const hero = await this.heroModel.getHeroById(heroId);
            if (!hero) {
                res.status(404).json({ message: 'Héroe no encontrado' });
                return;
            }
            res.status(200).json(hero);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener héroe por ID', error });
        }
    };
    createHero = async (req, res) => {
        try {
            const hero = req.body;
            if (!hero || !hero.name) {
                res.status(400).json({ message: 'Faltan datos del héroe' });
                return;
            }
            await this.heroModel.createHero(hero);
            res.status(201).json({ message: 'Héroe creado con éxito', hero });
        }
        catch (error) {
            console.error('Error en createHero:', error);
            res.status(500).json({ message: 'Error al crear héroe' });
        }
    };
    deleteHero = async (req, res) => {
        try {
            const { id } = req.params;
            const heroId = parseInt(id, 10);
            if (isNaN(heroId)) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }
            const deleted = await this.heroModel.toggleItemStatusById(heroId);
            if (!deleted) {
                res
                    .status(404)
                    .json({ message: `No se encontró héroe con id ${heroId}` });
                return;
            }
            res
                .status(200)
                .json({ message: `Héroe con id ${heroId} eliminado con éxito` });
        }
        catch (error) {
            console.error('Error en deleteHero:', error);
            res.status(500).json({ message: 'Error al eliminar héroe', error });
        }
    };
    updateHero = async (req, res) => {
        try {
            const { id } = req.params;
            const heroId = parseInt(id, 10);
            if (isNaN(heroId)) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }
            const { ...updatedFields } = req.body;
            if (!updatedFields || Object.keys(updatedFields).length === 0) {
                res
                    .status(400)
                    .json({ message: 'No se enviaron campos para actualizar' });
                return;
            }
            const updatedHero = await this.heroModel.updateHeroById(heroId, updatedFields);
            if (!updatedHero) {
                res
                    .status(404)
                    .json({ message: `No se encontró item con id ${heroId}` });
                return;
            }
            res.status(200).json({
                message: `Item con id ${heroId} actualizado con éxito`,
                updatedHero,
            });
        }
        catch (error) {
            console.error('Error en updateItem:', error);
            res.status(500).json({ message: 'Error al actualizar item', error });
        }
    };
}
exports.default = HeroController;
