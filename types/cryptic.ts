import type { Hint } from "./hint";

type CrypticDifficulty = "Kolay" | "Orta" | "Zor";

interface PublicCryptic {
    id: string;
    date: string;
    clue: string;
    length: number;
    author: string;
    difficulty?: CrypticDifficulty;
}

interface Cryptic extends PublicCryptic {
    answer: string;
    hints?: Hint[];
    explanation?: string;

    definition?: string;
    indicators?: string[];
    fodders?: string[];
}

export type { Cryptic, PublicCryptic, CrypticDifficulty };