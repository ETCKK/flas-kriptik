import type { Hint } from "./hint";

type PuzzleDifficulty = "Kolay" | "Orta" | "Zor";

interface Puzzle {
    id: string;
    date: string;
    clue: string;
    length: number;
    hints?: Hint[];
    difficulty?: PuzzleDifficulty;
}

export type { Puzzle, PuzzleDifficulty };