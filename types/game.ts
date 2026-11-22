import type { HintType } from "./hint";

interface CrypticGame {
    status: "idle" | "playing" | "won";
    unlockedHints: HintType[];
    startedAt?: number;
    completedAt?: number;
}

interface GameStore {
    games: Record<string, CrypticGame>;
    initCryptic: (id: string) => void;
    startPlaying: (id: string) => void;
    unlockHint: (id: string, type: HintType) => void;
    setWon: (id: string) => void;
}

export type { CrypticGame, GameStore };
