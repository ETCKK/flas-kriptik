import { describe, expect, it } from "vitest";
import { getHints } from "./hints";

const definition = { target: "metni", hint: "Tanım ipucu." };

describe("getHints", () => {
    it("always includes the definition hint", () => {
        expect(getHints({ definition })).toEqual([
            { type: "definition", text: "Tanım ipucu.", targets: ["metni"] },
        ]);
    });

    it("adds one hint per word type that has words, in a fixed order", () => {
        const hints = getHints({
            definition,
            fodder: { targets: ["deneme"], hint: "Malzeme ipucu." },
            indicators: { targets: ["Kısa", "bir"], hint: "Yönerge ipucu." },
        });
        expect(hints).toEqual([
            { type: "definition", text: "Tanım ipucu.", targets: ["metni"] },
            { type: "indicators", text: "Yönerge ipucu.", targets: ["Kısa", "bir"] },
            { type: "fodder", text: "Malzeme ipucu.", targets: ["deneme"] },
        ]);
    });

    it("gives several indicators a single shared hint", () => {
        const hints = getHints({ definition, indicators: { targets: ["a", "b", "c"], hint: "Üçü için tek ipucu." } });
        expect(hints.filter((hint) => hint.type === "indicators")).toHaveLength(1);
    });

    it("leaves out word types without words", () => {
        expect(getHints({ definition, indicators: undefined, fodder: undefined }).map((hint) => hint.type)).toEqual([
            "definition",
        ]);
    });
});
