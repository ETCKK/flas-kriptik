import { describe, expect, it } from "vitest";
import { buildShareText } from "./share";

describe("buildShareText", () => {
    it("uses the puzzle number and the publish date", () => {
        expect(buildShareText({ number: 12, publishDate: "2026-11-23" }, { time: "01:05", hintCount: 1, totalHints: 3 }))
            .toBe("Flaş Kriptik #12 | ⏱️ 01:05 | 🕵️ 1/3 | 23/11/2026");
    });

    it("doesn't pad the number", () => {
        expect(buildShareText({ number: 1, publishDate: "2027-01-01" }, { time: "00:42", hintCount: 0, totalHints: 2 }))
            .toBe("Flaş Kriptik #1 | ⏱️ 00:42 | 🕵️ 0/2 | 01/01/2027");
    });
});
