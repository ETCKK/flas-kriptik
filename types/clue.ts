import type { Hint } from "./hint";

type ClueDifficulty = "Kolay" | "Orta" | "Zor";

interface Clue {
    id: string;
    date: string;
    clue: string;
    length: number;
    hints?: Hint[];
    difficulty?: ClueDifficulty;
}

export type { Clue, ClueDifficulty };