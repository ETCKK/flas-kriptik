import { describe, expect, it } from "vitest";
import { z } from "zod";
import { cryptics } from "@/data/cryptic";
import type { Cryptic } from "@/types";
import { crypticCollectionSchema, crypticSchema } from "./schema";

const validCryptic: Cryptic = {
    id: "t-001",
    date: "01-01-2027",
    clue: "Kısa bir deneme metni.",
    length: 5,
    author: "Test Yazar",
    answer: "kalem",
    definition: { target: "metni", hint: "Tanım ipucu." },
    indicators: { targets: ["Kısa", "bir"], hint: "Yönerge ipucu." },
    fodder: { targets: ["deneme"], hint: "Malzeme ipucu." },
};

function issuesOf(cryptic: unknown) {
    const result = crypticSchema.safeParse(cryptic);
    expect(result.success).toBe(false);
    return result.error!.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
}

const pathsOf = (cryptic: unknown) => issuesOf(cryptic).map((issue) => issue.path);

function without<K extends keyof Cryptic>(...keys: K[]): Omit<Cryptic, K> {
    const copy: Partial<Cryptic> = { ...validCryptic };
    keys.forEach((key) => delete copy[key]);
    return copy as Omit<Cryptic, K>;
}

describe("puzzle data", () => {
    it("every puzzle in data/cryptic is valid", () => {
        const result = crypticCollectionSchema.safeParse(cryptics);
        if (!result.success) {
            throw new Error(`Geçersiz kriptik verisi:\n${z.prettifyError(result.error)}`);
        }
    });
});

describe("crypticSchema", () => {
    it("accepts a valid puzzle", () => {
        expect(crypticSchema.safeParse(validCryptic).success).toBe(true);
    });

    it("accepts a puzzle with only a definition", () => {
        expect(crypticSchema.safeParse(without("indicators", "fodder")).success).toBe(true);
    });

    it("rejects a length that doesn't match the answer", () => {
        expect(issuesOf({ ...validCryptic, length: 6 })).toEqual([
            { path: "length", message: "Harf sayısı (6) cevabın uzunluğuyla (5) eşleşmiyor." },
        ]);
    });

    it("counts Turkish letters as single characters", () => {
        expect(crypticSchema.safeParse({ ...validCryptic, answer: "ışığı" }).success).toBe(true);
    });

    it.each([
        ["uppercase letters", "Kalem"],
        ["a space", "ka em"],
        ["punctuation", "kale-"],
        ["decomposed characters", "özgür"],
    ])("rejects an answer containing %s", (_, answer) => {
        expect(pathsOf({ ...validCryptic, answer, length: [...answer].length })).toContain("answer");
    });

    it("requires a definition", () => {
        expect(pathsOf(without("definition"))).toContain("definition");
    });

    it("rejects targets that aren't in the clue", () => {
        const issues = issuesOf({
            ...validCryptic,
            definition: { target: "yok", hint: "Tanım ipucu." },
            indicators: { targets: ["Kısa", "uzun"], hint: "Yönerge ipucu." },
            fodder: { targets: ["sınav"], hint: "Malzeme ipucu." },
        });
        expect(issues).toEqual([
            { path: "definition.target", message: "\"yok\" kriptik metninde bulunmuyor." },
            { path: "indicators.targets.1", message: "\"uzun\" kriptik metninde bulunmuyor." },
            { path: "fodder.targets.0", message: "\"sınav\" kriptik metninde bulunmuyor." },
        ]);
    });

    it("rejects an empty word group instead of a missing one", () => {
        expect(pathsOf({ ...validCryptic, indicators: { targets: [], hint: "Yönerge ipucu." } })).toEqual([
            "indicators.targets",
        ]);
    });

    it("requires a hint text for every word group", () => {
        expect(pathsOf({ ...validCryptic, fodder: { targets: ["deneme"], hint: " " } })).toEqual(["fodder.hint"]);
    });

    it("rejects unknown fields such as the old hints array or the misspelled fodders", () => {
        const issues = issuesOf({ ...validCryptic, hints: [], fodders: { targets: ["deneme"], hint: "Malzeme ipucu." } });
        expect(issues).toHaveLength(1);
        expect(issues[0].message).toMatch(/hints.*fodders/);
    });
});

describe("crypticCollectionSchema", () => {
    it("rejects duplicate ids and dates", () => {
        const result = crypticCollectionSchema.safeParse([validCryptic, { ...validCryptic }]);
        expect(result.success).toBe(false);
        expect(result.error!.issues.map((issue) => issue.path.join("."))).toEqual(["1.id", "1.date"]);
    });
});
