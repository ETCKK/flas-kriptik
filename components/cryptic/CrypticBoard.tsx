"use client";

import { useEffect, useState } from "react";
import type { Cryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { normalizeAnswer } from "@/lib/cryptic";
import { useCrypticInput } from "./hooks/useCrypticInput";
import { useCrypticPhase } from "./hooks/useCrypticPhase";
import { useMounted } from "@/hooks/useMounted";

import Envelope from "./Envelope";
import CrypticPaper, { type CrypticPage } from "./CrypticPaper";
import Keyboard from "./Keyboard";
import CluePage from "./pages/CluePage";

export default function CrypticBoard({ cryptic }: { cryptic: Cryptic }) {
    const { games, initCryptic, startPlaying, setWon } = useGameStore();
    const game = games[cryptic.id];
    const isMounted = useMounted();
    const [page, setPage] = useState<CrypticPage>("clue");
    const [hasAnswerError, setHasAnswerError] = useState(false);

    useEffect(() => { initCryptic(cryptic.id); }, [cryptic.id, initCryptic]);

    const status = isMounted ? (game?.status ?? "idle") : "idle";
    const isWon = status === "won";

    const { phase, breakSeal } = useCrypticPhase({
        isMounted,
        status,
        onStart: () => startPlaying(cryptic.id),
    });

    const { letters, cursorIndex, setLetters, setCursorIndex, addLetter, removeLetter } = useCrypticInput({
        length: cryptic.length,
        disabled: isWon || phase !== "playing",
        onSubmit: handleSubmit,
    });
    const canSubmit = !letters.includes("");

    useEffect(() => {
        if (isWon && letters.includes("")) {
            setLetters(cryptic.answer.split(""));
        }
    }, [cryptic.answer, isWon, letters, setLetters]);

    function handleSubmit() {
        if (!canSubmit || isWon) return;
        const answer = letters.join("");
        const isCorrect = normalizeAnswer(answer) === normalizeAnswer(cryptic.answer);
        if (isCorrect) {
            setWon(cryptic.id);
            return;
        }

        setHasAnswerError(true);
        window.setTimeout(() => setHasAnswerError(false), 350);
    }

    if (!isMounted) return <div className="min-h-[50vh]" />;

    return (
        <div className={`relative flex w-full flex-col items-center ${phase === "playing" && !isWon ? "pb-52 sm:pb-64" : ""}`}>
            <div className="relative w-full max-w-2xl perspective-[1200px]">
                <CrypticPaper font-typewriter phase={phase} page={page} onPageChange={setPage}>
                    {page === "clue" && (
                        <CluePage
                            cryptic={cryptic}
                            phase={phase}
                            letters={letters}
                            cursorIndex={cursorIndex}
                            setCursorIndex={setCursorIndex}
                            canSubmit={canSubmit}
                            isWon={isWon}
                            hasAnswerError={hasAnswerError}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </CrypticPaper>
                <Envelope phase={phase} onBreakSeal={breakSeal} />
            </div>

            {phase === "playing" && !isWon && (
                <Keyboard onKey={addLetter} onBackspace={removeLetter} />
            )}
        </div>
    );
}