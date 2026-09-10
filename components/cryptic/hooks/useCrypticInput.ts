"use client";

import { useCallback, useEffect, useState } from "react";

interface UseCrypticInputOptions {
    length: number;
    disabled: boolean;
    onSubmit: () => void;
}

interface CrypticInputState {
    letters: string[];
    cursorIndex: number;
    setLetters: (letters: string[]) => void;
    setCursorIndex: (index: number | ((current: number) => number)) => void;
    addLetter: (key: string) => void;
    removeLetter: () => void;
}

export function useCrypticInput({
    length,
    disabled,
    onSubmit,
}: UseCrypticInputOptions): CrypticInputState {
    const [letters, setLetters] = useState<string[]>(() => Array(length).fill(""));
    const [cursorIndex, setCursorIndex] = useState(0);

    const addLetter = useCallback((key: string) => {
        if (disabled) return;

        setLetters((current) => {
            const next = [...current];
            next[cursorIndex] = key.toLocaleLowerCase("tr-TR");
            return next;
        });
        setCursorIndex((current) => Math.min(current + 1, length - 1));
    }, [cursorIndex, disabled, length]);

    const removeLetter = useCallback(() => {
        if (disabled) return;

        setLetters((current) => {
            const next = [...current];
            const targetIndex = current[cursorIndex] ? cursorIndex : Math.max(0, cursorIndex - 1);
            next[targetIndex] = "";
            return next;
        });
        setCursorIndex((current) => (letters[current] ? current : Math.max(0, current - 1)));
    }, [cursorIndex, disabled, letters]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (disabled) return;
            if (event.key === "Backspace") removeLetter();
            else if (event.key === "Enter" && !letters.includes("")) {
                event.preventDefault();
                onSubmit();
            } else if (event.key === "ArrowLeft") {
                setCursorIndex((current) => Math.max(0, current - 1));
            } else if (event.key === "ArrowRight") {
                setCursorIndex((current) => Math.min(current + 1, length - 1));
            } else if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ]$/.test(event.key)) {
                addLetter(event.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [addLetter, disabled, length, letters, onSubmit, removeLetter]);

    return {
        letters,
        cursorIndex,
        setLetters,
        setCursorIndex,
        addLetter,
        removeLetter,
    };
}
