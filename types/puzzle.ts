export default interface Puzzle {
    id: string;
    date: string;
    clue: string;
    length: number;
    hints?: string[];
    difficulty?: "Kolay" | "Orta" | "Zor";
};