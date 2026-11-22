import "server-only";
import { cryptics, exampleCryptic } from "@/data/cryptic";
import { fromSlug, toSlug, todayIstanbul } from "@/lib/date";
import type { Cryptic } from "@/types";

function allCryptics(): readonly Cryptic[] {
    if (process.env.NODE_ENV !== "development") {
        return cryptics;
    }
    const today = toSlug(todayIstanbul());
    return cryptics.map((cryptic) => (cryptic === exampleCryptic ? { ...cryptic, date: today } : cryptic));
}

export async function findCrypticById(id: string): Promise<Cryptic | null> {
    return allCryptics().find((cryptic) => cryptic.id === id) ?? null;
}

export async function findCrypticByNumber(number: number): Promise<Cryptic | null> {
    return allCryptics().find((cryptic) => cryptic.number === number) ?? null;
}

export async function findCrypticByDate(date: string): Promise<Cryptic | null> {
    return allCryptics().find((cryptic) => fromSlug(cryptic.date) === date) ?? null;
}
