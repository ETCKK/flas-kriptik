"use client";

import { useEffect, useState } from "react";
import Puzzle from "@/types/puzzle";
import AnswerGrid from "./AnswerGrid";
import Keyboard from "./Keyboard";

export default function PuzzleBoard({ puzzle }: { puzzle: Puzzle }) {
    const [letters, setLetters] = useState(() => Array(puzzle.length).fill(""));
    const [activeIndex, setActiveIndex] = useState(0);

    const addLetter = (letter: string) => {
        setLetters((current) => {
            const next = [...current];
                next[activeIndex] = letter.toLocaleLowerCase("tr-TR");
            return next;
        });
        setActiveIndex((current) => Math.min(current + 1, puzzle.length - 1));
    };

    const removeLetter = () => {
        setLetters((current) => {
            const next = [...current];
            next[activeIndex] = "";
            return next;
        });
        setActiveIndex((current) => Math.max(current - 1, 0));
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
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