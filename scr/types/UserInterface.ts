import EquipmentInterface from "./EquipementInterface";
import InventarioInterface from "./InventarioInterface";

export enum Roles {
  JUGADOR = "jugador",
  ADMINISTRADOR = "administrador",
}

export interface UserInterface {
  nombreUsuario: string;
  rol: Roles;
  creditos: number;
  inventario: InventarioInterface;
  equipados: EquipmentInterface;
}
