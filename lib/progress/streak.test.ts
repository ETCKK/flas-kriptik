import { describe, expect, it } from "vitest";
import type { CrypticGame } from "@/types";
import { computeStreak } from "./streak";

const TODAY = "2026-11-23";

function daily(publishDate: string, overrides: Partial<CrypticGame> = {}): CrypticGame {
    return { status: "won", unlockedHints: [], activeMs: 60_000, publishDate, solvedAsDaily: true, ...overrides };
}

describe("computeStreak", () => {
    it("counts today and yesterday solved as daily", () => {
        expect(computeStreak([daily("2026-11-23"), daily("2026-11-22")], TODAY)).toBe(2);
    });

    it("restarts after a skipped day", () => {
        expect(computeStreak([daily("2026-11-23"), daily("2026-11-21"), daily("2026-11-20")], TODAY)).toBe(1);
    });

    it("doesn't count yesterday's clue solved today", () => {
        const games = [daily("2026-11-23"), daily("2026-11-22", { solvedAsDaily: false })];
        expect(computeStreak(games, TODAY)).toBe(1);
    });

    it("stays alive until today's clue is missed", () => {
        expect(computeStreak([daily("2026-11-22"), daily("2026-11-21")], TODAY)).toBe(2);
    });

    it("is 0 when the last daily solve was two days ago", () => {
        expect(computeStreak([daily("2026-11-21")], TODAY)).toBe(0);
    });

    it("is 0 with no games", () => {
        expect(computeStreak([], TODAY)).toBe(0);
    });

    it("ignores games that aren't daily wins", () => {
        const games: CrypticGame[] = [
            { status: "playing", unlockedHints: [], activeMs: 0, publishDate: "2026-11-23" },
            daily("2026-11-23", { solvedAsDaily: undefined }),
            daily("2026-11-23", { publishDate: undefined }),
        ];
        expect(computeStreak(games, TODAY)).toBe(0);
    });

    it("counts a duplicate date once", () => {
        expect(computeStreak([daily("2026-11-23"), daily("2026-11-23")], TODAY)).toBe(1);
    });

    it("continues across month and year boundaries", () => {
        const games = ["2027-01-02", "2027-01-01", "2026-12-31", "2026-12-30"].map((date) => daily(date));
        expect(computeStreak(games, "2027-01-02")).toBe(4);
        expect(computeStreak([daily("2026-12-01"), daily("2026-11-30")], "2026-12-01")).toBe(2);
    });
});
