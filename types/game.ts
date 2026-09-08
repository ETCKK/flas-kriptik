type GameStatus = "playing" | "won";

interface GameStore {
    crypticId: string | null;
    status: GameStatus;
    unlockedHints: number[];
    
    initClue: (id: string) => void;
    unlockHint: (index: number) => void;
    setWon: () => void;
}

export type { GameStore, GameStatus };