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
import StatsPage from "./pages/StatsPage";
import ExplanationPage from "./pages/ExplanationPage";
import HintMenu from "./HintMenu";

export default function CrypticBoard({ cryptic }: { cryptic: Cryptic }) {
    const { games, initCryptic, startPlaying, unlockHint, setWon } = useGameStore();
    const game = games[cryptic.id];
    const isMounted = useMounted();
    const [isHintMenuOpen, setIsHintMenuOpen] = useState(false);
    const [hasAnswerError, setHasAnswerError] = useState(false);

    useEffect(() => { initCryptic(cryptic.id); }, [cryptic.id, initCryptic]);

    const status = isMounted ? (game?.status ?? "idle") : "idle";
    const isWon = status === "won";
    const { phase } = useCrypticPhase(isMounted);

    const [page, setPage] = useState<CrypticPage>("clue");
    const pages: CrypticPage[] = isWon ? ["clue", "stats", "explanation"] : ["clue"];

    useEffect(() => {
        if (phase === "playing" && status === "idle") {
            startPlaying(cryptic.id);
        }
    }, [phase, status, cryptic.id, startPlaying]);

    const { letters, cursorIndex, setLetters, setCursorIndex, addLetter, removeLetter } = useCrypticInput({
        length: cryptic.length,
        disabled: isWon || phase !== "playing" || isHintMenuOpen,
        onSubmit: handleSubmit,
    });

    const canSubmit = !letters.includes("") && !isWon && phase === "playing" && !isHintMenuOpen && !hasAnswerError;
    const canOpenHintMenu = !isWon && phase === "playing" && !isHintMenuOpen;

    useEffect(() => {
        if (isWon && letters.includes("")) {
            setLetters(cryptic.answer.split(""));
        }
    }, [cryptic.answer, isWon, letters, setLetters]);

    function handleSubmit() {
        if (!canSubmit) return;
        const answer = letters.join("");
        const isCorrect = normalizeAnswer(answer) === normalizeAnswer(cryptic.answer);
        if (isCorrect) {
            setWon(cryptic.id);
            setTimeout(() => setPage("stats"), 800);
            return;
        }

        setHasAnswerError(true);
        window.setTimeout(() => setHasAnswerError(false), 350);
    }

    function handleUnlockHint(hintIndex: number) {
        unlockHint(cryptic.id, hintIndex);
    }

    if (!isMounted) return <div className="min-h-[50vh]" />;

    return (
        <div className="relative flex h-full w-full flex-col items-center">

            <div className="relative flex flex-1 min-h-0 w-full max-w-2xl items-center justify-center perspective-[1200px]">
                <CrypticPaper font-typewriter cryptic={cryptic} phase={phase} page={page} pages={pages} onPageChange={setPage}>
                    {page === "clue" && (
                        <CluePage
                            cryptic={cryptic}
                            phase={phase}
                            letters={letters}
                            cursorIndex={cursorIndex}
                            setCursorIndex={setCursorIndex}
                            canSubmit={canSubmit}
                            canOpenHintMenu={canOpenHintMenu}
                            isWon={isWon}
                            hasAnswerError={hasAnswerError}
                            handleSubmit={handleSubmit}
                            handleHint={() => setIsHintMenuOpen(true)}
                        />
                    )}

                    {page === "stats" && (
                        <StatsPage
                            cryptic={cryptic}
                            unlockedHints={game?.unlockedHints ?? []}
                            startedAt={game?.startedAt ?? 0}
                            completedAt={game?.completedAt ?? 0}
                        />
                    )}

                    {page === "explanation" && (
                        <ExplanationPage
                            cryptic={cryptic}
                            unlockedHints={game?.unlockedHints ?? []}
                        />
                    )}
                </CrypticPaper>
                <Envelope phase={phase} date={cryptic.date} author={cryptic.author} />
            </div>

            <div className="w-full shrink-0">
                <Keyboard
                    onKey={addLetter}
                    onBackspace={removeLetter}
                    isVisible={phase === "playing" && !isWon}
                />
            </div>

            <HintMenu
                cryptic={cryptic}
                isOpen={isHintMenuOpen}
                onClose={() => setIsHintMenuOpen(false)}
                onUnlockHint={handleUnlockHint}
            />
        </div>
    );
}