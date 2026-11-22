import { useMemo } from "react";
import type { Cryptic, HintType } from "@/types";
import { getClueChunks } from "@/lib/cryptic/clueChunks";
import { HINT_DECORATIONS, getHints } from "@/lib/cryptic/hints";

interface ClueProps {
    cryptic: Cryptic;
    unlockedHints: HintType[];
}

export default function Clue({ cryptic, unlockedHints }: ClueProps) {
    const chunks = useMemo(
        () => getClueChunks(cryptic.clue, getHints(cryptic), unlockedHints),
        [cryptic, unlockedHints]
    );

    return (
        <h1 className="mt-2 text-center text-xl font-black leading-relaxed tracking-wide sm:text-3xl">
            &quot;
            {chunks.map((chunk, index) => {
                if (!chunk.type) {
                    return <span key={index}>{chunk.text}</span>;
                }

                return (
                    <span
                        key={index}
                        className={`relative inline pen-underline ${HINT_DECORATIONS[chunk.type]}`}
                    >
                        {chunk.text}
                    </span>
                );
            })}
            &quot;
        </h1>
    );
}