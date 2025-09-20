import { Router } from "express";
import UsuarioController from "../controller/UserController";

export default class UserView {
  router: Router;

  constructor(private readonly usuarioController: UsuarioController) {
    this.router = Router();
    this.routes();
  }

  readonly routes = (): void => {
    this.router.get('/usuarios/:nombreUsuario', this.usuarioController.getUsuarioById);
    this.router.post('/usuarios/create', this.usuarioController.createUsuarios);
    this.router.post('/usuarios/:nombreUsuario/inventario/add', this.usuarioController.addProductoToInventario);
    this.router.put('/usuarios/:nombreUsuario/equipArmor', this.usuarioController.equipArmor);
    this.router.put('/usuarios/:nombreUsuario/equipItem', this.usuarioController.equipItem);
    this.router.put('/usuarios/:nombreUsuario/equipWeapon', this.usuarioController.equipWeapon);
    this.router.put('/usuarios/:nombreUsuario/equipEpic', this.usuarioController.equipEpic);
    this.router.put('/usuarios/:nombreUsuario/equipHero', this.usuarioController.equipHero);
    this.router.put('/usuarios/:nombreUsuario/unequipArmor', this.usuarioController.unequipArmor);
    this.router.put('/usuarios/:nombreUsuario/unequipItem', this.usuarioController.unequipItem);
    this.router.put('/usuarios/:nombreUsuario/unequipWeapon', this.usuarioController.unequipWeapon);
    this.router.put('/usuarios/:nombreUsuario/unequipEpic', this.usuarioController.unequipEpic);
    this.router.put('/usuarios/:nombreUsuario/unequipHero', this.usuarioController.unequipHero);
    this.router.put('/usuarios/hero/:nombreUsuario/unequipHero', this.usuarioController.unequipHero);
    this.router.get('/usuarios/:nombreUsuario/hero', this.usuarioController.getHeroByUsuarioId);
    this.router.post('/usuarios/rewards', this.usuarioController.applyRewards);
    this.router.patch('/usuarios/:nombreUsuario/creditos', this.usuarioController.incrementarCreditos);
    this.router.patch('/usuarios/transfer-item', this.usuarioController.transferItem);
  };
}
