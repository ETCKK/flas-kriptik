"use client";
import { useEffect, useState } from "react";

export type CrypticPhase = "idle" | "unsealing" | "extracting" | "playing";

export function useCrypticPhase(isMounted: boolean) {
    const [phase, setPhase] = useState<CrypticPhase>("idle");

    useEffect(() => {
        if (!isMounted) return;

        const t1 = window.setTimeout(() => setPhase("unsealing"), 50);
        const t2 = window.setTimeout(() => setPhase("extracting"), 700);
        const t3 = window.setTimeout(() => setPhase("playing"), 1600);

        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    }, [isMounted]);

    return { phase };
}