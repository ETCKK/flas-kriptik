"use client";

import { useEffect, useState } from "react";
import type { Puzzle } from "@/types";
import AnswerGrid from "./AnswerGrid";
import Keyboard from "./Keyboard";

export default function PuzzleBoard({ puzzle }: { puzzle: Puzzle }) {
    const [letters, setLetters] = useState(() => Array(puzzle.length).fill(""));
    const [activeIndex, setActiveIndex] = useState(0);

    const updateLetter = (letter: string, direction: -1 | 1) => {
        setLetters((current) => {
            const next = [...current];
            next[activeIndex] = letter;
            return next;
        });
        setActiveIndex((current) =>
            Math.max(0, Math.min(current + direction, puzzle.length - 1)),
        );
    };

    const addLetter = (letter: string) =>
        updateLetter(letter.toLocaleLowerCase("tr-TR"), 1);

    const removeLetter = () => updateLetter("", -1);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                setActiveIndex((current) =>
                    Math.max(
                        0,
                        Math.min(
                            current + (event.key === "ArrowLeft" ? -1 : 1),
                            puzzle.length - 1,
                        ),
                    ),
                );
                return;
            }
            if (event.key === "Backspace") {
                removeLetter();
                return;
            }
            if (/^[a-zçğıöşü]$/i.test(event.key)) {
                addLetter(event.key.toLocaleUpperCase("tr-TR"));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="space-y-10">
            <AnswerGrid
                letters={letters}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
            />
            <Keyboard onKey={addLetter} onBackspace={removeLetter} />
        </div>
    );
}