import type { Hint, HintType } from "@/types";

interface ClueChunk {
    text: string;
    type: HintType | null;
}

export function getClueChunks(clue: string, hints: Hint[], unlockedHints: HintType[]): ClueChunk[] {
    const charMap: (HintType | null)[] = new Array(clue.length).fill(null);

    unlockedHints.forEach((type) => {
        const hint = hints.find((candidate) => candidate.type === type);
        if (!hint) return;

        hint.targets.forEach((target) => {
            let startIndex = 0;
            while ((startIndex = clue.indexOf(target, startIndex)) > -1) {
                for (let i = 0; i < target.length; i++) {
                    charMap[startIndex + i] = type;
                }
                startIndex += target.length;
            }
        });
    });

    const result: ClueChunk[] = [];
    let currentChunk: ClueChunk = { text: "", type: charMap[0] };

    for (let i = 0; i < clue.length; i++) {
        const charType = charMap[i];

        if (charType !== currentChunk.type) {
            if (currentChunk.text) result.push(currentChunk);
            currentChunk = { text: clue[i], type: charType };
        } else {
            currentChunk.text += clue[i];
        }
    }
    if (currentChunk.text) result.push(currentChunk);

    return result;
}

export type { ClueChunk };
