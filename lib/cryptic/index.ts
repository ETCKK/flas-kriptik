import type { Cryptic } from "@/types";
import { fromSlug, todayIstanbul } from "@/lib/date";
import { findCrypticByDate, findCrypticById, findCrypticByNumber } from "./repository";
import { normalizeAnswer } from "./normalize";

export { normalizeAnswer };

export function isPublished(cryptic: Cryptic, today: string): boolean {
    const date = fromSlug(cryptic.date);
    return date !== null && date <= today;
}

export async function getPublishedByDate(date: string, today: string = todayIstanbul()): Promise<Cryptic | null> {
    if (date > today) {
        return null;
    }
    return findCrypticByDate(date);
}

export async function getPublishedByNumber(number: number, today: string = todayIstanbul()): Promise<Cryptic | null> {
    const cryptic = await findCrypticByNumber(number);
    return cryptic && isPublished(cryptic, today) ? cryptic : null;
}

export async function checkAnswer(id: string, answer: string, today: string = todayIstanbul()): Promise<boolean> {
    const cryptic = await findCrypticById(id);
    if (!cryptic || !isPublished(cryptic, today)) {
        return false;
    }
    return normalizeAnswer(cryptic.answer) === normalizeAnswer(answer);
}
