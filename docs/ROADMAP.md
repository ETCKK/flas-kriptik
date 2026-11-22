# Flaş Kriptik Roadmap

## Status

- **Branch:** `feat/development-foundation`, off `main`. No `develop` branch exists yet.
- **Done:** Phase 0 and Phase 1 (T1.1–T1.4).
- **Next:** T2.1 (Supabase and Vercel setup).
- **Not yet checked on a real device (from T0.2):** on-screen keys and letter boxes respond to phone taps, real Ctrl+R reloads without typing, and Firefox/Safari behave the same.

## Known issues and quirks

Record anything found but not fixed here, and remove it when it's fixed or scheduled as a task.

- **Settings dialog focus leak:** the closed `SettingsPanel` dialog can still be reached with Tab. It needs `inert` if the panel comes back into the nav.
- **npm audit:** it reports 11 vulnerabilities that existed before this work.
- **Hint targets match inside other words.** Highlighting uses `indexOf`, so the target "at" also underlines the "at" in "kat", and it's case-sensitive. The authoring preview (T3.3) should make this visible, or matching should move to whole words.
- **A day with no puzzle breaks streaks.** The streak counts consecutive calendar days, so a gap in the schedule resets everyone. Authors should leave no gaps (T5.7); if that fails, the streak could count published days instead.
- **Old wins don't count toward the streak.** Saves from before version 4 can't prove a win was the daily clue, so they're marked `solvedAsDaily: false`. Only example-puzzle saves exist, so nothing real is lost.
- **Turkish glyphs in the font:** Special Elite may not include Ğ, Ş, İ and ı, so they could fall back to `monospace`. Check this in T5.6.
- **Answers are visible in the page payload.** This is intentional (Decision 1), and it's why gating future puzzles (T1.2, T2.2) is the main protection against leaks.

## How to use this file

1. Take the first unchecked task. Start it in plan mode and write the detailed step-by-step plan there.
2. Implement only that task, run the checks, and stop for review.
3. When the task is finished, in the same commit:
   - tick it and shorten it to one line saying what changed
   - add any new decisions to **Decisions**, with the date and the reason
   - add anything found but not fixed to **Known issues and quirks**
   - update **Status**
   - add the previous task's commit hash to its line, since a commit can't contain its own hash
4. If priorities change, edit this file first, then work. Don't renumber task IDs; give new tasks new ones (for example T1.5).

Difficulty: **S** is under 2h, **M** is half a day to a day, **L** is several days.

## Decisions

All decided on 2026-11-22 unless a date says otherwise.

1. **Answers ship to the client** so checking is instant without a network round trip. Competition stays low: there might be a friends-only leaderboard later, but never a global one.
2. **The day changes at midnight Europe/Istanbul time**, because the players are in Turkey. A streak only counts clues **solved as the daily clue**: the puzzle page was loaded while its `publishDate` was today, whichever route was used. The server sets this flag (`isDaily`) and the save stores it as `solvedAsDaily` at win time. Loading at 23:58 and solving at 00:02 counts; reopening a clue on a later day doesn't. There's no cap for a tab left open (2026-11-23).
3. **Puzzles live only in the database.** They're entered through an in-app admin page (`/yonetim`) by 2–4 authors, and 50–100 should be ready before launch. The repo keeps only the example puzzle.
4. **Accounts are optional.** Guests play with local progress. Signing in (Google or a passwordless email link/code) syncs progress across devices, and local progress is merged on sign-in without ever being lost. Cross-device sync is a launch goal; the leaderboard isn't.
5. **No "reveal answer".** Letter hints are planned instead (T5.1), so players get closer to the answer rather than giving up. The timer counts **active time** only: while the puzzle is being played and the tab is visible (2026-11-23).
6. **Stack:** Vercel and Supabase (Postgres and Auth), on free tiers early on. Data access goes through repository modules so the app isn't tied to Supabase. Row-level security protects user progress and unpublished puzzles.
7. **Hint model:**
   - A puzzle has exactly one `definition` (`{ target, hint }`).
   - `indicators` and `fodder` are optional groups (`{ targets, hint }`), each with at least one target when present.
   - There's one hint per word type that has words, and that hint's text covers all of its words. Hints are derived with `getHints()` and stored as unlocked by type, because positions would shift when a puzzle leaves out a word type.
8. **Saves are versioned**, so players never lose progress when the save format changes. The persisted store is at version 4. Every change to its shape bumps the version and adds a migration with a test.
9. **`server-only` guards the repository** (2026-11-22). `lib/cryptic/repository.ts` imports it, so the build fails if client code ever pulls in the puzzle archive. Tests that import the repository mock it with `vi.mock("server-only", () => ({}))`.
10. **The example puzzle is only "today" in `next dev`** (2026-11-22). It's a draft (`publishDate: null`), and the repository dates it today when `NODE_ENV` is `development`. In production builds and tests it's never published, so the home page shows the empty state.
11. **Puzzles have a public `number`** (2026-11-22), added in T1.2 rather than T1.3, so slugs can take a date or a number. Ids are internal and aren't accepted as slugs.
12. **`publishDate` is an ISO date or null** (2026-11-23). Null means a draft, matching `publish_date date null`. Getters return `PublishedCryptic` (`publishDate: string`), so components never handle a missing date. Each saved game keeps its `publishDate` for the archive and sync. Saves from before version 3 get it the next time the puzzle opens, since the migration can't know it.

13. **Streak anchor** (2026-11-23). `computeStreak(games, today)` counts consecutive calendar days of daily solves ending today, or yesterday if today isn't solved yet, so the streak stays alive until today's clue is missed. On the client, today comes from the browser clock; the server version (T4.4) uses server time.

## Target architecture

- **Data access:** `server-only` repositories (`lib/cryptic/repository.ts`, later `lib/progress/repository.ts`) are used only from Server Components and Server Actions, and they return the app's own types.
  - They're implemented with `@supabase/ssr` using the user's session, so row-level security applies to server code too.
  - Client code uses Supabase only for signing in.
- **Tables** (SQL migrations in `supabase/migrations/`; types from `supabase gen types`):
  - **`puzzles`:**
    - `id uuid`, `number int unique`, `publish_date date unique null` (null means a draft)
    - `clue`, `answer`, `length`, `difficulty`, `author_name`, `explanation`
    - `definition jsonb not null`, `indicators jsonb null`, `fodder jsonb null`
    - `created_by`, `created_at`, `updated_at`
  - **`profiles`:** `user_id`, `display_name`, `role` (`player | author | admin`; users can't change their own role).
  - **`game_progress`:** `(user_id, puzzle_id)` as the primary key, `status`, `unlocked_hints text[]`, `revealed_letters int[]`, `active_ms int`, `solved_as_daily bool`, `started_at`, `completed_at`, `updated_at`.
- **Row-level security:**
  - Anyone can read a puzzle only when `publish_date <= (now() at time zone 'Europe/Istanbul')::date`. Authors and admins can read everything.
  - Users read and write only their own progress, and only for published puzzles.
- **Rendering:** `/` and `/kriptik/bugun` render per request (`await connection()`).
- **Auth:** Supabase Auth with Google and an email OTP or magic link. Next 16's `proxy.ts` refreshes the session. Guests need no session at all.
- **Sync rules:**
  - **Reading and writing:** the UI always reads from the local store. Signed-in changes are written locally first, then sent to the server through a Server Action. Each record has a `dirty` flag that clears once the server confirms, and anything still dirty is retried on load, on focus and when the connection returns.
  - **Merging on sign-in, per puzzle:**
    - status rank is `won > playing > idle`, and the higher one wins
    - if both are won, keep the record with the earliest `completedAt`, and never change it again
    - if both are playing, take the union of hints and revealed letters, the earliest `startedAt` and the larger `activeMs`
  - **Where the merge runs:** on the server, in one transaction. Local data is cleared only after the server confirms.
  - **Server checks:** the puzzle must be published, a won row is never rewritten, and `completed_at` is clamped so it isn't in the future or before the publish day. `recordWin` re-checks the answer without the UI waiting for it.
  - **Streak:** one pure function, `computeStreak(games, today)` over `solvedAsDaily` wins, used both for guests and for signed-in users. T4.3 decides how the server verifies `solved_as_daily` (for example, `recordWin` checks the publish date against its own clock).
  - **Sign-out:** push any dirty records first, then clear the local copy.

## Tasks

### Phase 0: Cleanup and safety net

- [x] **T0.2 Correctness and lint fixes** (`64dc333`). Hidden hint menu and keyboard are `inert`. Modifier keys are ignored. On-screen keys and letter boxes no longer take focus. Timeouts are cleared. The store is versioned. Lint is clean.
- [x] **T0.3 Schema and tests** (`8062684`). Added a zod puzzle schema (`lib/cryptic/schema.ts`, Turkish messages, rejects unknown fields) and Vitest tests. `normalizeAnswer` and the clue highlighting moved into their own modules. Added zod and vitest; `@types/node` is now `^22`.
- [x] **Hint restructure** (`8062684`). One definition, optional `indicators` and `fodder`, one hint per word type (`lib/cryptic/hints.ts`). Unlocked hints are stored by type, and saves migrate to version 2. Renamed `fodders` to `fodder` and removed the unused index-based hint lookup.

### Phase 1: Daily foundation (still on local example data)

- [x] **T1.1 Istanbul date utilities** (`bf912b7`). Added a pure `lib/date.ts` (`istanbulDateOf`, `todayIstanbul(now?)`, `fromSlug` returns `null` for bad or impossible dates, `toSlug` throws on invalid ISO) with tests covering 23:59/00:01 and the year boundary.
- [x] **T1.2 Real "today", gating and empty state** (`9808550`). Today is the Istanbul date, and `/` and `/kriptik/bugun` render per request. Slugs take a date or a puzzle `number` (`lib/cryptic/slug.ts`), and anything after today is a 404. With no puzzle today, `/` shows "Bugün dosya yok" and `/kriptik/bugun` redirects to `/`. Added `number` to `Cryptic`, a `server-only` repository and gated getters (`getPublishedByDate`, `getPublishedByNumber`, `checkAnswer`). Id slugs no longer work.
- [x] **T1.3 Data model fields** (`7c6fece`). `date` became an ISO `publishDate` (null is a draft, validated with `z.iso.date()`), and pages receive `PublishedCryptic`. The share text is built by `lib/cryptic/share.ts` from `number`. Saved games store `publishDate` (store version 3, filled on the next open for older saves). Dates are shown with `formatDisplayDate`.
- [x] **T1.4 Daily-solve streak and active-time timer.** Puzzle pages get `isDaily` from the server (`publishDate === today`), and a win saves `solvedAsDaily`. `lib/progress/streak.ts` counts consecutive daily solves (alive through yesterday). `useActiveTimer` counts time only while playing with the tab visible (`activeMs`). Store version 4. `DUMMY_STREAK` is gone; added `addDays`.

### Phase 2: Supabase for puzzles (deploy early)

- [ ] **T2.1 Supabase and Vercel setup (M)**
  - **What:**
    - the Supabase CLI, a local stack, and `supabase/migrations/`
    - environment variables (URL and anon/publishable key only)
    - `lib/supabase/{server,browser}.ts`
    - Vercel Preview and Production, each pointing at its own Supabase project
  - **Done when:** a preview deploy renders the home page from Supabase.
- [ ] **T2.2 `puzzles` and `profiles` with row-level security (M). Depends on T2.1.**
  - **What:** the migration and policies described above. `supabase/seed.sql` contains only the example puzzle. Add RLS tests (pgTAP or a script that uses the anon key).
  - **Done when:** the anon key can't read tomorrow's puzzle or a draft, and a player can't change their own role.
- [ ] **T2.3 Swap the repository to Supabase (S–M). Depends on T2.2 and T1.2.**
  - **What:** map rows to `Cryptic`, validated with the schema. The example puzzle is kept only as seed and test data.
  - **Done when:** the pages are unchanged, and `.next/static` doesn't contain a bundled archive of answers.

### Phase 3: Authoring (`/yonetim`)

- [ ] **T3.1 Auth foundation and role gate (M). Depends on T2.2.**
  - **What:** `proxy.ts`, a `/giris` page with Google and an email OTP, and a server-side role check in `app/yonetim/layout.tsx`. Roles are assigned by hand in SQL at first.
  - **Done when:** a player is redirected from `/yonetim`, an author gets in, and gameplay works without a session.
- [ ] **T3.2 Puzzle list and schedule calendar (M). Depends on T3.1.**
  - **What:** each puzzle's status (draft, scheduled or published), with gaps in the next 30 days highlighted.
  - **Done when:** drafts, scheduled and published puzzles are labeled, and every unscheduled day in the next 30 days is visible.
- [ ] **T3.3 Create and edit form with live preview (L). Depends on T3.2.**
  - **What:**
    - role-checked Server Actions, plus the zod schema on both the client and the server
    - a preview using the real `Clue` component with every target highlighted
    - unique publish dates
    - `answer`, `length` and the word groups are locked once a puzzle is published
  - **Done when:** an invalid puzzle can't be saved, and a valid one appears on its date.

### Phase 4: Player accounts and sync

- [ ] **T4.1 Optional sign-in (M). Depends on T3.1.**
  - **What:** `/profil` shows sign-in or the account. After a win, a non-blocking "İlerlemeni kaydet" prompt appears. Sign-in never interrupts a puzzle.
  - **Done when:** a guest can finish a puzzle without seeing any auth UI, and signing in from the stats page brings the player back there.
- [ ] **T4.2 `game_progress` table with row-level security (S). Depends on T2.2.**
  - **Done when:** user A can't read or write user B's rows, and nobody can write progress for an unpublished puzzle.
- [ ] **T4.3 Sync engine (L). Depends on T4.1 and T4.2.**
  - **What:**
    - a pure `lib/progress/merge.ts`, tested
    - `lib/progress/repository.ts`
    - `actions/progress.ts` with `syncProgress`, `recordProgress` and `recordWin`
    - a Postgres merge function
    - a `dirty` queue in the store
  - **Done when** these pass as tests and in a manual two-browser check:
    - a guest's progress survives signing up
    - signing in on a second device merges correctly
    - going offline loses nothing
    - a win is never downgraded
    - sign-out is blocked while data is still unsynced
- [ ] **T4.4 Server-side streak (S). Depends on T4.3 and T1.4.**
  - **Done when:** the streak is the same on both devices.

### Phase 5: Launch features and polish

- [ ] **T5.1 Letter hints (M).**
  - **What:** a `revealedLetters` field in the store and the database, a "Harf al" entry in `HintMenu`, revealed boxes locked in `AnswerGrid`, and the count shown in the stats and the share text. The rules are still open (Q1).
  - **Done when:** a revealed letter survives a reload and a sync, and can't be overwritten or deleted.
- [ ] **T5.2 Archive `/arsiv` (M). Depends on T2.3.**
  - **What:** puzzles published before today, newest first, paginated, with the player's status for each. Today's clue isn't listed; it's reached as the daily clue.
  - **Done when:** today's and future puzzles never appear, every entry opens `/kriptik/DD-MM-YYYY`, and solving an archive puzzle doesn't affect the streak.
- [ ] **T5.3 Full breakdown on the explanation page (S).**
  - **What:** after a win, highlight every target and show all the hint texts.
  - **Done when:** the full breakdown shows regardless of which hints the player used.
- [ ] **T5.4 Metadata, OG image, favicon, `app/error.tsx` and a loading state (S).**
  - **Done when:** each page has a Turkish title and description, a shared link shows a preview, the tab has an icon, and a thrown error shows a themed error page instead of a crash.
- [ ] **T5.5 Learning page `/ogren` (M, mostly content).**
  - **What:** explain tanım, yönerge and malzeme with the same underline styles as the game, and possibly one annotated example.
  - **Done when:** the placeholder is gone and the page uses the real `Clue` component for its examples.
- [ ] **T5.6 Accessibility and font pass (S–M).**
  - **What:**
    - give `HintMenu` dialog semantics
    - announce right and wrong answers through an `aria-live` region
    - make letter boxes announce their values
    - support `prefers-reduced-motion` and skipping the intro
    - check that Special Elite renders Ğ, Ş, İ and ı
  - **Done when:** a screen reader announces the hint menu as a dialog, each letter box's value and the result of each guess; reduced motion skips the animations; and Turkish letters render in the typewriter font.
- [ ] **T5.7 Content readiness (not dev work).** Authors schedule 50–100 puzzles with no gaps.

### Later

- A friends leaderboard
- A settings panel
- Multi-word answers such as `(4,5)`
- Caching today's puzzle per date
- A PWA or offline mode

## Verification for every task

- `npm run lint`, `npm test`, `npx tsc --noEmit --incremental false` and `npm run build` all pass. From Phase 2 on, so does `supabase test db`.
- In the build output, `/` and `/kriptik/bugun` are dynamic (from T1.2 on).
- `.next/static` contains no answers from other days (from T2.3 on).
- Manual check at 375px width, on a Vercel preview once one exists: envelope → solve with and without hints → stats → share → explanation → reload. Once sync exists, also check on a second device.

## Open questions

1. **Letter hints:**
   - Does the player pick the box, or does the next unrevealed letter open?
   - Is there a maximum?
   - Does using one rule out the "Kusursuz Çözüm" message?
2. **Author name:** free text on the puzzle (pen names), or linked to the author's profile?
3. **Multi-word answers:** if authors will write them, enumeration support has to come before T3.3, because it changes the schema.
