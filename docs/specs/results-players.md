# Spec: Player List and Individual Player Ranking Pages

## Overview

Two pages let users explore how each individual player ranked the dishes.

1. **Player List page** (`/session/[id]/results/players`) — shows all players as cards with a match percentage bar indicating how similar each player's taste is to the viewer's. The viewer's own card shows no percentage.

2. **Individual Player page** (`/session/[id]/results/players/[playerId]`) — shows a specific player's full personal ranking: their ranked dishes in order (podium + list), followed by a "didn't try" section of dishes they skipped.

Both pages are viewer-aware: the viewer identity is read from `viewerId` in the query string, falling back to `sessionStorage.getItem("playerId")`.

---

## Data Flow

### Player List page

1. On mount, the page reads the viewer's player ID from `?viewerId` or `sessionStorage`.
2. Fetches `GET /api/session/[id]/results?playerId={viewerId}`.
3. The API computes live Spearman match % between the viewer and every other player using only **shared tried dishes** (see Algorithm below), replacing the pre-computed `playerCorrelations` value in the response.
4. Players are split into "me" (viewer) and "others" and rendered in that order: viewer first, then all others.

### Individual Player page

1. On mount, fetches `GET /api/session/[id]/results` (no `playerId` param).
2. Finds the target player in `response.players` by matching `playerId` from the URL.
3. Renders `player.rankedDishes` (sorted by `position` ascending) and `player.skippedDishes`.

### API — per-player data construction

In `GET /api/session/[id]/results`:

- All `Ranking` rows for the session are fetched.
- Rows with `skipped = true` or `rankPosition = null` → added to `skippedByPlayer[playerId]`.
- Rows with `skipped = false` and `rankPosition != null` → added to `byPlayer[playerId]` as `{ [dishId]: rankPosition }`.
- For each player, `rankedDishes` = dishes with a rank position, sorted ascending by `position`.
- `skippedDishes` = dishes whose ID appears in `skippedByPlayer[playerId]`.
- If a `viewerPlayerId` is present, `matchPercent` for each other player is recalculated live via `spearman(viewerRanks, playerRanks)` (shared dishes only). The viewer's own card gets `matchPercent = null` (unused, not displayed).

---

## Algorithm

### Match Percentage (Spearman on shared tried dishes)

Match % between viewer V and player P:

1. Collect `sharedDishes` = dish IDs that **both** V and P have a non-null, non-skipped `rankPosition` for.
2. If `|sharedDishes| < 2`, the match % **cannot be computed** — display the message "didn't try the same dishes" instead of a percentage bar.
3. For each shared dish, compute the rank difference `d = V.rankPosition[dish] - P.rankPosition[dish]`.
4. Spearman correlation: `rho = 1 - (6 * sum(d²)) / (n * (n² - 1))` where `n = |sharedDishes|`.
5. Normalize to 0–100: `matchPercent = max(0, round(((rho + 1) / 2) * 100))`.

This is **pure Spearman on shared dishes only** — no overlap penalty, no adjustment for dishes one player tried but the other skipped. The match % computed here must exactly match the Best Buds match % in the Flavor Journey page for the same pair of players.

Dishes tried by one player but skipped by the other are **ignored entirely** — they do not appear in the shared set and incur no penalty.

### Numeric Example

Viewer (Alice) and Bob, 5 total dishes: Pasta, Salad, Pizza, Tacos, Soup.

- Alice tried: Pasta (#1), Salad (#2), Pizza (#3). Skipped: Tacos, Soup.
- Bob tried: Pasta (#1), Tacos (#2), Soup (#3). Skipped: Salad, Pizza.

Shared dishes = {Pasta} — only 1 shared dish, `n < 2` → display "didn't try the same dishes".

---

Second example with more overlap:

- Alice: Pasta (#1), Salad (#2), Pizza (#3), Tacos (#4).
- Bob: Pasta (#1), Salad (#3), Pizza (#2), Tacos (#4).

Shared dishes: all 4. `n = 4`.

| Dish   | Alice rank | Bob rank | d  | d²  |
|--------|-----------|----------|----|-----|
| Pasta  | 1         | 1        | 0  | 0   |
| Salad  | 2         | 3        | -1 | 1   |
| Pizza  | 3         | 2        | 1  | 1   |
| Tacos  | 4         | 4        | 0  | 0   |

`sum(d²) = 2`, `rho = 1 - (6 × 2) / (4 × 15) = 1 - 12/60 = 1 - 0.2 = 0.8`

`matchPercent = round(((0.8 + 1) / 2) × 100) = round(90) = **90%**`

---

## UI Requirements

### Player List page (`/session/[id]/results/players`)

**Header:**
- Playte logo (links to `/`).
- Restaurant name in italic gray.
- Heading: "playters" in red.

**Player cards:**
- The viewer's own card appears first, labeled with `(you)` in gray next to their name.
- The viewer's card has **no match % bar** — just the name.
- Every other player's card either:
  - Shows a horizontal progress bar filled to `matchPercent`% with the label `"{matchPercent}% match"` centered inside (when `n >= 2` shared dishes).
  - Shows the text "didn't try the same dishes" in italic gray (when fewer than 2 shared dishes exist between viewer and that player).
- Tapping any card navigates to `/session/[id]/results/players/[playerId]`.
- Each card has a red circular avatar placeholder (Playte logo icon) on the right.

**Bottom action bar:**
- "table results" button → `/session/[id]/results`
- "flavor journey" button → `/session/[id]/results/flavor`
- "save to account" button (same behavior as group results page).
- `@letsplayte` Instagram attribution link.

### Individual Player page (`/session/[id]/results/players/[playerId]`)

**Header:**
- Back button "← individual rankings" (navigates back).
- Long Playte logo image.
- Restaurant name in italic gray.
- Player avatar (red circle with logo) + `@{displayName}` in red.

**Ranked dishes:**
- Top 3 → `<Podium>` component (same as group results, but using `player.rankedDishes`).
- Dishes 4+ → numbered list with rank number (red) and dish name in rounded yellow-bordered card.
- Rank numbers are the player's personal rank positions (1, 2, 3, 4... sequential per the player's own ordering).

**Didn't try section:**
- Appears below the ranked list if `player.skippedDishes.length > 0`.
- Section label: "didn't try" in italic gray, centered.
- Each skipped dish in a gray-bordered, gray-text rounded card, with no rank number (blank spacer where the number would be).
- These are the **viewed player's** skipped dishes — not the viewer's.

**Share button:**
- "share my rankings" → generates PNG of `<PodiumShareCard>` showing the viewed player's dishes.

---

## Edge Cases & Rules

1. If the viewer is viewing their own individual page, the displayed "didn't try" section shows their own skipped dishes, because the data is `player.skippedDishes` for the player whose page it is.
2. If two players share fewer than 2 tried dishes, the match % bar is replaced with the message "didn't try the same dishes". This is enforced in the API when building `matchPercent`.
3. Dishes tried by one player but not the other are **excluded** from the Spearman calculation entirely — they do not affect the correlation, and they do not appear in the shared set.
4. If a player never submitted (no `submittedAt`), they have no `Ranking` rows. Their `rankedDishes` and `skippedDishes` arrays will both be empty.
5. A player with no skipped dishes will have no "didn't try" section on their individual page.
6. Display names: the API prefers `user.displayName` (linked account name) over `sessionPlayer.displayName` (name at join time). The individual page renders `@{player.displayName}`.
7. The `viewerId` query param is passed through when navigating from the player list to the flavor journey and group results pages so viewer context is preserved.
8. The match % bar width is capped at 100% by the `width: ${player.matchPercent}%` CSS. The match % value is already bounded to 0–100 by the `spearman()` function.
9. Players are not sorted by match % — they appear in the order returned by the API (which reflects DB insertion/join order). The viewer's card is pinned to the top regardless of order.
10. The individual player page does NOT show the match % between the viewer and the viewed player. To see match %, use the player list page.
11. The match % shown on the player list page must be identical to the match % shown in the Best Buds card on the Flavor Journey page for the same viewer-player pair. Both use pure Spearman on shared tried dishes with no overlap penalty.

---

## Files

| File | Role |
|------|------|
| `src/app/session/[id]/results/players/page.tsx` | Player list page: renders player cards with match % |
| `src/app/session/[id]/results/players/[playerId]/page.tsx` | Individual player page: ranked dishes + didn't try section |
| `src/app/api/session/[id]/results/route.ts` | API: assembles per-player ranked/skipped dish lists; computes live Spearman if viewerPlayerId present |
| `src/lib/insights.ts` | `spearman()` function |
| `src/components/ui/Podium.tsx` | Podium component (reused for individual player top 3) |
| `prisma/schema.prisma` | `Ranking` (rank_position, skipped), `SessionPlayer`, `Dish` models |

---

## Known Bugs / Discrepancies

1. **Individual player page passes no `viewerId` to the API.** `src/app/session/[id]/results/players/[playerId]/page.tsx` fetches `/api/session/${id}/results` without a `playerId` query param (line 23). This means the API cannot compute live Spearman between the viewer and other players for this page — it falls back to pre-computed `playerCorrelations` (viewer vs. group consensus). This does not affect the ranked/skipped dish display but would be wrong if match % were surfaced here.

2. **`computeBestBuds` applies an overlap penalty not in the spec.** `computeBestBuds` in `insights.ts` computes `corr = Math.round(rawMatch * overlapRatio)` (Spearman × shared/union). The live player list computation uses pure `spearman()` with no overlap penalty. Per spec, both the player list match % and the Best Buds match % must use pure Spearman on shared dishes only, with no overlap penalty. The `computeBestBuds` implementation must be corrected to match.

3. **`< 2` shared dishes returns 50 instead of a message signal.** The current `spearman()` function returns 50 when `n < 2`. Per spec, the API should detect this case and return a null or sentinel `matchPercent` so the UI can render the "didn't try the same dishes" message instead of a percentage bar.

4. **Podium on the individual player page does not handle ties.** Same issue as the group results page: if a player ranked two dishes identically (which cannot happen under normal submission but could occur in edge data), the podium would silently show one per slot. In practice, each player assigns unique rank positions, so this is low risk.

5. **The player list page does not sort players by match %.** The spec does not require a sort order, but auditors should be aware that the list order is arbitrary (DB insertion order) — the viewer's card is always first, but other players are unsorted.
