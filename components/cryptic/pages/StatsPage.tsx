"use client";

import { useState } from "react";
import type { Cryptic } from "@/types";
import Button from "@/components/ui/Button";

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

    let performanceTitle = "Görev Başarılı.";
    if (hintCount === 0) {
        performanceTitle = diff < 60000 ? "Işık Hızında!" : "Kusursuz Çözüm!";
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
        <div className="font-typewriter relative flex h-full flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:gap-14">
                <h2 className="mb-8 text-center text-2xl font-black tracking-widest text-stamp sm:text-3xl">
                    {performanceTitle}
                </h2>

                <div className="flex w-full max-w-3xs sm:max-w-sm flex-col gap-4 sm:gap-6 border-2 rounded-md border-paper-ink shadow-[4px_4px_0_var(--color-paper-ink)] py-6 sm:py-10">
                    <div className="flex justify-center text-base font-bold sm:text-xl">
                        <span>GEÇEN SÜRE: {formattedTime}</span>
                    </div>
                    <div className="flex justify-center text-base font-bold sm:text-xl">
                        <span>İSTİHBARAT: {hintCount} / {totalHints}</span>
                    </div>
                </div>
            </div>
            <div className="relative z-20 mt-auto flex shrink-0 justify-center pt-3">
                <Button type="button" variant="paper" onClick={handleShare}>
                    {copied ? "Kopyalandı!" : "Raporu Paylaş"}
                </Button>
            </div>

        </div>
    );
}