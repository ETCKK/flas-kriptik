"use client";

import { useCallback, useEffect, useRef } from "react";

const FLUSH_INTERVAL_MS = 5000;

export function useActiveTimer(isRunning: boolean, onElapsed: (ms: number) => void): () => void {
    const segmentStartRef = useRef<number | null>(null);
    const onElapsedRef = useRef(onElapsed);

    useEffect(() => {
        onElapsedRef.current = onElapsed;
    }, [onElapsed]);

    const flush = useCallback(() => {
        if (segmentStartRef.current === null) return;
        const now = performance.now();
        onElapsedRef.current(now - segmentStartRef.current);
        segmentStartRef.current = now;
    }, []);

    useEffect(() => {
        if (!isRunning) return;

        const start = () => {
            if (document.visibilityState === "visible" && segmentStartRef.current === null) {
                segmentStartRef.current = performance.now();
            }
        };
        const stop = () => {
            flush();
            segmentStartRef.current = null;
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") start();
            else stop();
        };

        start();
        const interval = window.setInterval(flush, FLUSH_INTERVAL_MS);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pagehide", stop);
        window.addEventListener("pageshow", start);

        return () => {
            window.clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pagehide", stop);
            window.removeEventListener("pageshow", start);
            stop();
        };
    }, [isRunning, flush]);

    return flush;
}
