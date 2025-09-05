import { Request, Response } from "express";
import ArmorController from "../scr/controller/ArmorController";
import { ArmorInterface } from "../scr/types/ArmorInterface";

// Mock del modelo
const mockArmorModel = {
  getAllArmors: jest.fn(),
  getArmorById: jest.fn(),
  createArmor: jest.fn(),
  toggleArmorStatusById: jest.fn(),
  updateArmorById: jest.fn(),
};

describe("ArmorController - getArmor", () => {
  let controller: ArmorController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new ArmorController(mockArmorModel as any);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("debe retornar todas las armaduras con status 200", async () => {
    const armors: ArmorInterface[] = [
      {
        id: 1,
        name: "Armadura de Hierro",
        armorType: "Ligera",
        heroType: "Guerrero",
        description: "Una armadura básica de hierro.",
        image: "iron.png",
        status: true,
        stock: 10,
        effects: [{ effectType: "defensa", value: 10, durationTurns: 0 }],
        dropRate: 0.2,
      },
      {
        id: 2,
        name: "Armadura de Fuego",
        armorType: "Pesada",
        heroType: "Mago",
        description: "Protege contra ataques de fuego.",
        image: "fire.png",
        status: true,
        stock: 3,
        effects: [{ effectType: "resistencia", value: "fuego", durationTurns: 5 }],
        dropRate: 0.1,
      },
    ];

    mockArmorModel.getAllArmors.mockResolvedValue(armors);

    await controller.getArmor({} as Request, mockResponse as Response);

    expect(mockArmorModel.getAllArmors).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(armors);
  });

  it("debe retornar 500 si ocurre un error", async () => {
    mockArmorModel.getAllArmors.mockRejectedValue(new Error("DB error"));

    await controller.getArmor({} as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error al obtener armaduras" })
    );
  });
});
