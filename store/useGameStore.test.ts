import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "flas-kriptik-game";
const ID = "t-001";
const DATE = "2027-01-01";

function createMemoryStorage(): Storage {
    const items = new Map<string, string>();
    return {
        get length() {
            return items.size;
        },
        clear: () => items.clear(),
        getItem: (key) => items.get(key) ?? null,
        key: (index) => [...items.keys()][index] ?? null,
        removeItem: (key) => {
            items.delete(key);
        },
        setItem: (key, value) => {
            items.set(key, String(value));
        },
    };
}

async function loadStore() {
    vi.resetModules();
    const { useGameStore } = await import("./useGameStore");
    return useGameStore;
}

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

beforeEach(() => {
    const storage = createMemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", { localStorage: storage });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T10:00:00Z"));
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("useGameStore transitions", () => {
    it("initCryptic creates an idle game once and never resets it", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        expect(store.getState().games[ID]).toEqual({ status: "idle", unlockedHints: [], activeMs: 0, publishDate: DATE });

        store.getState().unlockHint(ID, "definition");
        store.getState().initCryptic(ID, DATE);
        expect(store.getState().games[ID].unlockedHints).toEqual(["definition"]);
    });

    it("initCryptic fills a missing publishDate without resetting progress", async () => {
        const games = { [ID]: { status: "won", unlockedHints: ["fodder"], startedAt: 1000, completedAt: 61_000, activeMs: 42_000, solvedAsDaily: true } };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version: 4 }));

        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        expect(store.getState().games[ID]).toEqual({ ...games[ID], publishDate: DATE });
        expect(stored().state.games[ID].publishDate).toBe(DATE);
    });

    it("startPlaying moves idle to playing and records the start time only once", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().startPlaying(ID);
        const startedAt = Date.now();
        expect(store.getState().games[ID]).toMatchObject({ status: "playing", startedAt });

        vi.advanceTimersByTime(5000);
        store.getState().startPlaying(ID);
        expect(store.getState().games[ID].startedAt).toBe(startedAt);
    });

    it("startPlaying does nothing for an unknown puzzle", async () => {
        const store = await loadStore();
        store.getState().startPlaying(ID);
        expect(store.getState().games[ID]).toBeUndefined();
    });

    it("unlockHint records each hint once, and creates the game if needed", async () => {
        const store = await loadStore();
        store.getState().unlockHint(ID, "fodder");
        store.getState().unlockHint(ID, "definition");
        store.getState().unlockHint(ID, "fodder");
        expect(store.getState().games[ID]).toEqual({ status: "idle", unlockedHints: ["fodder", "definition"], activeMs: 0 });
    });

    it("addActiveTime adds up time only while the game is being played", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().addActiveTime(ID, 1000);
        expect(store.getState().games[ID].activeMs).toBe(0);

        store.getState().startPlaying(ID);
        store.getState().addActiveTime(ID, 1500);
        store.getState().addActiveTime(ID, 2500);
        expect(store.getState().games[ID].activeMs).toBe(4000);

        store.getState().setWon(ID, true);
        store.getState().addActiveTime(ID, 3000);
        expect(store.getState().games[ID].activeMs).toBe(4000);
    });

    it("addActiveTime ignores invalid amounts and unknown puzzles", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().startPlaying(ID);
        [0, -500, Number.NaN, Number.POSITIVE_INFINITY].forEach((ms) => store.getState().addActiveTime(ID, ms));
        expect(store.getState().games[ID].activeMs).toBe(0);

        store.getState().addActiveTime("unknown", 1000);
        expect(store.getState().games.unknown).toBeUndefined();
    });

    it("setWon only completes a game that is being played, and records the daily flag", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().setWon(ID, true);
        expect(store.getState().games[ID].status).toBe("idle");

        store.getState().startPlaying(ID);
        store.getState().setWon(ID, true);
        expect(store.getState().games[ID]).toMatchObject({ status: "won", solvedAsDaily: true, completedAt: Date.now() });
    });

    it("setWon records a non-daily solve", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().startPlaying(ID);
        store.getState().setWon(ID, false);
        expect(store.getState().games[ID].solvedAsDaily).toBe(false);
    });

    it("a won game can't be won again or restarted", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().startPlaying(ID);
        store.getState().setWon(ID, true);
        const won = store.getState().games[ID];

        vi.advanceTimersByTime(1000);
        store.getState().setWon(ID, false);
        store.getState().startPlaying(ID);
        expect(store.getState().games[ID]).toEqual(won);
    });
});

describe("useGameStore persistence", () => {
    it("saves games to localStorage with version 4", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID, DATE);
        store.getState().unlockHint(ID, "indicators");
        expect(stored()).toEqual({
            state: { games: { [ID]: { status: "idle", unlockedHints: ["indicators"], activeMs: 0, publishDate: DATE } } },
            version: 4,
        });
    });

    it.each([0, 1])("migrates a version %i save: hint types, estimated time, not daily", async (version) => {
        const games = {
            [ID]: { status: "won", unlockedHints: [0, 2], startedAt: 1000, completedAt: 91_000 },
            "t-002": { status: "playing", unlockedHints: [1, 5], startedAt: 2000 },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version }));

        const store = await loadStore();
        expect(store.getState().games).toEqual({
            [ID]: { status: "won", unlockedHints: ["definition", "fodder"], startedAt: 1000, completedAt: 91_000, activeMs: 90_000, solvedAsDaily: false },
            "t-002": { status: "playing", unlockedHints: ["indicators"], startedAt: 2000, activeMs: 0 },
        });
        expect(stored().version).toBe(4);
    });

    it.each([2, 3])("migrates a version %i save to version 4", async (version) => {
        const games = {
            [ID]: { status: "won", unlockedHints: ["fodder"], startedAt: 1000, completedAt: 31_000, publishDate: DATE },
            "t-002": { status: "playing", unlockedHints: [], startedAt: 2000 },
            "t-003": { status: "idle", unlockedHints: [] },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version }));

        const store = await loadStore();
        expect(store.getState().games).toEqual({
            [ID]: { ...games[ID], activeMs: 30_000, solvedAsDaily: false },
            "t-002": { ...games["t-002"], activeMs: 0 },
            "t-003": { ...games["t-003"], activeMs: 0 },
        });
        expect(stored().version).toBe(4);
    });

    it("restores a version 4 save unchanged", async () => {
        const games = {
            [ID]: { status: "won", unlockedHints: [], startedAt: 1000, completedAt: 999_000, activeMs: 45_000, solvedAsDaily: true, publishDate: DATE },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version: 4 }));

        const store = await loadStore();
        expect(store.getState().games).toEqual(games);
    });
});
