export default interface ItemInterface {
    id?: number;
    image: string;
    heroType: string;
    description: string;
    name: string;
    status: boolean;
    stock: number;
    effects: {
        effectType: string;
        value: number;
        durationTurns: number;
    }[];
    dropRate: number;
}
