import type { Puzzle } from "@/types";
import { puzzle } from "./examplePuzzle";

export async function getTodaysPuzzle(): Promise<Puzzle> {
    return puzzle;
}