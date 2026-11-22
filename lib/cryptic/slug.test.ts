import { describe, expect, it } from "vitest";
import { parseSlug } from "./slug";

describe("parseSlug", () => {
    it("parses a DD-MM-YYYY date into ISO", () => {
        expect(parseSlug("22-11-2026")).toEqual({ kind: "date", date: "2026-11-22" });
    });

    it("rejects a date that doesn't exist", () => {
        expect(parseSlug("31-02-2026")).toBeNull();
    });

    it("parses a positive puzzle number", () => {
        expect(parseSlug("1")).toEqual({ kind: "number", number: 1 });
        expect(parseSlug("125")).toEqual({ kind: "number", number: 125 });
    });

    it("rejects anything else", () => {
        ["0", "01", "-1", "1.5", "e-001", "", "2026-11-22", "99999999999999999999"].forEach((slug) => {
            expect(parseSlug(slug)).toBeNull();
        });
    });
});
