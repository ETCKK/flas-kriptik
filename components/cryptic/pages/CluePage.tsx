"use client";

import { useState } from "react";
import type { Cryptic } from "@/types";
import Button from "@/components/ui/Button";
import type { CrypticPhase } from "../hooks/useCrypticPhase";
import AnswerGrid from "../AnswerGrid";
import HintGrid from "../HintGrid";

interface CluePageProps {
    cryptic: Cryptic;
    phase: CrypticPhase;
    letters: string[];
    cursorIndex: number;
    setCursorIndex: (i: number) => void;
    canSubmit: boolean;
    canUnlockHint: boolean;
    unlockedHints: number[];
    isWon: boolean;
    hasAnswerError: boolean;
    handleSubmit: () => void;
    handleHint: () => void;
}

export default function CluePage({ cryptic, phase, letters, cursorIndex, setCursorIndex, canSubmit, canUnlockHint, unlockedHints, isWon, hasAnswerError, handleSubmit, handleHint }: CluePageProps) {

    return (
        <div className="font-typewriter relative flex h-full flex-col">
            {isWon && (
                <div className="absolute inset-0 z-30 flex pointer-events-none items-center justify-center">
                    <div className="animate-[stampHit_0.4s_ease-out_forwards] rounded-sm border-[6px] border-stamp px-8 py-3 text-5xl sm:text-7xl font-black tracking-widest text-stamp rotate-[-15deg] bg-paper/10">
                        ÇÖZÜLDÜ
                    </div>
                </div>
            )}

            <div className="mb-3 flex shrink-0 flex-row justify-between border-b-2 border-paper-ink pb-2 text-[10px] font-bold sm:text-sm">
                <div className="flex flex-col text-left">
                    <span>GÖNDEREN: <span className="uppercase">{cryptic.author || "MERKEZ"}</span></span>
                </div>
                <div className="flex flex-col text-right">
                    <span>TARİH: {cryptic.date.replace(/-/g, ".")}</span>
                </div>
            </div>

            <div className="mb-10 text-sm leading-relaxed opacity-90 sm:text-base">
                <p className="mt-2">
                    Teşkilattan yeni bir görev aldın. Aşağıdaki kriptik metni çözerek şifreyi bulmalı ve merkeze iletmelisin.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto py-1 sm:py-3">
                <div className="mb-4 text-center">
                    <h1 className="mt-2 text-xl font-black leading-relaxed tracking-wide sm:text-3xl">
                        &quot;{cryptic.clue}&quot;
                    </h1>
                </div>

                <div className="relative z-20 mb-5">
                    <AnswerGrid letters={letters} cursorIndex={isWon ? -1 : cursorIndex} onSelect={setCursorIndex} hasError={hasAnswerError} />
                </div>
            </div>

            {(phase === "playing" || phase === "extracting") && (
                <div className={`relative z-20 mt-auto flex shrink-0 justify-center gap-3 pt-3 transition-opacity duration-500 sm:gap-4 ${isWon ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    <Button type="button" variant="paperSecondary">
                        İstihbarat
                    </Button>
                    <Button type="button" variant="paper" onClick={handleSubmit} disabled={!canSubmit || hasAnswerError}>
                        Deşifre Et
                    </Button>
                </div>
            )}

        </div>
    );
}