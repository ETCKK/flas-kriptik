"use client";

import { useState } from "react";
import type { Cryptic } from "@/types";
import Button from "@/components/ui/Button";

interface StatsPageProps {
    cryptic: Cryptic;
    unlockedHints: number[];
    startedAt?: number;
    completedAt?: number;
    streak?: number;
}

interface Message {
    title: string,
    content: string
}

const flashMessage: Message = {
    title: "Işık Hızında",
    content: "Bir dakikadan kısa sürede çözüldü. Tebrikler ajan!"
}
const noHintMessage: Message = {
    title: "Kusursuz Çözüm",
    content: "Hiç istihbarat alınmadı. Tebrikler ajan!"
}
const allHintMessage: Message = {
    title: "Görev Tamamlandı",
    content: "Biraz destekten zarar gelmez. Tebrikler ajan!"
}
const defaultMessage: Message = {
    title: "Görev Tamamlandı",
    content: "Temiz bir çözüm. Tebrikler ajan!"
}

const DUMMY_STREAK = 3;

function getResultMessage(hintCount: number, totalHints: number, duration: number): Message {
    if (hintCount === 0) {
        return duration < 60000 ? flashMessage : noHintMessage;
    }

    return hintCount === totalHints ? allHintMessage : defaultMessage;
}

export default function StatsPage({
    cryptic,
    unlockedHints,
    startedAt,
    completedAt,
    streak = DUMMY_STREAK,
}: StatsPageProps) {
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

    const message = getResultMessage(hintCount, totalHints, diff);

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
            setTimeout(() => setCopied(false), 5000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="font-typewriter relative flex h-full min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 flex-col items-center px-1 pt-2 sm:px-4 sm:pt-5">
                <h2 className="text-center text-xl font-black tracking-widest text-stamp underline decoration-2 underline-offset-6 sm:text-3xl sm:decoration-3 sm:underline-offset-8">
                    {message.title}
                </h2>
                <p className="mt-4 max-w-lg text-center text-sm font-medium leading-relaxed tracking-wide sm:mt-6 sm:text-lg">
                    {message.content}
                </p>

                <dl className="my-auto grid w-full grid-cols-3 border-paper-ink/70">
                    <div className="min-w-0 border-r border-paper-ink/35 px-1 py-4 text-center sm:px-3 sm:py-6">
                        <dt className="text-[9px] font-bold tracking-[0.18em] opacity-60 sm:text-xs">SÜRE</dt>
                        <dd className="mt-2 text-base font-black tracking-wide sm:text-2xl">{formattedTime}</dd>
                    </div>
                    <div className="min-w-0 border-r border-paper-ink/35 px-1 py-4 text-center sm:px-3 sm:py-6">
                        <dt className="text-[9px] font-bold tracking-[0.12em] opacity-60 sm:text-xs sm:tracking-[0.18em]">İSTİHBARAT</dt>
                        <dd className="mt-2 text-base font-black tracking-wide sm:text-2xl">{hintCount} / {totalHints}</dd>
                    </div>
                    <div className="min-w-0 px-1 py-4 text-center sm:px-3 sm:py-6">
                        <dt className="text-[9px] font-bold tracking-[0.18em] opacity-60 sm:text-xs">SERİ</dt>
                        <dd className="mt-2 text-base font-black tracking-wide sm:text-2xl">{streak} GÜN</dd>
                    </div>
                </dl>
            </div>
            <div className="relative z-20 flex shrink-0 justify-center pb-1 pt-4 sm:pt-6">
                <Button type="button" variant="paper" className="min-w-36" onClick={handleShare} disabled={copied}>
                    {copied ? "Kopyalandı!" : "Raporu Paylaş"}
                </Button>
            </div>
        </div>
    );
}