"use client";

import type { Cryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import Button from "@/components/ui/Button";
import type { CrypticPhase } from "../hooks/useCrypticPhase";
import Clue from "../Clue";
import AnswerGrid from "../AnswerGrid";

interface CluePageProps {
    cryptic: Cryptic;
    phase: CrypticPhase;
    letters: string[];
    cursorIndex: number;
    setCursorIndex: (i: number) => void;
    canSubmit: boolean;
    canOpenHintMenu: boolean;
    isWon: boolean;
    hasAnswerError: boolean;
    handleSubmit: () => void;
    handleHint: () => void;
}

export default function CluePage({
    cryptic, phase, letters, cursorIndex, setCursorIndex,
    canSubmit, canOpenHintMenu, isWon, hasAnswerError, handleSubmit,
    handleHint
}: CluePageProps) {

    const { games } = useGameStore();
    const game = games[cryptic.id];
    const unlockedHints = game?.unlockedHints ?? [];

    return (
        <div className="font-typewriter relative flex h-full flex-col">
            {isWon && (
                <div className="absolute inset-0 z-30 flex pointer-events-none items-center justify-center">
                    <div className="animate-[stampHit_0.4s_ease-out_forwards] rounded-sm border-[6px] border-stamp px-8 py-3 text-5xl sm:text-7xl font-black tracking-widest text-stamp rotate-[-15deg] bg-paper/10">
                        ÇÖZÜLDÜ
                    </div>
                </div>
            )}

            <div className="mb-2 text-sm leading-relaxed opacity-90 sm:text-base">
                <p className="mt-2">
                    Teşkilat verilen kriptiği çözmeni istiyor. Şifreyi bul ve merkeze ilet.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto py-1 sm:py-3">
                <div className="mb-6 sm:mb-8 text-center">
                    <Clue cryptic={cryptic} unlockedHints={unlockedHints} />
                </div>

                <div className="relative z-20 mb-5">
                    <AnswerGrid letters={letters} cursorIndex={isWon ? -1 : cursorIndex} onSelect={setCursorIndex} hasError={hasAnswerError} />
                </div>
            </div>

            {(phase === "playing" || phase === "extracting") && (
                <div className={`relative z-20 mt-auto flex shrink-0 justify-center gap-3 pt-3 transition-opacity duration-500 sm:gap-4 ${isWon ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    <Button type="button" variant="paperSecondary" onClick={handleHint} disabled={!canOpenHintMenu}>
                        İstihbarat
                    </Button>
                    <Button type="button" variant="paper" onClick={handleSubmit} disabled={!canSubmit}>
                        Deşifre Et
                    </Button>
                </div>
            )}

        </div>
    );
}