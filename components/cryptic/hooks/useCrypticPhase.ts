"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type CrypticPhase = "idle" | "unsealing" | "extracting" | "playing";
type GameStatus = "idle" | "playing" | "won";

interface UseCrypticPhaseOptions {
    isMounted: boolean;
    status: GameStatus;
    onStart: () => void;
}

export function useCrypticPhase({ isMounted, status, onStart }: UseCrypticPhaseOptions) {
    const [phase, setPhase] = useState<CrypticPhase>("idle");
    const hasStartedAnimation = useRef(false);

    useEffect(() => {
        if (!isMounted || status === "idle" || hasStartedAnimation.current) return;
        
        hasStartedAnimation.current = true;
        
        const extractTimer = window.setTimeout(() => {
            setPhase("extracting");
        }, 0);
        
        const playingTimer = window.setTimeout(() => {
            setPhase("playing");
        }, 700);
        
        return () => {
            window.clearTimeout(extractTimer);
            window.clearTimeout(playingTimer);
            
            hasStartedAnimation.current = false;
        };
    }, [isMounted, status]);

    const breakSeal = useCallback(() => {
        if (phase !== "idle") return;
        
        hasStartedAnimation.current = true;
        setPhase("unsealing");
        
        window.setTimeout(() => {
            setPhase("extracting");
            window.setTimeout(() => {
                setPhase("playing");
                onStart();
            }, 1000);
        }, 600);
    }, [onStart, phase]);

    return { phase, breakSeal };
}