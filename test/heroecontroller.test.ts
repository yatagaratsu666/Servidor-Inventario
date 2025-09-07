import { Request, Response } from "express";
import HeroController from "../scr/controller/HeroController";
import HeroModel from "../scr/model/HeroModel";
import HeroInterface from "../scr/types/HeroInterface";

describe("HeroController", () => {
  let heroModelMock: jest.Mocked<HeroModel>;
  let heroController: HeroController;
  let res: Partial<Response>;

  const mockHero: HeroInterface = {
    id: 1,
    image: "url/hero.png",
    name: "Guerrero Valiente",
    heroType: "guerrero",
    description: "Aumenta la defensa del equipo",
    level: 1,
    power: 50,
    health: 200,
    defense: 30,
    status: true,
    stock: 1,
    attack: 25,
    attackBoost: { min: 5, max: 10 },
    damage: { min: 10, max: 20 },
    specialActions: [
      { name: "Golpe Especial", actionType: "ataque", powerCost: 10, cooldown: 2, isAvailable: true }
    ],
    effect: { effectType: "", value: 0, durationTurns: 0 }
  };

  beforeEach(() => {
    heroModelMock = {
      getAllHeroes: jest.fn(),
      getHeroById: jest.fn(),
      createHero: jest.fn(),
      toggleItemStatusById: jest.fn(),
      updateHeroById: jest.fn(),
    } as unknown as jest.Mocked<HeroModel>;

    heroController = new HeroController(heroModelMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ✅ getHeroes
  it("debería retornar todos los héroes", async () => {
    heroModelMock.getAllHeroes.mockResolvedValue([mockHero]);

    await heroController.getHeroes({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockHero]);
  });

  // ✅ getHeroById
  it("debería retornar un héroe por id", async () => {
    heroModelMock.getHeroById.mockResolvedValue(mockHero);

    const req = { params: { id: "1" } } as unknown as Request;
    await heroController.getHeroById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHero);
  });

  it("debería retornar 404 si no encuentra el héroe por id", async () => {
    heroModelMock.getHeroById.mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    await heroController.getHeroById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ createHero
  it("debería crear un héroe correctamente", async () => {
    const req = { body: mockHero } as Request;
    heroModelMock.createHero.mockResolvedValue();

    await heroController.createHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Héroe creado con éxito",
      hero: mockHero,
    });
  });

  it("debería retornar 400 si faltan datos en createHero", async () => {
    const req = { body: {} } as Request;
    await heroController.createHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ deleteHero
  it("debería eliminar/desactivar un héroe", async () => {
    heroModelMock.toggleItemStatusById.mockResolvedValue(true);
    const req = { params: { id: "1" } } as unknown as Request;

    await heroController.deleteHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debería retornar 404 si no existe héroe al eliminar", async () => {
    heroModelMock.toggleItemStatusById.mockResolvedValue(false);
    const req = { params: { id: "1" } } as unknown as Request;

    await heroController.deleteHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si ID no es válido al eliminar", async () => {
    const req = { params: { id: "abc" } } as unknown as Request;

    await heroController.deleteHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ updateHero
  it("debería actualizar un héroe correctamente", async () => {
    const updatedHero = { ...mockHero, name: "Guerrero Supremo" };
    heroModelMock.updateHeroById.mockResolvedValue(updatedHero);
    const req = { params: { id: "1" }, body: { name: "Guerrero Supremo" } } as unknown as Request;

    await heroController.updateHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item con id 1 actualizado con éxito",
      updatedHero,
    });
  });

  it("debería retornar 404 si no existe héroe al actualizar", async () => {
    heroModelMock.updateHeroById.mockResolvedValue(null);
    const req = { params: { id: "1" }, body: { name: "Guerrero Supremo" } } as unknown as Request;

    await heroController.updateHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si no se envían campos para actualizar", async () => {
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await heroController.updateHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("debería retornar 400 si ID no es válido al actualizar", async () => {
    const req = { params: { id: "abc" }, body: { name: "Guerrero Supremo" } } as unknown as Request;

    await heroController.updateHero(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
