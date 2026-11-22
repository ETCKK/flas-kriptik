import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "flas-kriptik-game";
const ID = "t-001";

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
        store.getState().initCryptic(ID);
        expect(store.getState().games[ID]).toEqual({ status: "idle", unlockedHints: [] });

        store.getState().unlockHint(ID, "definition");
        store.getState().initCryptic(ID);
        expect(store.getState().games[ID].unlockedHints).toEqual(["definition"]);
    });

    it("startPlaying moves idle to playing and records the start time only once", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID);
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
        expect(store.getState().games[ID]).toEqual({ status: "idle", unlockedHints: ["fodder", "definition"] });
    });

    it("setWon only completes a game that is being played", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID);
        store.getState().setWon(ID);
        expect(store.getState().games[ID].status).toBe("idle");

        store.getState().startPlaying(ID);
        vi.advanceTimersByTime(90_000);
        store.getState().setWon(ID);
        const game = store.getState().games[ID];
        expect(game.status).toBe("won");
        expect(game.completedAt! - game.startedAt!).toBe(90_000);
    });

    it("a won game can't be won again or restarted", async () => {
        const store = await loadStore();
        store.getState().initCryptic(ID);
        store.getState().startPlaying(ID);
        store.getState().setWon(ID);
        const won = store.getState().games[ID];

        vi.advanceTimersByTime(1000);
        store.getState().setWon(ID);
        store.getState().startPlaying(ID);
        expect(store.getState().games[ID]).toEqual(won);
    });
});

describe("useGameStore persistence", () => {
    it("saves games to localStorage with version 2", async () => {
        const store = await loadStore();
        store.getState().unlockHint(ID, "indicators");
        expect(stored()).toEqual({ state: { games: { [ID]: { status: "idle", unlockedHints: ["indicators"] } } }, version: 2 });
    });

    it.each([0, 1])("converts hint indexes from a version %i save into hint types", async (version) => {
        const games = {
            [ID]: { status: "won", unlockedHints: [0, 2], startedAt: 1000, completedAt: 91_000 },
            "t-002": { status: "playing", unlockedHints: [1, 5], startedAt: 2000 },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version }));

        const store = await loadStore();
        expect(store.getState().games).toEqual({
            [ID]: { status: "won", unlockedHints: ["definition", "fodder"], startedAt: 1000, completedAt: 91_000 },
            "t-002": { status: "playing", unlockedHints: ["indicators"], startedAt: 2000 },
        });
        expect(stored().version).toBe(2);
    });

    it("restores a version 2 save unchanged", async () => {
        const games = { [ID]: { status: "playing", unlockedHints: ["fodder"], startedAt: 1000 } };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { games }, version: 2 }));

        const store = await loadStore();
        expect(store.getState().games).toEqual(games);
    });
});
