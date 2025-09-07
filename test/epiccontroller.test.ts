import { Request, Response } from "express";
import EpicController from "../scr/controller/EpicController";
import EpicModel from "../scr/model/EpicModel";
import { EpicInterface } from "../scr/types/EpicInterface";

describe("EpicController", () => {
  let epicModelMock: jest.Mocked<EpicModel>;
  let epicController: EpicController;
  let res: Partial<Response>;

  const mockEpic: EpicInterface = {
    id: 1,
    image: "url/epic.png",
    name: "Espada Épica",
    heroType: "guerrero",
    description: "Aumenta el ataque del héroe en 20 puntos",
    status: true,
    stock: 5,
    effects: [{ effectType: "daño", value: 10, durationTurns: 0 }],
    cooldown: 2,
    isAvailable: true,
    masterChance: 0.1
  };

  beforeEach(() => {
    epicModelMock = {
      getAllEpics: jest.fn(),
      getEpicById: jest.fn(),
      createEpic: jest.fn(),
      toggleEpicStatusById: jest.fn(),
      updateEpicById: jest.fn(),
    } as unknown as jest.Mocked<EpicModel>;

    epicController = new EpicController(epicModelMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ✅ getEpics
  it("debería retornar todas las épicas", async () => {
    epicModelMock.getAllEpics.mockResolvedValue([mockEpic]);

    await epicController.getEpics({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockEpic]);
  });

  // ✅ getEpicById
  it("debería retornar una épica por id", async () => {
    epicModelMock.getEpicById.mockResolvedValue(mockEpic);

    const req = { params: { id: "1" } } as unknown as Request;
    await epicController.getEpicById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEpic);
  });

  it("debería retornar 404 si no encuentra la épica por id", async () => {
    epicModelMock.getEpicById.mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    await epicController.getEpicById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ createEpic
  it("debería crear una épica correctamente", async () => {
    const req = { body: mockEpic } as Request;
    epicModelMock.createEpic.mockResolvedValue();

    await epicController.createEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Epica creada con éxito",
      epic: mockEpic,
    });
  });

  it("debería retornar 400 si faltan datos en createEpic", async () => {
    const req = { body: {} } as Request;
    await epicController.createEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ deleteEpic
  it("debería eliminar/desactivar una épica", async () => {
    epicModelMock.toggleEpicStatusById.mockResolvedValue(true);
    const req = { params: { id: "1" } } as unknown as Request;

    await epicController.deleteEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debería retornar 404 si no existe épica al eliminar", async () => {
    epicModelMock.toggleEpicStatusById.mockResolvedValue(false);
    const req = { params: { id: "1" } } as unknown as Request;

    await epicController.deleteEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si ID no es válido al eliminar", async () => {
    const req = { params: { id: "abc" } } as unknown as Request;

    await epicController.deleteEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ updateEpic
  it("debería actualizar una épica correctamente", async () => {
    const updatedEpic = { ...mockEpic, name: "Espada Épica Mejorada" };
    epicModelMock.updateEpicById.mockResolvedValue(updatedEpic);
    const req = { params: { id: "1" }, body: { name: "Espada Épica Mejorada" } } as unknown as Request;

    await epicController.updateEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Epica con id 1 actualizado con éxito",
      updatedEpic,
    });
  });

  it("debería retornar 404 si no existe épica al actualizar", async () => {
    epicModelMock.updateEpicById.mockResolvedValue(null);
    const req = { params: { id: "1" }, body: { name: "Espada Épica Mejorada" } } as unknown as Request;

    await epicController.updateEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si no se envían campos para actualizar", async () => {
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await epicController.updateEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("debería retornar 400 si ID no es válido al actualizar", async () => {
    const req = { params: { id: "abc" }, body: { name: "Espada Épica Mejorada" } } as unknown as Request;

    await epicController.updateEpic(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
