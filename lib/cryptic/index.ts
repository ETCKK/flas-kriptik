import type { Cryptic, Hint } from "@/types";
import { findCrypticByDate, findCrypticById } from "./repository";


export async function getCrypticById(id: string): Promise<Cryptic | null> {
    return findCrypticById(id);
}

export async function getCrypticByDate(date: string): Promise<Cryptic | null> {
    return findCrypticByDate(date);
}

export function normalizeAnswer(answer: string): string {
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