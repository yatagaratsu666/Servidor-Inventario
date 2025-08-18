export default interface ItemInterface {
    id?: number;
    image: string;
    heroType: string;
    description: string;
    name: string;
    status: boolean;
    effects: {
        effectType: string;
        value: number;
        durationTurns: number;
    }[];
    dropRate: number;
}
