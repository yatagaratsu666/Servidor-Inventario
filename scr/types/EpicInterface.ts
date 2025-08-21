export interface EpicInterface {
  image: string;
  id: number;
  name: string;
  heroType: string;
  description: string;
  status: boolean;
  effects: {
    effectType: string;
    value: number | string;
    durationTurns: number;
  }[];
  cooldown: number;
  isAvailable: boolean;
  masterChance: number;
}
