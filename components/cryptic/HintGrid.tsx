import type { Hint } from "@/types";
import HintBox from "./HintBox";

interface HintGridProps {
    hints: Hint[];
    unlockedHints: number[];
}

export default function HintGrid({ hints, unlockedHints }: HintGridProps) {
    if (unlockedHints.length === 0) {
        return (
            <p className="py-8 text-center font-typewriter text-sm font-bold tracking-widest text-muted opacity-60">
                HENÜZ İSTİHBARAT ALINMADI
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3 font-typewriter">
            {hints.map((hint, index) => {
                if (!unlockedHints.includes(index)) return null;
                return <HintBox key={`${hint.type}-${index}`} hint={hint} index={index} />;
            })}
        </div>
    );
}