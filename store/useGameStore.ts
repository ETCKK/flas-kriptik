import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameStore, GameStatus } from "@/types/game";

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            crypticId: null,
            status: "playing",
            unlockedHints: [],

            initClue: (id) => set((state) => {
                if (state.crypticId !== id) {
                    return { crypticId: id, status: "playing", unlockedHints: [] };
                }
                return state;
            }),

            unlockHint: (index) => set((state) => ({
                unlockedHints: state.unlockedHints.includes(index)
                    ? state.unlockedHints
                    : [...state.unlockedHints, index],
            })),

            setWon: () => set({ status: "won" }),
        }),
        { name: "flas-kriptik-game" }
    )
);