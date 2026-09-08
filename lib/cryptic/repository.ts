import { cryptics } from "@/data/cryptic";
import type { Cryptic } from "@/types";

export async function findCrypticById(id: string): Promise<Cryptic | null> {
    return cryptics.find((cryptic) => cryptic.id === id) ?? null;
}

export async function findCrypticByDate(date: string): Promise<Cryptic | null> {
    return cryptics.find((cryptic) => cryptic.date === date) ?? null;
}