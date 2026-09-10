"use client";

import { useState, useEffect } from "react";
import type { PublicCryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { submitAnswer, fetchHintByIndex } from "@/actions/cryptic";
import Button from "@/components/ui/Button";
import AnswerGrid from "./AnswerGrid";
import Keyboard from "./Keyboard";

export default function CrypticBoard({ cryptic }: { cryptic: PublicCryptic }) {
    const [letters, setLetters] = useState<string[]>(() => Array(cryptic.length).fill(""));
    const [cursorIndex, setCursorIndex] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const game = useGameStore((state) => state.games[cryptic.id]);
    const initCryptic = useGameStore((state) => state.initCryptic);

    useEffect(() => {
        initCryptic(cryptic.id);
    }, [cryptic.id, initCryptic]);

    const isWon = game?.status === "won";
    const canSubmit = !letters.includes("") && !isChecking && !isWon;

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
            const targetIndex = next[cursorIndex] ? cursorIndex : Math.max(0, cursorIndex - 1);
            next[targetIndex] = "";
            return next;
        });
        setCursorIndex((curr) => (letters[curr] ? curr : Math.max(0, curr - 1)));
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
            <div className="flex justify-center gap-4">
                <Button>İpucu Al</Button>
                <Button disabled={!canSubmit}>
                    Gönder
                </Button>
            </div>
            <Keyboard onKey={addLetter} onBackspace={removeLetter} />
        </div>
    );
}