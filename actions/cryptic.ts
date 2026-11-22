"use server";

import { checkAnswer } from "@/lib/cryptic";

export async function submitAnswer(id: string, answer: string): Promise<boolean> {
    return checkAnswer(id, answer);
}
