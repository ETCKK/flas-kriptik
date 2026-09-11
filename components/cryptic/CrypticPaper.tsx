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
        phase === "idle" || phase === "unsealing" ? "translate-y-8 scale-95 opacity-0" : 
        "translate-y-0 scale-100 opacity-100";

    return (
        <div
            data-page={page}
            className={`relative z-10 mx-auto w-[95%] border-2 border-paper-ink bg-paper p-5 text-paper-ink shadow-[0_6px_0_rgba(0,0,0,0.4)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:p-10 ${transformClass}`}
        >
            {children}
        </div>
    );
}