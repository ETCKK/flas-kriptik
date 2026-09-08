import type { Cryptic, PublicCryptic, Hint } from "@/types";
import { findCrypticByDate, findCrypticById } from "./repository";

export function toPublicCryptic(cryptic: Cryptic): PublicCryptic {
    return {
        id: cryptic.id,
        date: cryptic.date,
        clue: cryptic.clue,
        length: cryptic.length,
        author: cryptic.author,
        difficulty: cryptic.difficulty,
    };
}

export async function getCrypticById(id: string): Promise<Cryptic | null> {
    return findCrypticById(id);
}

export async function getCrypticByDate(date: string): Promise<Cryptic | null> {
    return findCrypticByDate(date);
}

export async function getPublicCrypticById(id: string): Promise<PublicCryptic | null> {
    const cryptic = await getCrypticById(id);
    return cryptic ? toPublicCryptic(cryptic) : null;
}

export async function getPublicCrypticByDate(date: string): Promise<PublicCryptic | null> {
    const cryptic = await getCrypticByDate(date);
    return cryptic ? toPublicCryptic(cryptic) : null;
}

function normalizeAnswer(answer: string): string {
    return answer.trim().normalize("NFC").toLocaleLowerCase("tr-TR");
}

export async function checkAnswer(id: string, answer: string): Promise<boolean> {
    const cryptic = await getCrypticById(id);
    return cryptic ? normalizeAnswer(cryptic.answer) === normalizeAnswer(answer) : false;
}

export async function getHintByIndex(id: string, index: number): Promise<Hint | null> {
    const cryptic = await getCrypticById(id);
    return cryptic?.hints?.[index] ?? null;
}