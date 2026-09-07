import type { Clue } from "@/types";
import { clue } from "./exampleClue";

export async function getTodaysClue(): Promise<Clue> {
    return clue;
}