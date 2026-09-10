import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrypticGame, GameStore } from "@/types/game";

const createInitialGameState = (): CrypticGame => ({
    status: "idle",
    unlockedHints: [],
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
                            [id]: createInitialGameState(),
                        },
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
                            [id]: { ...game, status: "playing" },
                        },
                    };
                }
                return state;
            }),

            unlockHint: (id, index) => set((state) => {
                const game = state.games[id] ?? createInitialGameState();
                if (game.unlockedHints.includes(index)) {
                    return state;
                }
                return {
                    games: {
                        ...state.games,
                        [id]: {
                            ...game,
                            unlockedHints: [...game.unlockedHints, index],
                        },
                    },
                };
            }),

            setWon: (id, answer) => set((state) => ({
                games: {
                    ...state.games,
                    [id]: {
                        ...(state.games[id] ?? createInitialGameState()),
                        status: "won",
                        answer,
                    },
                },
            })),
        }),
        { name: "flas-kriptik-game" }
    )
);