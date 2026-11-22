import type { Cryptic } from "@/types";
import { findCrypticByDate, findCrypticById } from "./repository";
import { normalizeAnswer } from "./normalize";

export { normalizeAnswer };

export async function getCrypticById(id: string): Promise<Cryptic | null> {
    return findCrypticById(id);
}

export async function getCrypticByDate(date: string): Promise<Cryptic | null> {
    return findCrypticByDate(date);
}

export async function checkAnswer(id: string, answer: string): Promise<boolean> {
    const cryptic = await getCrypticById(id);
    return cryptic ? normalizeAnswer(cryptic.answer) === normalizeAnswer(answer) : false;
}