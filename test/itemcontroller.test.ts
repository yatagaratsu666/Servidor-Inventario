import { Request, Response } from "express";
import ItemController from "../scr/controller/ItemController";
import ItemModel from "../scr/model/ItemModel";
import ItemInterface from "../scr/types/ItemInterface";

describe("ItemController", () => {
  let itemModelMock: jest.Mocked<ItemModel>;
  let itemController: ItemController;
  let res: Partial<Response>;

  const mockItem: ItemInterface = {
    id: 1,
    image: "url/item.png",
    name: "Poción de Vida",
    heroType: "guerrero",
    description: "Restaura 50 puntos de salud",
    status: true,
    stock: 10,
    effects: [
      { effectType: "curación", value: 50, durationTurns: 0 }
    ],
    dropRate: 0.3
  };

  beforeEach(() => {
    itemModelMock = {
      getAllItems: jest.fn(),
      getItemById: jest.fn(),
      createItem: jest.fn(),
      toggleItemStatusById: jest.fn(),
      updateItemById: jest.fn(),
    } as unknown as jest.Mocked<ItemModel>;

    itemController = new ItemController(itemModelMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ✅ getItems
  it("debería retornar todos los items", async () => {
    itemModelMock.getAllItems.mockResolvedValue([mockItem]);

    await itemController.getItems({} as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockItem]);
  });

  // ✅ getItemById
  it("debería retornar un item por id", async () => {
    itemModelMock.getItemById.mockResolvedValue(mockItem);

    const req = { params: { id: "1" } } as unknown as Request;
    await itemController.getItemById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockItem);
  });

  it("debería retornar 404 si no encuentra el item por id", async () => {
    itemModelMock.getItemById.mockResolvedValue(null);

    const req = { params: { id: "1" } } as unknown as Request;
    await itemController.getItemById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ✅ createItem
  it("debería crear un item correctamente", async () => {
    const req = { body: mockItem } as Request;
    itemModelMock.createItem.mockResolvedValue();

    await itemController.createItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Héroe creado con éxito",
      hero: mockItem,
    });
  });

  it("debería retornar 400 si faltan datos en createItem", async () => {
    const req = { body: {} } as Request;
    await itemController.createItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ deleteItem
  it("debería eliminar/desactivar un item", async () => {
    itemModelMock.toggleItemStatusById.mockResolvedValue(true);
    const req = { params: { id: "1" } } as unknown as Request;

    await itemController.deleteItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debería retornar 404 si no existe item al eliminar", async () => {
    itemModelMock.toggleItemStatusById.mockResolvedValue(false);
    const req = { params: { id: "1" } } as unknown as Request;

    await itemController.deleteItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si ID no es válido al eliminar", async () => {
    const req = { params: { id: "abc" } } as unknown as Request;

    await itemController.deleteItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✅ updateItem
  it("debería actualizar un item correctamente", async () => {
    const updatedItem = { ...mockItem, name: "Poción Máxima" };
    itemModelMock.updateItemById.mockResolvedValue(updatedItem);
    const req = { params: { id: "1" }, body: { name: "Poción Máxima" } } as unknown as Request;

    await itemController.updateItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item con id 1 actualizado con éxito",
      updatedItem,
    });
  });

  it("debería retornar 404 si no existe item al actualizar", async () => {
    itemModelMock.updateItemById.mockResolvedValue(null);
    const req = { params: { id: "1" }, body: { name: "Poción Máxima" } } as unknown as Request;

    await itemController.updateItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("debería retornar 400 si no se envían campos para actualizar", async () => {
    const req = { params: { id: "1" }, body: {} } as unknown as Request;

    await itemController.updateItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("debería retornar 400 si ID no es válido al actualizar", async () => {
    const req = { params: { id: "abc" }, body: { name: "Poción Máxima" } } as unknown as Request;

    await itemController.updateItem(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
