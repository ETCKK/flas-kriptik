const istanbulFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const SLUG_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

function isValidDate(year: number, month: number, day: number): boolean {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

export function istanbulDateOf(ms: number): string {
    const parts = istanbulFormatter.formatToParts(ms);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
    return `${get("year")}-${get("month")}-${get("day")}`;
}

export function todayIstanbul(now: number = Date.now()): string {
    return istanbulDateOf(now);
}

export function fromSlug(slug: string): string | null {
    const match = SLUG_PATTERN.exec(slug);
    if (!match) {
        return null;
    }
    const [, day, month, year] = match;
    if (!isValidDate(Number(year), Number(month), Number(day))) {
        return null;
    }
    return `${year}-${month}-${day}`;
}

export function formatDisplayDate(iso: string, separator: string = "."): string {
    return toSlug(iso).replaceAll("-", separator);
}

export function toSlug(iso: string): string {
    const match = ISO_PATTERN.exec(iso);
    if (!match || !isValidDate(Number(match[1]), Number(match[2]), Number(match[3]))) {
        throw new Error(`Invalid ISO date: ${iso}`);
    }
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
}
