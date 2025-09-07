import { Request, Response } from "express";
import WeaponController from "../scr/controller/WeaponController";
import { WeaponInterface } from "../scr/types/WeaponInterface";
import WeaponModel from "../scr/model/WeaponModel";



describe("WeaponController", () => {
  let weaponModelMock: jest.Mocked<WeaponModel>;
  let weaponController: WeaponController;
  let res: Partial<Response>;

  const mockWeapon: WeaponInterface = {
    id: 1,
    image: "url/weapon.png",
    name: "Espada del Destino",
    heroType: "guerrero",
    description: "Inflige daño crítico a enemigos",
    status: true,
    stock: 10,
    effects: [
      { effectType: "daño", value: 25, durationTurns: 0 }
    ],
    dropRate: 0.2
  };

  beforeEach(() => {
    weaponModelMock = {
      getAllWeapons: jest.fn(),
      getWeaponById: jest.fn(),
      createWeapon: jest.fn(),
      toggleWeaponStatusById: jest.fn(),
      updateWeaponById: jest.fn(),
    } as unknown as jest.Mocked<WeaponModel>;

    weaponController = new WeaponController(weaponModelMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ✅ getWeapons
  it("debería retornar todas las armas", async () => {
    weaponModelMock.getAllWeapons.mockResolvedValue([mockWeapon]);

    await weaponController.getWeapons({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockWeapon]);
  });

  // ✅ getWeaponById
  it("debería retornar un arma por id", async () => {
    weaponModelMock.getWeaponById.mockResolvedValue(mockWeapon);

    const req = { params: { id: "1" } } as unknown as Request;
    await weaponController.getWeaponById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockWeapon);
  });

  it("debería retornar 404 si no encuentra el arma por id", async () => {
    weaponModelMock.getWeaponById.mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    await weaponController.getWeaponById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ createWeapon
  it("debería crear un arma correctamente", async () => {
    const req = { body: mockWeapon } as Request;
    weaponModelMock.createWeapon.mockResolvedValue();

    await weaponController.createWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Arma creada con éxito",
      weapon: mockWeapon,
    });
  });

  it("debería retornar 400 si faltan datos en createWeapon", async () => {
    const req = { body: {} } as Request;
    await weaponController.createWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ deleteWeapon
  it("debería eliminar/desactivar un arma", async () => {
    weaponModelMock.toggleWeaponStatusById.mockResolvedValue(true);
    const req = { params: { id: "1" } } as unknown as Request;

    await weaponController.deleteWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debería retornar 404 si no existe arma al eliminar", async () => {
    weaponModelMock.toggleWeaponStatusById.mockResolvedValue(false);
    const req = { params: { id: "1" } } as unknown as Request;

    await weaponController.deleteWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si ID no es válido al eliminar", async () => {
    const req = { params: { id: "abc" } } as unknown as Request;

    await weaponController.deleteWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ updateWeapon
  it("debería actualizar un arma correctamente", async () => {
    const updatedWeapon = { ...mockWeapon, name: "Nueva Espada" };
    weaponModelMock.updateWeaponById.mockResolvedValue(updatedWeapon);
    const req = { params: { id: "1" }, body: { name: "Nueva Espada" } } as unknown as Request;

    await weaponController.updateWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Arma con id 1 actualizada con éxito",
      updatedWeapon,
    });
  });

  it("debería retornar 404 si no existe arma al actualizar", async () => {
    weaponModelMock.updateWeaponById.mockResolvedValue(null);
    const req = { params: { id: "1" }, body: { name: "Nueva Espada" } } as unknown as Request;

    await weaponController.updateWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si no se envían campos para actualizar", async () => {
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await weaponController.updateWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("debería retornar 400 si ID no es válido al actualizar", async () => {
    const req = { params: { id: "abc" }, body: { name: "Nueva Espada" } } as unknown as Request;

    await weaponController.updateWeapon(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
