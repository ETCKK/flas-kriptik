import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrypticGame, GameStore } from "@/types/game";
import type { HintType } from "@/types/hint";

const LEGACY_HINT_ORDER: HintType[] = ["definition", "indicators", "fodder"];

interface LegacyGameState {
    games?: Record<string, Omit<CrypticGame, "unlockedHints"> & { unlockedHints: (number | HintType)[] }>;
}

function migrateGameState(persistedState: unknown, version: number): GameStore {
    const state = persistedState as LegacyGameState;
    if (version >= 2 || !state.games) {
        return state as GameStore;
    }

    const games = Object.fromEntries(
        Object.entries(state.games).map(([id, game]) => [
            id,
            {
                ...game,
                unlockedHints: game.unlockedHints
                    .map((hint) => (typeof hint === "number" ? LEGACY_HINT_ORDER[hint] : hint))
                    .filter((hint): hint is HintType => hint !== undefined),
            },
        ])
    );

    return { ...state, games } as GameStore;
}

const createInitialGameState = (): CrypticGame => ({
    status: "idle",
    unlockedHints: []
});

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            games: {},

            initCryptic: (id) => set((state) => {
                if (!state.games[id]) {
                    return {
                        games: {
                            ...state.games,
                            [id]: createInitialGameState()
                        }
                    };
                }
                return state;
            }),

            startPlaying: (id) => set((state) => {
                const game = state.games[id];
                if (game?.status === "idle") {
                    return {
                        games: {
                            ...state.games,
                            [id]: { ...game, status: "playing", startedAt: Date.now() }
                        }
                    };
                }
                return state;
            }),

            unlockHint: (id, type) => set((state) => {
                const game = state.games[id] ?? createInitialGameState();
                if (game.unlockedHints.includes(type)) {
                    return state;
                }
                return {
                    games: {
                        ...state.games,
                        [id]: {
                            ...game,
                            unlockedHints: [...game.unlockedHints, type]
                        }
                    }
                };
            }),

            setWon: (id) => set((state) => {
                const game = state.games[id];
                if (game?.status === "playing") {
                    return {
                        games: {
                            ...state.games,
                            [id]: { ...game, status: "won", completedAt: Date.now() }
                        }
                    };
                }
                return state;
            })
        }),
        {
            name: "flas-kriptik-game",
            version: 2,
            migrate: migrateGameState,
        }
    )
);