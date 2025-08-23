export interface ArmorInterface {
  image: string;
  id: number;
  name: string;
  armorType: string;
  heroType: string;
  description: string;
  status: boolean;
  stock: number;
  effects: {
    effectType: string;
    value: number | string;
    durationTurns: number;
  }[];
  dropRate: number;
}
