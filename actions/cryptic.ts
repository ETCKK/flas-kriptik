"use server";

import { checkAnswer, getHintByIndex } from "@/lib/cryptic";
import type { Hint } from "@/types";

export async function submitAnswer(id: string, answer: string): Promise<boolean> {
    return checkAnswer(id, answer);
}

export async function fetchHintByIndex(id: string, index: number): Promise<Hint | null> {
    return getHintByIndex(id, index);
}