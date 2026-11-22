import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDisplayDate, fromSlug, istanbulDateOf, toSlug, todayIstanbul } from "./date";

const at = (iso: string) => new Date(iso).getTime();

describe("istanbulDateOf", () => {
    it("stays on the same day at 23:59 Istanbul time", () => {
        expect(istanbulDateOf(at("2026-11-22T20:59:00Z"))).toBe("2026-11-22");
    });

    it("moves to the next day at 00:01 Istanbul time", () => {
        expect(istanbulDateOf(at("2026-11-22T21:01:00Z"))).toBe("2026-11-23");
    });

    it("crosses the year boundary at Istanbul midnight", () => {
        expect(istanbulDateOf(at("2026-12-31T20:59:00Z"))).toBe("2026-12-31");
        expect(istanbulDateOf(at("2026-12-31T21:01:00Z"))).toBe("2027-01-01");
    });
});

describe("todayIstanbul", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("uses an injected clock", () => {
        expect(todayIstanbul(at("2026-11-22T20:59:00Z"))).toBe("2026-11-22");
        expect(todayIstanbul(at("2026-11-22T21:01:00Z"))).toBe("2026-11-23");
    });

    it("defaults to the system clock", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-22T21:01:00Z"));
        expect(todayIstanbul()).toBe("2026-11-23");
    });
});

describe("fromSlug", () => {
    it("converts DD-MM-YYYY to ISO", () => {
        expect(fromSlug("22-11-2026")).toBe("2026-11-22");
        expect(fromSlug("29-02-2028")).toBe("2028-02-29");
    });

    it("rejects malformed slugs", () => {
        expect(fromSlug("2026-11-22")).toBeNull();
        expect(fromSlug("1-1-2026")).toBeNull();
        expect(fromSlug("abc")).toBeNull();
        expect(fromSlug(" 22-11-2026")).toBeNull();
    });

    it("rejects dates that don't exist", () => {
        expect(fromSlug("31-02-2026")).toBeNull();
        expect(fromSlug("00-01-2026")).toBeNull();
        expect(fromSlug("01-13-2026")).toBeNull();
        expect(fromSlug("29-02-2027")).toBeNull();
    });
});

describe("toSlug", () => {
    it("converts ISO to DD-MM-YYYY", () => {
        expect(toSlug("2026-11-22")).toBe("22-11-2026");
    });

    it("round-trips with fromSlug", () => {
        expect(fromSlug(toSlug("2028-02-29"))).toBe("2028-02-29");
    });

    it("throws on invalid ISO dates", () => {
        expect(() => toSlug("22-11-2026")).toThrow();
        expect(() => toSlug("2026-02-30")).toThrow();
    });
});

describe("formatDisplayDate", () => {
    it("formats an ISO date as DD.MM.YYYY by default", () => {
        expect(formatDisplayDate("2026-11-23")).toBe("23.11.2026");
    });

    it("uses the given separator", () => {
        expect(formatDisplayDate("2026-11-23", "/")).toBe("23/11/2026");
    });

    it("throws on an invalid ISO date", () => {
        expect(() => formatDisplayDate("23-11-2026")).toThrow();
    });
});
