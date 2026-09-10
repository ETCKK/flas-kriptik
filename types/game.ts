interface CrypticGame {
    status: "idle" | "playing" | "won";
    unlockedHints: number[];
    answer?: string;
}

interface GameStore {
    games: Record<string, CrypticGame>;
    initCryptic: (id: string) => void;
    startPlaying: (id: string) => void;
    unlockHint: (id: string, index: number) => void;
    setWon: (id: string, answer: string) => void;
}

export type { CrypticGame, GameStore };