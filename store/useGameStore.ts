import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrypticGame, GameStore } from "@/types/game";
import type { HintType } from "@/types/hint";

const LEGACY_HINT_ORDER: HintType[] = ["definition", "indicators", "fodder"];

interface LegacyGameState {
    games?: Record<string, Omit<CrypticGame, "unlockedHints"> & { unlockedHints: (number | HintType)[] }>;
}

function convertHintIndexes(games: NonNullable<LegacyGameState["games"]>): Record<string, CrypticGame> {
    return Object.fromEntries(
        Object.entries(games).map(([id, game]) => [
            id,
            {
                ...game,
                unlockedHints: game.unlockedHints
                    .map((hint) => (typeof hint === "number" ? LEGACY_HINT_ORDER[hint] : hint))
                    .filter((hint): hint is HintType => hint !== undefined),
            },
        ])
    );
}

function migrateGameState(persistedState: unknown, version: number): GameStore {
    const state = persistedState as LegacyGameState;
    if (!state.games) {
        return state as GameStore;
    }

    const games = version < 2 ? convertHintIndexes(state.games) : state.games;

    return { ...state, games } as GameStore;
}

const createInitialGameState = (publishDate?: string): CrypticGame => ({
    status: "idle",
    unlockedHints: [],
    ...(publishDate && { publishDate }),
});

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            games: {},

            initCryptic: (id, publishDate) => set((state) => {
                const game = state.games[id];
                if (!game) {
                    return {
                        games: {
                            ...state.games,
                            [id]: createInitialGameState(publishDate)
                        }
                    };
                }
                if (game.publishDate !== publishDate) {
                    return {
                        games: {
                            ...state.games,
                            [id]: { ...game, publishDate }
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
            version: 3,
            migrate: migrateGameState,
        }
    )
);