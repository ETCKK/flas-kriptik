"use client";

import { useState } from "react";
import type { Cryptic } from "@/types";
import Button from "@/components/ui/Button";
import Clue from "../Clue";
import AnswerGrid from "../AnswerGrid";

interface StatsPageProps {
    cryptic: Cryptic;
    unlockedHints: number[];
    startedAt?: number;
    completedAt?: number;
}

export default function StatsPage({ cryptic, unlockedHints, startedAt, completedAt }: StatsPageProps) {
    const [copied, setCopied] = useState(false);
    
    const hintCount = unlockedHints.length;
    const totalHints = cryptic.hints.length;

    let diff = 0;
    if (startedAt && completedAt) {
        diff = completedAt - startedAt;
    }
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const formattedTime = `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    let performanceTitle = "GÖREV BAŞARILI";
    if (hintCount === 0) {
        performanceTitle = diff < 60000 ? "IŞIK HIZINDA" : "KUSURSUZ ÇÖZÜM";
    }

    const handleShare = async () => {
        const text = `Flaş Kriptik #${cryptic.id.split("-")[1]} | ⏱️ ${formattedTime} | 🕵️ ${hintCount}/${totalHints} | ${cryptic.date.replace(/-/g, "/")}`;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.setAttribute("readonly", ""); 
                textArea.style.position = "fixed";
                textArea.style.top = "-999999px";
                textArea.style.left = "-999999px";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }
            
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const letters = cryptic.answer.split("");

    return (
        <div className="font-typewriter relative flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-1 sm:py-3">
                <div className="mb-2 text-center">
                    <Clue cryptic={cryptic} unlockedHints={unlockedHints} />
                </div>
                <div className="relative z-20 mb-6 sm:mb-8">
                    <AnswerGrid
                        letters={letters}
                        cursorIndex={-1}
                        onSelect={() => { }}
                        hasError={false}
                    />
                </div>

                <div className="flex flex-col items-center gap-4 pb-8">
                    <h2 className="text-center text-xl font-black tracking-widest text-stamp sm:text-2xl">
                        {performanceTitle}
                    </h2>

                    <div className="flex w-full max-w-xs sm:max-w-md flex-col gap-4 border-3 border-paper-ink py-8">
                        <div className="flex justify-center text-base sm:text-lg font-bold">
                            <span>GEÇEN SÜRE: {formattedTime}</span>
                        </div>
                        <div className="flex justify-center text-base sm:text-lg font-bold">
                            <span>İSTİHBARAT: {hintCount} / {totalHints}</span>
                        </div>
                    </div>
                    <div className="relative z-20 mt-auto flex shrink-0 justify-center pt-3">
                        <Button type="button" variant="paper" onClick={handleShare} disabled={copied}>
                            {copied ? "Kopyalandı!" : "Raporu Paylaş"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}