type GameStatus = "playing" | "won";

interface CrypticGame {
    status: GameStatus;
    unlockedHints: number[];
}

interface GameStore {
    games: Record<string, CrypticGame>;
    
    initCryptic: (id: string) => void;
    unlockHint: (id: string, index: number) => void;
    setWon: (id: string) => void;
}

export type { CrypticGame, GameStore, GameStatus };