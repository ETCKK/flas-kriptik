# Flaş Kriptik

A Turkish daily mini cryptic puzzle web app with a spy-dossier theme. The UI text is Turkish; code identifiers are English.

**Roadmap and progress:** `docs/ROADMAP.md`. Read its Status section first, and update it at the end of every task.

## Commands

- `npm run dev`, `npm run build`, `npm start`
- `npm run lint`
- `npm test` (Vitest, single run)
- Typecheck: `npx tsc --noEmit --incremental false`. Without `--incremental false`, tsc writes `tsconfig.tsbuildinfo`.

## Stack

Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4, Zustand 5 (`persist`), zod 4, Vitest 5. Planned: Supabase (Postgres and Auth) and Vercel.

Next 16 specifics:
- route `params` are Promises
- middleware is now `proxy.ts`

## Structure

- `app/`: routes.
  - `/` shows the envelope teaser.
  - `/kriptik/bugun` is today's puzzle.
  - `/kriptik/[slug]` takes a `DD-MM-YYYY` date or a puzzle number. Future puzzles are a 404.
  - `/arsiv`, `/ogren` and `/profil` are placeholders.
- `components/cryptic/`: the game.
  - `CrypticBoard` is the client-side orchestrator.
  - `CrypticPaper` is the paper frame with tabs.
  - `pages/` holds the Clue, Stats and Explanation pages.
  - `HintMenu`, `Keyboard`, `AnswerGrid`, `LetterBox` and `Clue` are the main pieces.
- `components/ui/`: shared primitives. `Button` has variants. `Construction` is the placeholder page.
- `lib/cryptic/`:
  - `repository.ts`: data access, and the place where the database will plug in
  - `index.ts`: getters and `checkAnswer`
  - `normalize.ts`, `hints.ts`, `clueChunks.ts`: pure helpers
  - `schema.ts`: the zod puzzle schema, to be reused by the admin page
- `store/useGameStore.ts`: per-puzzle progress in localStorage under the key `flas-kriptik-game`, schema version 3. Each game keeps its puzzle's `publishDate`.
- `data/cryptic/`: only the example puzzle. Real puzzles will live in the database.
- `types/`: shared types.

## Puzzle model

- A puzzle has a unique positive `number` and a `publishDate`: an ISO `YYYY-MM-DD` date, or null for a draft. Pages receive `PublishedCryptic`, whose date is never null.
- A puzzle has exactly one `definition: { target, hint }`.
- `indicators` and `fodder` are optional `{ targets, hint }` groups. Include a group only if it has at least one target.
- Always write "fodder", never "fodders".
- Hints aren't stored. `getHints()` derives one hint per word type that has words, in the order definition, indicators, fodder. Their Turkish labels are tanım, yönerge and malzeme.
- Unlocked hints are stored by `HintType`, not by index.
- `answer` is lowercase NFC Turkish letters only, and `length` must equal its letter count. Every target must appear in the clue. `crypticSchema` enforces all of this.

## Product decisions

Don't propose alternatives to these unless asked.

- Answers are sent to the client on purpose, for instant checking.
- The day changes at midnight Europe/Istanbul time. A streak only counts puzzles solved on their publish day.
- There's no "reveal answer". Letter hints are planned instead.
- Guests play with local progress. Signing in is optional, and syncs and merges progress without losing any.
- Puzzles are entered only through the admin page into the database.

## Conventions

- No code comments.
- 4-space indentation, double quotes, semicolons. Components are default exports.
- Type files define interfaces, then `export type { … }` at the end.
- Turkish text:
  - lowercase with `toLocaleLowerCase("tr-TR")` and normalize to NFC
  - compare answers only through `normalizeAnswer`
- Client components import puzzle helpers from `lib/cryptic/normalize`, `hints` or `clueChunks`, never from `lib/cryptic` (index). The index pulls in the repository and all puzzle data.
- Any change to the persisted store shape needs three things: bump `version`, extend `migrateGameState`, and add a migration test.
- Interactive UI that is visually hidden must be `inert`, so it can't be reached by keyboard.
- Tailwind theme colors are tokens in `app/globals.css` (`@theme`).

## Tests

- Tests sit next to the code as `*.test.ts` and run in the Node environment (`vitest.config.mts` sets the `@/` alias).
- Zustand's `persist` reads `window.localStorage`, so store tests stub both `window` and `localStorage`.
- Every puzzle in `data/cryptic` must pass `crypticCollectionSchema`.
- Playwright isn't a project dependency. Ask before adding browser-test tooling.

## Workflow

- Work on one roadmap task at a time, then stop for review before the next.
- Don't commit unless asked. Never commit, stash, discard or edit the user's uncommitted work. The user manages branches.
- Ask before adding or upgrading dependencies.
- Before reporting a task as done, run `npm run lint`, `npm test`, the typecheck and `npm run build`.
- Commit messages: a short lowercase summary, optionally followed by `- ` bullet lines. No type prefixes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
