import type { Cryptic, PublishedCryptic } from "@/types";
import { todayIstanbul } from "@/lib/date";
import { findCrypticByDate, findCrypticById, findCrypticByNumber } from "./repository";
import { normalizeAnswer } from "./normalize";

export { normalizeAnswer };

export function isPublished(cryptic: Cryptic, today: string): cryptic is PublishedCryptic {
    return cryptic.publishDate !== null && cryptic.publishDate <= today;
}

export async function getPublishedByDate(date: string, today: string = todayIstanbul()): Promise<PublishedCryptic | null> {
    if (date > today) {
        return null;
    }
    const cryptic = await findCrypticByDate(date);
    return cryptic && isPublished(cryptic, today) ? cryptic : null;
}

export async function getPublishedByNumber(number: number, today: string = todayIstanbul()): Promise<PublishedCryptic | null> {
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
