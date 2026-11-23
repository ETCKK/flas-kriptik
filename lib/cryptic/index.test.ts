import { describe, expect, it, vi } from "vitest";
import type { Cryptic } from "@/types";

vi.mock("server-only", () => ({}));

vi.mock("@/data/cryptic", () => {
    const base = {
        clue: "Kısa bir deneme metni.",
        length: 5,
        author: "Test Yazar",
        answer: "kalem",
        definition: { target: "metni", hint: "Tanım ipucu." },
    };
    const cryptics: Cryptic[] = [
        { ...base, id: "t-001", number: 1, publishDate: "2026-11-22" },
        { ...base, id: "t-002", number: 2, publishDate: "2026-11-23" },
        { ...base, id: "t-draft", number: 3, publishDate: null },
    ];
    return { cryptics, exampleCryptic: cryptics[2] };
});

const { checkAnswer, getPublishedByDate, getPublishedByNumber, isPublished } = await import("./index");

const TODAY = "2026-11-22";
const TOMORROW = "2026-11-23";

describe("getPublishedByDate", () => {
    it("returns today's puzzle", async () => {
        expect((await getPublishedByDate(TODAY, TODAY))?.id).toBe("t-001");
    });

    it("hides a future puzzle until its day", async () => {
        expect(await getPublishedByDate(TOMORROW, TODAY)).toBeNull();
        expect((await getPublishedByDate(TOMORROW, TOMORROW))?.id).toBe("t-002");
    });

    it("returns null for a day without a puzzle", async () => {
        expect(await getPublishedByDate("2026-11-21", TODAY)).toBeNull();
    });
});

describe("getPublishedByNumber", () => {
    it("returns a published puzzle", async () => {
        expect((await getPublishedByNumber(1, TODAY))?.id).toBe("t-001");
    });

    it("hides a future puzzle until its day", async () => {
        expect(await getPublishedByNumber(2, TODAY)).toBeNull();
        expect((await getPublishedByNumber(2, TOMORROW))?.id).toBe("t-002");
    });

    it("never returns a puzzle without a valid date", async () => {
        expect(await getPublishedByNumber(3, "2099-01-01")).toBeNull();
    });

    it("returns null for an unknown number", async () => {
        expect(await getPublishedByNumber(99, TODAY)).toBeNull();
    });
});

describe("isPublished", () => {
    it("compares the puzzle date with today", async () => {
        const cryptic = (await getPublishedByNumber(1, TODAY))!;
        expect(isPublished(cryptic, "2026-11-21")).toBe(false);
        expect(isPublished(cryptic, TODAY)).toBe(true);
        expect(isPublished(cryptic, "2027-01-01")).toBe(true);
    });
});

describe("checkAnswer", () => {
    it("accepts the right answer for a published puzzle", async () => {
        expect(await checkAnswer("t-001", " KALEM ", TODAY)).toBe(true);
        expect(await checkAnswer("t-001", "kalam", TODAY)).toBe(false);
    });

    it("rejects any answer for an unpublished puzzle", async () => {
        expect(await checkAnswer("t-002", "kalem", TODAY)).toBe(false);
        expect(await checkAnswer("t-draft", "kalem", TODAY)).toBe(false);
    });
});
