import { formatDisplayDate } from "@/lib/date";
import type { PublishedCryptic } from "@/types";

interface ShareResult {
    time: string;
    hintCount: number;
    totalHints: number;
}

export function buildShareText(
    { number, publishDate }: Pick<PublishedCryptic, "number" | "publishDate">,
    { time, hintCount, totalHints }: ShareResult,
): string {
    return `Flaş Kriptik #${number} | ⏱️ ${time} | 🕵️ ${hintCount}/${totalHints} | ${formatDisplayDate(publishDate, "/")}`;
}
