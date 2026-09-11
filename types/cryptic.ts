import type { Hint } from "./hint";

type CrypticDifficulty = "Kolay" | "Orta" | "Zor";

interface Cryptic {
    id: string;
    date: string;
    clue: string;
    length: number;
    author: string;
    difficulty?: CrypticDifficulty;
    answer: string;
    hints?: Hint[];
    explanation?: string;
    definition?: string;
    indicators?: string[];
    fodders?: string[];
}

export type { Cryptic, CrypticDifficulty };