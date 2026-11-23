import { fromSlug } from "@/lib/date";

type ParsedSlug = { kind: "date"; date: string } | { kind: "number"; number: number };

const NUMBER_PATTERN = /^[1-9]\d*$/;

export function parseSlug(slug: string): ParsedSlug | null {
    const date = fromSlug(slug);
    if (date) {
        return { kind: "date", date };
    }
    if (NUMBER_PATTERN.test(slug)) {
        const number = Number(slug);
        return Number.isSafeInteger(number) ? { kind: "number", number } : null;
    }
    return null;
}
