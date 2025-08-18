export default interface HeroInterface {
    image: string;
    id?: number;
    name: string;
    heroType: string;
    description: string;
    level: number;
    power: number;
    health: number;
    defense: number;
    status: boolean;
    attack: number;
    attackBoost: {
        min: number;
        max: number;
    };
    damage: {
        min: number;
        max: number;
    };
    specialActions: {
        name: string;
        actionType: string;
        powerCost: number;
        effect: {
            effectType: string;
            value: number | string;
            durationTurns: number;
        };
        cooldown: number;
        isAvailable: boolean;
    }[];
}
