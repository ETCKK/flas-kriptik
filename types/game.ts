import type { HintType } from "./hint";

interface CrypticGame {
    status: "idle" | "playing" | "won";
    unlockedHints: HintType[];
    publishDate?: string;
    startedAt?: number;
    completedAt?: number;
    activeMs: number;
    solvedAsDaily?: boolean;
}

interface GameStore {
    games: Record<string, CrypticGame>;
    initCryptic: (id: string, publishDate: string) => void;
    startPlaying: (id: string) => void;
    unlockHint: (id: string, type: HintType) => void;
    addActiveTime: (id: string, ms: number) => void;
    setWon: (id: string, solvedAsDaily: boolean) => void;
}

export type { CrypticGame, GameStore };
