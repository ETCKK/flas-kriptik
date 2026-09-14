import { useMemo } from "react";
import type { Cryptic } from "@/types";

interface ClueProps {
    cryptic: Cryptic;
    unlockedHints: number[];
}

export default function Clue({ cryptic, unlockedHints }: ClueProps) {
    const chunks = useMemo(() => {
        const { clue, hints } = cryptic;
        const charMap = new Array(clue.length).fill(null);

        unlockedHints.forEach((hintIdx) => {
            const hint = hints[hintIdx];
            if (!hint?.targets) return;

            hint.targets.forEach((target) => {
                let startIndex = 0;
                while ((startIndex = clue.indexOf(target, startIndex)) > -1) {
                    for (let i = 0; i < target.length; i++) {
                        charMap[startIndex + i] = { type: hint.type, id: hintIdx };
                    }
                    startIndex += target.length;
                }
            });
        });

        const result = [];
        let currentChunk = { text: "", hint: charMap[0] };

        for (let i = 0; i < clue.length; i++) {
            const charHint = charMap[i];

            if (charHint?.id !== currentChunk.hint?.id) {
                if (currentChunk.text) result.push(currentChunk);
                currentChunk = { text: clue[i], hint: charHint };
            } else {
                currentChunk.text += clue[i];
            }
        }
        if (currentChunk.text) result.push(currentChunk);

        return result;
    }, [cryptic, unlockedHints]);

    const getDecorationStyle = (type: string) => {
        const normalizedType = type.toLocaleLowerCase("tr-TR").trim();

        switch (normalizedType) {
            case "yönerge":
                return "decoration-wavy";
            case "malzeme":
                return "decoration-dashed";
            case "tanım":
            default:
                return "decoration-solid";
        }
    };

    return (
        <h1 className="mt-2 text-center text-xl font-black leading-relaxed tracking-wide sm:text-3xl">
            &quot;
            {chunks.map((chunk, index) => {
                const isTargeted = chunk.hint !== null;

                if (!isTargeted) {
                    return <span key={index}>{chunk.text}</span>;
                }

                return (
                    <span
                        key={index}
                        className={`relative inline pen-underline ${getDecorationStyle(chunk.hint.type)}`}
                    >
                        {chunk.text}
                    </span>
                );
            })}
            &quot;
        </h1>
    );
}