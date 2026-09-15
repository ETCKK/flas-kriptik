"use client";

import { useState, type ReactNode } from "react";
import type { CrypticPhase } from "./hooks/useCrypticPhase";
import type { Cryptic } from "@/types";

export type CrypticPage = "clue" | "stats" | "explanation";

interface CrypticPaperProps {
    cryptic: Cryptic;
    phase: CrypticPhase;
    page: CrypticPage;
    pages: CrypticPage[];
    onPageChange: (page: CrypticPage) => void;
    children: ReactNode;
}

const PAGE_LABELS: Record<CrypticPage, string> = {
    clue: "",
    stats: "istatistikler",
    explanation: "açıklama",
};

export default function CrypticPaper({
    cryptic, phase, page, pages, onPageChange, children
}: CrypticPaperProps) {
    const [direction, setDirection] = useState<"left" | "right">("right");
    const transformClass =
        phase === "idle" || phase === "unsealing"
            ? "translate-y-12 scale-95 opacity-0 pointer-events-none"
            : "translate-y-0 scale-100 opacity-100";
    const animationClass = direction === "right" ? "animate-slide-left" : "animate-slide-right";

    const currentIndex = pages.indexOf(page);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < pages.length - 1;

    return (
        <div
            data-page={page}
            className={`relative z-10 mx-auto flex h-[96%] max-h-[640px] w-[95%] flex-col overflow-hidden border-2 border-paper-ink bg-paper text-paper-ink shadow-[0_6px_0_rgba(0,0,0,0.4)] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformClass}`}
        >
            <div key={page} className={`relative flex h-full w-full flex-col p-3 sm:p-5 ${animationClass}`}>
                <div className="mb-3 flex shrink-0 flex-row justify-between border-dotted border-b-3 border-paper-ink pb-2 font-typewriter text-[10px] font-bold sm:text-sm">
                    <div className="flex flex-col text-left">
                        <span>GÖNDEREN: <span className="uppercase">{cryptic.author}</span></span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span>TARİH: {cryptic.date.replace(/-/g, ".")}</span>
                    </div>
                </div>

                {children}
                
                {hasPrev && (
                    <button
                        type="button"
                        onClick={() => {
                            setDirection("left");
                            onPageChange(pages[currentIndex - 1])
                        }}
                        className="group absolute bottom-3 left-4 z-50 p-5 -m-5 flex flex-col items-start cursor-pointer text-stamp transition-opacity hover:opacity-60 sm:bottom-4"
                        aria-label="Önceki Sayfa"
                    >
                        {PAGE_LABELS[pages[currentIndex - 1]] && (
                            <span className="font-handwriting text-lg font-bold sm:text-2xl">
                                {PAGE_LABELS[pages[currentIndex - 1]]}
                            </span>
                        )}

                        <svg viewBox="0 0 40 15" className="w-8 -rotate-2 sm:w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M38 7.5 Q 20 8.5 3 7 M 12 2 Q 7 5 2 7 Q 8 11 13 14" />
                        </svg>
                    </button>
                )}

                {hasNext && (
                    <button
                        type="button"
                        onClick={() => {
                            setDirection("right");
                            onPageChange(pages[currentIndex + 1])
                        }}
                        className="group absolute bottom-3 right-4 z-50 p-5 -m-5 flex flex-col items-end cursor-pointer text-stamp transition-opacity hover:opacity-60 sm:bottom-4"
                        aria-label="Sonraki Sayfa"
                    >
                        {PAGE_LABELS[pages[currentIndex + 1]] && (
                            <span className="font-handwriting text-lg font-bold sm:text-2xl">
                                {PAGE_LABELS[pages[currentIndex + 1]]}
                            </span>
                        )}

                        <svg viewBox="0 0 40 15" className="w-8 rotate-2 sm:w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 7.5 Q 20 6.5 37 8 M 28 2 Q 33 5 38 8 Q 32 11 27 14" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}