import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrypticGame, GameStore } from "@/types/game";

const createInitialGameState = (): CrypticGame => ({
    status: "playing",
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

            setWon: (id) => set((state) => ({
                games: {
                    ...state.games,
                    [id]: {
                        ...(state.games[id] ?? createInitialGameState()),
                        status: "won",
                    },
                },
            })),
        }),
        { name: "flas-kriptik-game" }
    )
);