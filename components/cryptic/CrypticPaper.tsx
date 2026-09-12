"use client";

import type { ReactNode } from "react";
import type { CrypticPhase } from "./hooks/useCrypticPhase";

export type CrypticPage = "clue";

interface CrypticPaperProps {
    phase: CrypticPhase;
    page: CrypticPage;
    onPageChange: (page: CrypticPage) => void;
    children: ReactNode;
}

export default function CrypticPaper({
    phase, page, children
}: CrypticPaperProps) {
    const transformClass = 
        phase === "idle" || phase === "unsealing" 
        ? "translate-y-12 scale-95 opacity-0 pointer-events-none" 
        : "translate-y-0 scale-100 opacity-100";

    return (
        <div
            data-page={page}
            className={`relative z-10 mx-auto flex h-[96%] max-h-[640px] w-[95%] flex-col overflow-hidden border-2 border-paper-ink bg-paper p-3 text-paper-ink shadow-[0_6px_0_rgba(0,0,0,0.4)] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-5 ${transformClass}`}
        >
            {children}
        </div>
    );
}