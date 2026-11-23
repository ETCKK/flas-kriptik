import { addDays } from "@/lib/date";
import type { CrypticGame } from "@/types";

export function computeStreak(games: readonly CrypticGame[], today: string): number {
    const days = new Set(
        games
            .filter((game) => game.status === "won" && game.solvedAsDaily === true && game.publishDate !== undefined)
            .map((game) => game.publishDate)
    );

    let day = days.has(today) ? today : addDays(today, -1);
    let streak = 0;
    while (days.has(day)) {
        streak += 1;
        day = addDays(day, -1);
    }
    return streak;
}
