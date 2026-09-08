import type { Hint } from "./hint";

type ClueDifficulty = "Kolay" | "Orta" | "Zor";

interface PublicClue {
    id: string;
    date: string;
    clue: string;
    length: number;
    author: string;
    difficulty?: ClueDifficulty;
}

interface Clue extends PublicClue {
    answer: string;
    hints?: Hint[];
    explanation?: string;

    definition?: string;
    indicators?: string[];
    fodders?: string[];
}

export type { Clue, PublicClue, ClueDifficulty };