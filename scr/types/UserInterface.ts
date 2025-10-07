import EquipmentInterface from "./EquipementInterface";
import InventarioInterface from "./InventarioInterface";

export enum Roles {
  JUGADOR = "jugador",
  ADMINISTRADOR = "administrador",
}

export interface UserInterface {
  avatar: string;
  nombreUsuario: string;
  rol: Roles;
  creditos: number;
  exp: number;
  inventario: InventarioInterface;
  equipados: EquipmentInterface;
}
