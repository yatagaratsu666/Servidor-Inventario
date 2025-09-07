import { Request, Response } from "express";
import ArmorController from "../scr/controller/ArmorController";
import { ArmorInterface } from "../scr/types/ArmorInterface";
import ArmorModel from "../scr/model/ArmorModel";

describe("ArmorController", () => {
  let armorModelMock: jest.Mocked<ArmorModel>;
  let armorController: ArmorController;
  let res: Partial<Response>;

  const mockArmor: ArmorInterface = {
    id: 1,
    image: "url/image.png",
    name: "Armadura del Dragón",
    armorType: "pesada",
    heroType: "guerrero",
    description: "Proporciona alta defensa y resistencia al fuego",
    status: true,
    stock: 5,
    effects: [
      { effectType: "defensa", value: 20, durationTurns: 0 }
    ],
    dropRate: 0.15
  };

  beforeEach(() => {
    armorModelMock = {
      getAllArmors: jest.fn(),
      getArmorById: jest.fn(),
      createArmor: jest.fn(),
      toggleArmorStatusById: jest.fn(),
      updateArmorById: jest.fn(),
    } as unknown as jest.Mocked<ArmorModel>;

    armorController = new ArmorController(armorModelMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ✅ getArmor
  it("debería retornar todas las armaduras", async () => {
    armorModelMock.getAllArmors.mockResolvedValue([mockArmor]);

    await armorController.getArmor({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockArmor]);
  });

  // ✅ getArmorById
  it("debería retornar una armadura por id", async () => {
    armorModelMock.getArmorById.mockResolvedValue(mockArmor);

    const req = { params: { id: "1" } } as unknown as Request;
    await armorController.getArmorById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockArmor);
  });

  it("debería retornar 404 si no encuentra la armadura por id", async () => {
    armorModelMock.getArmorById.mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    await armorController.getArmorById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ createArmor
  it("debería crear una armadura correctamente", async () => {
    const req = { body: mockArmor } as Request;
    armorModelMock.createArmor.mockResolvedValue();

    await armorController.createArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Armadura creada con éxito",
      armor: mockArmor,
    });
  });

  it("debería retornar 400 si faltan datos en createArmor", async () => {
    const req = { body: {} } as Request;
    await armorController.createArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ deleteArmor
  it("debería eliminar/desactivar una armadura", async () => {
    armorModelMock.toggleArmorStatusById.mockResolvedValue(true);
    const req = { params: { id: "1" } } as unknown as Request;

    await armorController.deleteArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debería retornar 404 si no existe armadura al eliminar", async () => {
    armorModelMock.toggleArmorStatusById.mockResolvedValue(false);
    const req = { params: { id: "1" } } as unknown as Request;

    await armorController.deleteArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ updateArmor
  it("debería actualizar una armadura correctamente", async () => {
    const updatedArmor = { ...mockArmor, name: "Nueva Armadura" };
    armorModelMock.updateArmorById.mockResolvedValue(updatedArmor);
    const req = { params: { id: "1" }, body: { name: "Nueva Armadura" } } as unknown as Request;

    await armorController.updateArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "armadura con id 1 actualizado con éxito",
      updatedArmor,
    });
  });

  it("debería retornar 404 si no existe armadura al actualizar", async () => {
    armorModelMock.updateArmorById.mockResolvedValue(null);
    const req = { params: { id: "1" }, body: { name: "Nueva Armadura" } } as unknown as Request;

    await armorController.updateArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si no se envían campos para actualizar", async () => {
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await armorController.updateArmor(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});