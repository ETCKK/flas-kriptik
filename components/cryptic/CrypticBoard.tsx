"use client";

import { useEffect, useState } from "react";
import type { PublicCryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { submitAnswer } from "@/actions/cryptic";
import { useCrypticInput } from "./hooks/useCrypticInput";
import { useCrypticPhase } from "./hooks/useCrypticPhase";
import { useMounted } from "@/hooks/useMounted";

import Envelope from "./Envelope";
import CrypticPaper, { type CrypticPage } from "./CrypticPaper";
import Keyboard from "./Keyboard";
import CluePage from "./pages/CluePage";

export default function CrypticBoard({ cryptic }: { cryptic: PublicCryptic }) {
    const { games, initCryptic, startPlaying, setWon } = useGameStore();
    const game = games[cryptic.id];
    const isMounted = useMounted();
    const [isChecking, setIsChecking] = useState(false);
    const [page, setPage] = useState<CrypticPage>("clue");

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
        if (isWon && game?.answer && letters.includes("")) {
            setLetters(game.answer.split(""));
        }
    }, [game?.answer, isWon, letters, setLetters]);

    function handleSubmit() {
        if (isChecking || !canSubmit || isWon) return;
        setIsChecking(true);
        const answer = letters.join("");
        submitAnswer(cryptic.id, answer).then((isCorrect) => {
            if (isCorrect) setWon(cryptic.id, answer);
            setIsChecking(false);
        });
    }

    if (!isMounted) return <div className="min-h-[50vh]" />;

    return (
        <div className={`relative flex w-full flex-col items-center ${phase === "playing" && !isWon ? "pb-52 sm:pb-64" : ""}`}>
            <div className="relative w-full max-w-2xl perspective-[1200px]">
                <CrypticPaper phase={phase} page={page} onPageChange={setPage}>
                    {page === "clue" && (
                        <CluePage
                            cryptic={cryptic}
                            phase={phase}
                            letters={letters}
                            cursorIndex={cursorIndex}
                            setCursorIndex={setCursorIndex}
                            isChecking={isChecking}
                            canSubmit={canSubmit}
                            isWon={isWon}
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