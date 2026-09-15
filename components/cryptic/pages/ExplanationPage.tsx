"use client";

import type { Cryptic } from "@/types";
import Clue from "../Clue";
import AnswerGrid from "../AnswerGrid";

interface ExplanationPageProps {
    cryptic: Cryptic;
    unlockedHints: number[];
}

export default function ExplanationPage({ cryptic, unlockedHints }: ExplanationPageProps) {
    const explanationText = (cryptic as any).explanation || "Bu kriptiğin detaylı çözüm raporu henüz arşive eklenmemiştir.";
    const letters = cryptic.answer.split("");

    return (
        <div className="font-typewriter relative flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-1 sm:py-3">
                <div className="mb-2 text-center">
                    <Clue cryptic={cryptic} unlockedHints={unlockedHints} />
                </div>
                <div className="relative z-20 mb-8 sm:mb-10">
                    <AnswerGrid 
                        letters={letters} 
                        cursorIndex={-1} 
                        onSelect={() => {}} 
                        hasError={false} 
                    />
                </div>
                
                <div className="flex flex-col items-center px-2 pb-8 sm:px-4">
                    <p className="text-sm font-medium leading-relaxed opacity-90 sm:text-lg">
                        {explanationText}
                    </p>
                </div>
            </div>
            
            <div className="h-20 sm:h-20 shrink-0" />
        </div>
    );
}