"use client";

import { useState, useEffect } from "react";
import type { PublicCryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { submitAnswer, fetchHintByIndex } from "@/actions/cryptic";
import AnswerGrid from "./AnswerGrid";
import Keyboard from "./Keyboard";

export default function CrypticBoard({ cryptic }: { cryptic: PublicCryptic }) {
    const [letters, setLetters] = useState<string[]>(() => Array(cryptic.length).fill(""));
    const [cursorIndex, setCursorIndex] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const { status, unlockedHints, initCryptic, unlockHint, setWon } = useGameStore();

    useEffect(() => {
        initCryptic(cryptic.id);
    }, [cryptic.id, initCryptic]);

    const isWon = status === "won";

    const addLetter = (key: string) => {
        if (isWon) return;
        setLetters((curr) => {
            const next = [...curr];
            next[cursorIndex] = key.toLocaleLowerCase("tr-TR");
            return next;
        });
        setCursorIndex((curr) => Math.min(curr + 1, cryptic.length - 1));
    };

    const removeLetter = () => {
        if (isWon) return;
        setLetters((curr) => {
            const next = [...curr];
            next[cursorIndex] = "";
            return next;
        });
        setCursorIndex((curr) => Math.max(0, curr - 1));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isWon) return;
            if (e.key === "Backspace") removeLetter();
            else if (e.key === "ArrowLeft") setCursorIndex((i) => Math.max(0, i - 1));
            else if (e.key === "ArrowRight") setCursorIndex((i) => Math.min(i + 1, cryptic.length - 1));
            else if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ]$/.test(e.key)) addLetter(e.key);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cursorIndex, letters, isWon]);

    return (
        <div className="space-y-8">
            <AnswerGrid letters={letters} cursorIndex={cursorIndex} onSelect={setCursorIndex} />
            <Keyboard onKey={addLetter} onBackspace={removeLetter} />
        </div>
    );
}