import { Router } from "express";
import UsuarioController from "../controller/UserController";
import { Server as IOServer } from "socket.io";

export default class UserView {
  router: Router;

  constructor(private readonly usuarioController: UsuarioController) {
    this.router = Router();
    this.routes();
  }

  // Método para asignar Socket.IO
  setIO(io: IOServer) {
    this.usuarioController.setIO(io);
  }

  readonly routes = (): void => {
    this.router.get('/usuarios/:id', this.usuarioController.getUsuarioById);
    this.router.post('/usuarios/create', this.usuarioController.createUsuarios);
    this.router.post('/usuarios/:id/inventario/add', this.usuarioController.addProductoToInventario);
    this.router.put('/usuarios/:userId/equipArmor', this.usuarioController.equipArmor);
    this.router.put('/usuarios/:userId/equipItem', this.usuarioController.equipItem);
    this.router.put('/usuarios/:userId/equipWeapon', this.usuarioController.equipWeapon);
    this.router.put('/usuarios/:userId/equipEpic', this.usuarioController.equipEpic);
    this.router.put('/usuarios/:userId/equipHero', this.usuarioController.equipHero);
    this.router.put('/usuarios/:userId/unequipArmor', this.usuarioController.unequipArmor);
    this.router.put('/usuarios/:userId/unequipItem', this.usuarioController.unequipItem);
    this.router.put('/usuarios/:userId/unequipWeapon', this.usuarioController.unequipWeapon);
    this.router.put('/usuarios/:userId/unequipEpic', this.usuarioController.unequipEpic);
    this.router.put('/usuarios/:userId/unequipHero', this.usuarioController.unequipHero);
  };
}
