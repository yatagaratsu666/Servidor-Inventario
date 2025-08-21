export interface EpicInterface {
  image: string;
  id: number;
  name: string;
  HeroType: string;
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
