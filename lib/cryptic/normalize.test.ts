import { describe, expect, it } from "vitest";
import { normalizeAnswer } from "./normalize";

describe("normalizeAnswer", () => {
    it("trims surrounding whitespace", () => {
        expect(normalizeAnswer("  cevap \n")).toBe("cevap");
    });

    it("lowercases with Turkish rules for I and İ", () => {
        expect(normalizeAnswer("IŞIK")).toBe("ışık");
        expect(normalizeAnswer("İNCİ")).toBe("inci");
    });

    it("keeps Turkish-specific letters intact", () => {
        expect(normalizeAnswer("ÇĞÖŞÜ")).toBe("çğöşü");
    });

    it("treats decomposed and composed characters as equal", () => {
        const decomposed = "o\u0308zgu\u0308r";
        expect(decomposed).not.toBe("özgür");
        expect(normalizeAnswer(decomposed)).toBe("özgür");
    });
});
