"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HintType, PublishedCryptic } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { normalizeAnswer } from "@/lib/cryptic/normalize";
import { formatDisplayDate, todayIstanbul } from "@/lib/date";
import { computeStreak } from "@/lib/progress/streak";
import { useCrypticInput } from "./hooks/useCrypticInput";
import { useCrypticPhase } from "./hooks/useCrypticPhase";
import { useActiveTimer } from "./hooks/useActiveTimer";
import { useMounted } from "@/hooks/useMounted";

import Envelope from "./Envelope";
import CrypticPaper, { type CrypticPage } from "./CrypticPaper";
import Keyboard from "./Keyboard";
import CluePage from "./pages/CluePage";
import StatsPage from "./pages/StatsPage";
import ExplanationPage from "./pages/ExplanationPage";
import HintMenu from "./HintMenu";

export default function CrypticBoard({ cryptic, isDaily }: { cryptic: PublishedCryptic; isDaily: boolean }) {
    const { games, initCryptic, startPlaying, unlockHint, addActiveTime, setWon } = useGameStore();
    const game = games[cryptic.id];
    const isMounted = useMounted();
    const [isHintMenuOpen, setIsHintMenuOpen] = useState(false);
    const [hasAnswerError, setHasAnswerError] = useState(false);
    const statsTimeoutRef = useRef<number | undefined>(undefined);
    const errorTimeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => { initCryptic(cryptic.id, cryptic.publishDate); }, [cryptic.id, cryptic.publishDate, initCryptic]);

    useEffect(() => () => {
        window.clearTimeout(statsTimeoutRef.current);
        window.clearTimeout(errorTimeoutRef.current);
    }, []);

    const status = isMounted ? (game?.status ?? "idle") : "idle";
    const isWon = status === "won";
    const { phase } = useCrypticPhase(isMounted);

    const handleElapsed = useCallback((ms: number) => addActiveTime(cryptic.id, ms), [addActiveTime, cryptic.id]);
    const flushActiveTime = useActiveTimer(status === "playing" && phase === "playing", handleElapsed);

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
            flushActiveTime();
            setWon(cryptic.id, isDaily);
            statsTimeoutRef.current = window.setTimeout(() => setPage("stats"), 800);
            return;
        }

        setHasAnswerError(true);
        errorTimeoutRef.current = window.setTimeout(() => setHasAnswerError(false), 350);
    }

    function handleUnlockHint(type: HintType) {
        unlockHint(cryptic.id, type);
    }

    if (!isMounted) return <div className="min-h-[50vh]" />;

    return (
        <div className="relative flex h-full w-full flex-col items-center">

            <div className="relative flex flex-1 min-h-0 w-full max-w-2xl items-center justify-center perspective-[1200px]">
                <CrypticPaper cryptic={cryptic} phase={phase} page={page} pages={pages} onPageChange={setPage}>
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
                            activeMs={game?.activeMs ?? 0}
                            streak={computeStreak(Object.values(games), todayIstanbul())}
                        />
                    )}

                    {page === "explanation" && (
                        <ExplanationPage
                            cryptic={cryptic}
                            unlockedHints={game?.unlockedHints ?? []}
                        />
                    )}
                </CrypticPaper>
                <Envelope phase={phase} date={formatDisplayDate(cryptic.publishDate)} author={cryptic.author} />
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