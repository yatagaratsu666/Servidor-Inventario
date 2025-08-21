export interface WeaponInterface {
  image: string;
  id: number;
  name: string;
  description: string;
  status: boolean;
  effects: {
    effectType: string;
    value: number | string;
    durationTurns: number;
  }[];
  dropRate: number;
}