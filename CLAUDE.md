# Playte — Claude Code Reference

## What is Playte

Playte is a mobile-first multiplayer web app for ranking restaurant dishes as a group. A host creates a session, adds the dishes their table ordered, and everyone ranks them independently by dragging. When all rankings are in, the app reveals group results, individual player rankings, and a "Flavor Journey" with personalized insights (Most Loved dish, Nacho Type, Hot & Cold, Best Taste Buds).

---

## Node Version

**Always use Node 20.** The project uses `??=` and other modern syntax that breaks on the system default (Node 14).

```bash
source ~/.nvm/nvm.sh && nvm use 20
```

`.nvmrc` is set to `20`. All `npm` commands in this project require Node 20 to be active first.

---

## Running the App

```bash
source ~/.nvm/nvm.sh && nvm use 20
npm run dev         # starts Next.js dev server on localhost:3000
```

After schema or Prisma client changes, restart the dev server — Next.js caches the Prisma client and stale type errors will appear at runtime.

---

## Key Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | `prisma generate` + Next.js build |
| `npm test` | Run Vitest unit tests (once) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run dev:seed` | Seed a ranking-phase test session → prints direct URL |
| `npm run dev:seed:results` | Seed a results-phase session (4 extra players, all submitted) |

---

## Dev Workflow — Testing Pages Without Playing a Full Game

```bash
npm run dev:seed
```

Prints a URL like `http://localhost:3000/dev?session=...&player=...&token=...`. Open it to land directly on the rank page with 10 real dishes and a live session in the DB.

The `/dev` page sets all required `sessionStorage` keys and shows shortcut buttons to every section: rank, results, flavor journey, player list, lobby, waiting room.

For results pages specifically:

```bash
npm run dev:seed:results
```

Creates a session with 5 players (you + 4 others) who've all submitted randomized rankings. Drop directly into group results or flavor journey.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, full-stack) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 5 |
| Auth | Supabase (OAuth + custom email/password) |
| Realtime | Supabase Postgres changes (dish additions during ranking) |
| Styling | Tailwind CSS 4 |
| Drag & drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Testing | Vitest 4 |
| Script runner | `tsx` |

---

## Codebase Structure

```
src/
  app/
    page.tsx                        Landing page
    auth/                           Auth (sign up / log in)
    account/                        Account page (past & upcoming games)
    create/
      name/                         Step 1: player name
      restaurant/                   Step 2: restaurant search (Google Places)
      dishes/                       Step 3: add dishes (min 3)
      pin/                          Join code + save-for-later
    join/
      code/                         Enter join code
      name/                         Enter display name
    session/[id]/
      lobby/                        Waiting for players, host starts game
      rank/                         ★ Drag-to-rank page
      waiting/                      Waiting for other players to submit
      loading/                      Transition to results
      results/
        page.tsx                    Group results (podium + ranked list)
        flavor/                     Flavor Journey insights
        players/                    Player list with match %
        players/[playerId]/         Individual player's ranking
    dev/                            Dev shortcut page (local testing only)
    api/
      session/                      Create session
      session/[id]/                 Get session details
      session/[id]/dishes/          Add / delete dishes
      session/[id]/rank/            Submit rankings (triggers computeInsights)
      session/[id]/results/         Fetch results + insights for all views
      session/[id]/start/           Host starts ranking phase
      session/join/                 Join by code
      auth/                         Signup, save account
      account/history/              Upcoming + past games
      places/                       Google Places autocomplete

  lib/
    insights.ts                     ★ All scoring algorithms (pure functions)
    insights.test.ts                Vitest tests for scoring
    prisma/client.ts                Prisma client singleton
    supabase/client.ts              Supabase browser client
    supabase/server.ts              Supabase server client
    shareImage.ts                   html-to-image PNG generation

  components/
    ui/
      Podium.tsx                    Animated podium (top 3, tie-aware)
      AccountStatus.tsx             Corner account badge
      NameEntryScreen.tsx           Reusable name input
      ShareCards/
        PodiumShareCard.tsx         Off-screen card for share PNG
        FlavorJourneyShareCard.tsx  Off-screen card for flavor share

scripts/
  seed-dev.ts                       Dev seed (see above)

docs/
  specs/
    results-table.md                Group results spec (podium, ranked list, ties)
    results-players.md              Player list + individual ranking spec
    results-flavor.md               Flavor Journey spec (Most Loved, Nacho Type, Hot & Cold, Best Buds)
  design/
    Playte_PRD_v3.pdf               Full product requirements document
    Playte_ERD_v3.pdf               Entity relationship diagram
  archive/
    open_questions_resolved.md      Historical design decisions (join code format, auth, etc.)
    didnt-try-feature.md            Original "didn't try" implementation plan (fully shipped)

figma/
  01_landing.png … 13_waiting.png   Figma design screens (reference)

.claude/
  commands/
    spec.md                         /spec skill — write feature spec docs
    audit.md                        /audit skill — find bugs against spec
```

---

## Game Flow

```
host creates session
  → adds restaurant + dishes (min 3)
  → shares join code
players join (lobby phase) — can also join during ranking
host starts ranking → session.status = "ranking"
  → each player drags dishes to rank; can mark "didn't try"
  → host can add/remove dishes in real time
all players submit → session.status = "results"
  → computeInsights() runs once (stored in session_insights)
results pages available:
  → group ranked list (podium + list)
  → flavor journey (Most Loved, Nacho Type, Hot & Cold, Best Buds)
  → player list (match % bars)
  → individual player pages (their personal ranking)
```

---

## Data Model (Key Tables)

| Table | Purpose |
|---|---|
| `sessions` | One per game; holds `status`, `joinCode`, `restaurantId` |
| `session_players` | One per player per session; holds `guestToken`, `submittedAt`, `isHost` |
| `dishes` | Dishes for a session; `deletedAt` for soft delete |
| `rankings` | One row per player+dish; `rankPosition INT?` (null = skipped), `skipped BOOL` |
| `session_insights` | Computed once on last submission; JSON blobs for avg points, variance, best buds, etc. |
| `users` | Optional linked account (display name, email) |
| `user_session_links` | Links a `SessionPlayer` to a `User` account |

**Guest auth**: Players store `playerId` + `guestToken` in `sessionStorage`. API routes validate both for writes.

---

## Scoring Algorithms (`src/lib/insights.ts`)

All functions are pure (no DB calls). Tested in `src/lib/insights.test.ts`.

### Points
Player ranks N tried dishes → dish at position k earns `N - k + 1` points. Skipped dishes earn 0 pts. Average points per dish uses **all players** as denominator (skippers contribute 0).

### Group Ranking Order
Dishes sorted by average points descending. Ties share a position slot; list positions are sequential with no gaps (two dishes tied at #4 → next dish is #5, not #6).

### Most Loved
Highest average points. Tiebreak: dish with most #1 rankings (`firstCounts`).

### Nacho Type
Lowest average points (Most Loved excluded). Tiebreak: dish with most last-place rankings (`lastCounts`).

### Hot & Cold
Highest variance of **rank positions** (not points) among players who tried the dish. Requires ≥ 2 players to have tried it. `hotColdDetail.high` = min position (best), `hotColdDetail.low` = max position (worst). If no variance → card shows "No controversy" message.

### Match % / Spearman
`spearman(a, b)` — pure Spearman on shared tried dishes only. Returns `null` if fewer than 2 shared dishes (UI shows "didn't try the same dishes"). No overlap penalty.

`matchPercent = max(0, round(((rho + 1) / 2) × 100))`

### Best Buds
For each player, find highest Spearman match. `computeBestBuds()` in `insights.ts`. Null pair (< 2 shared dishes) scores 0. Two players can share the same best bud. If match < 10% → show fallback message.

---

## Prisma / Database

```bash
# After schema changes:
source ~/.nvm/nvm.sh && nvm use 20
npx prisma generate          # regenerate TS client (required after field changes)
npx prisma migrate dev       # create + apply migration (interactive, needs terminal)
npx prisma migrate deploy    # apply existing migrations (non-interactive, CI)

# If a migration was applied manually:
npx prisma migrate resolve --applied <migration_name>

# View DB in browser:
npx prisma studio
```

**Important**: After running `prisma generate`, restart the Next.js dev server or the stale client will cause TypeScript errors at runtime.

---

## sessionStorage Keys

The app uses `sessionStorage` (not cookies) to track identity. These keys are set by the join/create flow and read by every API call:

| Key | Value |
|---|---|
| `sessionId` | Active session UUID |
| `playerId` | This player's UUID |
| `guestToken` | Auth token for write operations |
| `joinCode` | Session join code |
| `userId` | Linked account ID (if logged in) |
| `restaurant_<sessionId>` | Cached restaurant name |
| `saved_<sessionId>` | `"1"` if saved to account |
| `saved_later_<sessionId>` | `"1"` if saved via "save for later" |

---

## Slash Commands (Claude Skills)

| Command | What it does |
|---|---|
| `/spec <feature-name>` | Survey user on desired behavior, write spec to `docs/spec-<feature>.md` |
| `/audit <feature-name>` | Read spec + full code path, produce numbered bug report with file:line refs |

---

## Environment Variables

See `.env.example`. Required:
- `DATABASE_URL` — Postgres connection string
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `GOOGLE_PLACES_API_KEY` — Restaurant search autocomplete

---

## Gotchas

- **Always use Node 20** — system default is Node 14, which breaks `??=` and other syntax.
- **Restart dev server after Prisma changes** — stale client causes runtime errors even if TypeScript compiles.
- **`prisma migrate dev` requires an interactive terminal** — use `--create-only` then `migrate deploy` in scripts.
- **DB already had columns from manual migration** — if migrate fails with "column already exists", use `prisma migrate resolve --applied`.
- **Results insights are computed once** — `computeInsights()` runs when the last player submits. To recompute during dev, delete the session and reseed, or manually delete the `session_insights` row.
- **`viewerId` query param** — results pages use `?viewerId=<playerId>` to personalize match % and Best Buds. Pass it when navigating between results pages or insights will be viewer-unaware.
