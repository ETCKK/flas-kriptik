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
    clue: "Kriptik",
    stats: "İstatistik",
    explanation: "Açıklama",
};

const BOOKMARK_BASE_CLASSES =
    "h-12 min-w-0 cursor-pointer px-2 pt-1 font-typewriter font-bold text-xs tracking-wide transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-sm";

export default function CrypticPaper({
    cryptic,
    phase,
    page,
    pages,
    onPageChange,
    children,
}: CrypticPaperProps) {
    const [direction, setDirection] = useState<"left" | "right">("right");
    const transformClass =
        phase === "idle" || phase === "unsealing"
            ? "translate-y-12 scale-95 opacity-0 pointer-events-none"
            : "translate-y-0 scale-100 opacity-100";
    const animationClass = direction === "right" ? "animate-slide-left" : "animate-slide-right";

    const currentIndex = pages.indexOf(page);
    const showBookmarks = pages.length > 1;

    const changePage = (nextPage: CrypticPage, nextIndex: number) => {
        setDirection(nextIndex < currentIndex ? "left" : "right");
        onPageChange(nextPage);
    };

    return (
        <div
            data-page={page}
            className={`relative z-10 mx-auto flex h-[96%] max-h-[640px] w-[95%] flex-col text-paper-ink transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformClass}`}
        >
            <div className="relative z-10 h-full min-h-0 overflow-hidden bg-paper">
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
                </div>
            </div>

            {showBookmarks && (
                <nav
                    aria-label="Dosya sayfaları"
                    className="absolute top-full grid h-16 w-full grid-cols-3 items-start"
                >
                    {pages.map((item, index) => {
                        const isActive = page === item;
                        const stateClasses = isActive
                            ? "z-5 bg-paper text-paper-ink"
                            : "bg-paper-muted text-paper-ink/60";

                        return (
                            <button
                                key={item}
                                type="button"
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => changePage(item, index)}
                                className={`${BOOKMARK_BASE_CLASSES} ${stateClasses}`}
                            >
                                {PAGE_LABELS[item]}
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}