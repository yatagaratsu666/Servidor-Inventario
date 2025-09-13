import { ArmorInterface } from "./ArmorInterface";
import { EpicInterface } from "./EpicInterface";
import HeroInterface from "./HeroInterface";
import ItemInterface from "./ItemInterface";
import { WeaponInterface } from "./WeaponInterface";

export default interface EquipmentInterface {
  weapons: WeaponInterface[];
  armors: ArmorInterface[];
  items: ItemInterface[];
  epicAbility: EpicInterface[];
  hero: HeroInterface[];
}