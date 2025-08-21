export interface ArmorInterface {
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
