import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrypticGame, GameStore } from "@/types/game";
import type { HintType } from "@/types/hint";

const LEGACY_HINT_ORDER: HintType[] = ["definition", "indicators", "fodder"];

type LegacyGame = Omit<CrypticGame, "unlockedHints" | "activeMs"> & {
    unlockedHints: (number | HintType)[];
    activeMs?: number;
};

interface LegacyGameState {
    games?: Record<string, LegacyGame>;
}

function convertHintIndexes(games: Record<string, LegacyGame>): Record<string, LegacyGame> {
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

function estimateActiveMs({ status, startedAt, completedAt }: LegacyGame): number {
    if (status !== "won" || startedAt === undefined || completedAt === undefined) {
        return 0;
    }
    return Math.max(0, completedAt - startedAt);
}

function addTimerAndDailyFlag(games: Record<string, LegacyGame>): Record<string, LegacyGame> {
    return Object.fromEntries(
        Object.entries(games).map(([id, game]) => [
            id,
            {
                ...game,
                activeMs: game.activeMs ?? estimateActiveMs(game),
                ...(game.status === "won" && { solvedAsDaily: game.solvedAsDaily ?? false }),
            },
        ])
    );
}

function migrateGameState(persistedState: unknown, version: number): GameStore {
    const state = persistedState as LegacyGameState;
    if (!state.games) {
        return state as GameStore;
    }

    let games = state.games;
    if (version < 2) {
        games = convertHintIndexes(games);
    }
    if (version < 4) {
        games = addTimerAndDailyFlag(games);
    }

    return { ...state, games } as GameStore;
}

const createInitialGameState = (publishDate?: string): CrypticGame => ({
    status: "idle",
    unlockedHints: [],
    activeMs: 0,
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

            addActiveTime: (id, ms) => set((state) => {
                const game = state.games[id];
                if (game?.status !== "playing" || !Number.isFinite(ms) || ms <= 0) {
                    return state;
                }
                return {
                    games: {
                        ...state.games,
                        [id]: { ...game, activeMs: (game.activeMs ?? 0) + ms }
                    }
                };
            }),

            setWon: (id, solvedAsDaily) => set((state) => {
                const game = state.games[id];
                if (game?.status === "playing") {
                    return {
                        games: {
                            ...state.games,
                            [id]: { ...game, status: "won", completedAt: Date.now(), solvedAsDaily }
                        }
                    };
                }
                return state;
            })
        }),
        {
            name: "flas-kriptik-game",
            version: 4,
            migrate: migrateGameState,
        }
    )
);