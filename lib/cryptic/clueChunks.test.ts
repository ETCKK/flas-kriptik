import { describe, expect, it } from "vitest";
import type { Hint, HintType } from "@/types";
import { getClueChunks } from "./clueChunks";

const clue = "Kısa bir deneme metni.";
const hints: Hint[] = [
    { type: "definition", text: "Tanım ipucu.", targets: ["metni"] },
    { type: "indicators", text: "Yönerge ipucu.", targets: ["Kısa", "bir"] },
];

const render = (unlocked: HintType[], source: Hint[] = hints, text = clue) =>
    getClueChunks(text, source, unlocked).map((chunk) => [chunk.text, chunk.type]);

describe("getClueChunks", () => {
    it("returns the whole clue as one plain chunk when no hints are unlocked", () => {
        expect(render([])).toEqual([[clue, null]]);
    });

    it("highlights only the targets of unlocked hints", () => {
        expect(render(["definition"])).toEqual([
            ["Kısa bir deneme ", null],
            ["metni", "definition"],
            [".", null],
        ]);
    });

    it("highlights every target of a hint as separate chunks", () => {
        expect(render(["indicators"])).toEqual([
            ["Kısa", "indicators"],
            [" ", null],
            ["bir", "indicators"],
            [" deneme metni.", null],
        ]);
    });

    it("combines several unlocked hints", () => {
        expect(render(["indicators", "definition"]).filter(([, type]) => type !== null)).toEqual([
            ["Kısa", "indicators"],
            ["bir", "indicators"],
            ["metni", "definition"],
        ]);
    });

    it("ignores unlocked types the puzzle has no hint for", () => {
        expect(render(["fodder"])).toEqual([[clue, null]]);
    });

    it("highlights every occurrence of a target, including inside other words", () => {
        expect(render(["fodder"], [{ type: "fodder", text: "", targets: ["at"] }], "at kat")).toEqual([
            ["at", "fodder"],
            [" k", null],
            ["at", "fodder"],
        ]);
    });

    it("lets a later unlocked hint win where targets overlap", () => {
        const overlapping: Hint[] = [
            { type: "definition", text: "", targets: ["deneme metni"] },
            { type: "fodder", text: "", targets: ["metni"] },
        ];
        expect(render(["definition", "fodder"], overlapping)).toEqual([
            ["Kısa bir ", null],
            ["deneme ", "definition"],
            ["metni", "fodder"],
            [".", null],
        ]);
    });
});
