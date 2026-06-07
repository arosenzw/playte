# Spec: Flavor Journey Insights Page

## Overview

The Flavor Journey page (`/session/[id]/results/flavor`) shows four viewer-personalized insight cards summarizing the group's dining experience: Most Loved, Nacho Type, Hot & Cold, and Best (Taste) Buds. The first three cards are group-level insights about dishes; Best Buds is specific to the viewer.

Insights are computed once, when the last player submits, and stored in the `session_insights` table. The API reads from this pre-computed data and augments it with live counts and viewer-specific Best Bud lookup.

---

## Data Flow

1. **At submission time**: `computeInsights(sessionId)` in `src/app/api/session/[id]/rank/route.ts` runs once when all players have submitted. It computes and upserts the following into `session_insights`:
   - `most_loved_dish_id` — dish ID with highest avg points (tiebreak: most #1 rankings).
   - `nacho_type_dish_id` — dish ID with lowest avg points (tiebreak: most last-place rankings).
   - `hot_cold_dish_id` — dish ID with highest variance in rank positions among players who tried it.
   - `dish_avg_ranks` — JSON `{ [dishId]: avgPoints }`.
   - `dish_rank_variance` — JSON `{ [dishId]: variance }`.
   - `player_correlations` — JSON `{ [playerId]: spearmanVsConsensus }`.
   - `player_best_buds` — JSON `{ [playerId]: { playerId, match } }`.
   - `hot_cold_detail` — JSON `{ high, low }` storing the best and worst rank positions for the hot/cold dish.

2. **At read time**: `GET /api/session/[id]/results?playerId={viewerId}` returns an `insights` object:
   - `mostLoved: { id, name, count }` — `count` = number of players who ranked this dish at position #1.
   - `nachoType: { id, name, count }` — `count` = number of players who ranked this dish at their personal last position.
   - `hotCold: { id, name, highRank, lowRank } | null` — best and worst rank positions assigned to this dish; null if no dish has variance > 0.
   - `bestBud: { displayName, matchPercent } | null` — viewer's best bud looked up from `playerBestBuds[viewerId]`.

3. The Flavor Journey page (`flavor/page.tsx`) fetches the results endpoint with the viewer's player ID and renders one `InsightCard` per insight.

---

## Algorithm

### Most Loved

**Goal**: Find the dish most loved by the group.

1. For each player's submitted ranking, compute average points per dish across all players (same points conversion as the group table: player ranks N dishes, dish #1 gets N pts, dish #N gets 1 pt, skipped → 0 pts).
2. Select the dish with the **highest average points**.
3. **Tiebreak**: If two or more dishes share the highest average points, pick the one that was ranked **#1 most often** (`firstCounts` — the count of players who placed this dish at their personal rank position #1). Higher `firstCounts` wins.
4. **Detail pill count**: Among all players, count how many placed this dish at **rank position #1** (their personal top pick).

**UI:**
- Title: "most loved"
- Subtitle: "clean plate club"
- Value: dish name
- Detail pill: `"ranked #1 by {count}"`

### Nacho Type

**Goal**: Find the dish least liked by the group.

1. Same average-points data as above.
2. Select the dish with the **lowest average points**, excluding the Most Loved dish.
3. **Tiebreak**: If two or more dishes share the lowest average points, pick the one that was ranked **last most often** (`lastCounts` — the count of players who placed this dish at their personal last rank position, i.e., position = N for that player). Higher `lastCounts` wins.
4. **Detail pill count**: Among all players, count how many placed this dish at their personal **last rank position**.

**UI:**
- Title: "nacho type"
- Subtitle: "zero out of ten, respectfully"
- Value: dish name
- Detail pill: `"ranked last by {count}"`

### Hot & Cold

**Goal**: Find the most controversial dish — the one with the widest spread in how players ranked it.

1. For each dish, consider only the players who **tried** it (non-skipped, non-null `rankPosition`).
2. A dish must have been tried by **at least 2 players** to qualify. Dishes tried by 0 or 1 players are excluded.
3. Compute the **variance of rank positions** (not points) across qualifying players:
   - `mean = sum(rankPositions) / count`
   - `variance = sum((pos - mean)²) / count`
4. Select the dish with the **highest variance**.
5. This dish **can** be the same dish as Most Loved or Nacho Type (no exclusion).
6. If no dish qualifies (all variances = 0, or no dish was tried by at least 2 players), the Hot & Cold card shows the message **"No controversy - you're all on the same page"** in the value box. The card is still displayed.
7. **Detail pill**: Report the **best rank position** (lowest number, e.g., #1) and **worst rank position** (highest number, e.g., #5) assigned to this dish across all players who tried it.
   - `highRank` = minimum rank position number (best placement).
   - `lowRank` = maximum rank position number (worst placement).
   - These are **rank positions**, not points.

**UI:**
- Title: "hot & cold"
- Subtitle: "most controversial playte debate"
- Value: dish name (or "No controversy - you're all on the same page" if no variance)
- Detail pill: `"as high as #{highRank}, as low as #{lowRank}"` (hidden when showing the no-controversy message)

### Numeric Example for Hot & Cold

4 players, 4 dishes. Only rankings for "Pizza":
- Alice: ranked Pizza #1 (out of 4 she tried)
- Bob: ranked Pizza #3 (out of 4)
- Carol: ranked Pizza #4 (out of 4)
- Dave: skipped Pizza — excluded

Positions considered: [1, 3, 4]. `n = 3`.
`mean = (1+3+4)/3 = 2.67`
`variance = ((1-2.67)² + (3-2.67)² + (4-2.67)²) / 3 = (2.79 + 0.11 + 1.77) / 3 = 1.56`

Detail pill: `"as high as #1, as low as #4"` (best = min position = 1, worst = max position = 4).

### Best (Taste) Buds

**Goal**: For the viewer, find the player whose taste most closely matches theirs.

1. For each pair (viewer, candidate), compute the **Spearman correlation** on **shared tried dishes only** (dishes both players have a non-null, non-skipped rank position for).
2. Spearman formula: `rho = 1 - (6 * sum(d²)) / (n * (n² - 1))` where `n` = number of shared dishes, `d` = rank difference per dish.
3. Normalize: `matchPercent = max(0, round(((rho + 1) / 2) * 100))`.
4. If `n < 2`, the pair returns a match of 0 (cannot be computed — will not win Best Bud over a pair with computable Spearman).
5. Select the candidate with the **highest matchPercent**.
6. **Tie-breaking**: If multiple candidates share the highest match %, prefer a candidate who has **not yet been picked as someone else's Best Bud** in the current pass. If all tied candidates are already picked, pick randomly among them.
7. **Non-exclusive**: Two players can share the same Best Bud (no exclusivity for non-ties).
8. If the viewer's highest match % is **below 10%**, the card shows a funny fallback message instead of a person's name (e.g., `"you should try dining alone 🍽️"`), and the match % pill is still shown.
9. Best Buds is **viewer-specific** — the card does not appear if no `viewerId` is provided, because the API returns `bestBud: null` when `viewerPlayerId` is absent.
10. The match % shown in the Best Buds card must be **identical** to the match % shown on the player list page for the same viewer-player pair. Both use pure Spearman on shared tried dishes with no overlap penalty.

**UI:**
- Title: "best (taste) buds"
- Subtitle: "you should share next time"
- Value: matched player's `displayName` (or fallback message if match < 25%)
- Detail pill: `"{matchPercent}% match"`

### Numeric Example for Best Buds

3 players: Alice (viewer), Bob, Carol. 4 dishes: Pasta, Salad, Pizza, Tacos.

- Alice: Pasta#1, Salad#2, Pizza#3, Tacos#4.
- Bob: Pasta#1, Salad#3, Pizza#2, Tacos#4. (same as player list example → 90%)
- Carol: Tacos#1, Pizza#2, Salad#3, Pasta#4.

Alice vs Bob shared dishes: all 4, match = **90%** (computed above).

Alice vs Carol shared dishes: all 4.
| Dish   | Alice | Carol | d  | d²  |
|--------|-------|-------|----|-----|
| Pasta  | 1     | 4     | -3 | 9   |
| Salad  | 2     | 3     | -1 | 1   |
| Pizza  | 3     | 2     | 1  | 1   |
| Tacos  | 4     | 1     | 3  | 9   |

`sum(d²) = 20`, `rho = 1 - (6×20)/(4×15) = 1 - 120/60 = 1 - 2 = -1`
`matchPercent = max(0, round(((-1+1)/2)×100)) = 0%`

Alice's Best Bud = Bob at **90%**.

---

## UI Requirements

### Page Layout
- Long Playte logo (links to `/`).
- Restaurant name in italic gray.
- Heading: "Flavor Journey" in red.
- 4 insight cards in a vertical stack, max width 384px, with gap between cards.

### InsightCard Component
Each card is a white rounded rectangle (`bg-[#FFFCF5]`) with:
1. **Title row**: emoji — title — emoji, centered, red bold text.
2. **Subtitle**: italic gray text, centered.
3. **Value box**: dish/player name in a pale yellow bordered rounded box, centered.
4. **Detail pill**: small text in a solid yellow rounded pill, self-centered.

Card-specific content:

| Insight | Emoji | Title | Subtitle | Detail pill |
|---------|-------|-------|----------|-------------|
| Most Loved | 😍 | most loved | clean plate club | `ranked #1 by {count}` |
| Nacho Type | 🥴 | nacho type | zero out of ten, respectfully | `ranked last by {count}` |
| Hot & Cold | 😐 | hot & cold | most controversial playte debate | `as high as #{highRank}, as low as #{lowRank}` (hidden for no-controversy message) |
| Best Buds | 👯 | best (taste) buds | you should share next time | `{matchPercent}% match` |

### Conditional rendering
- All four cards are always rendered (the Hot & Cold card shows a message when there is no controversy rather than being hidden).
- Best Buds card only appears when `viewerId` is present (i.e., a player is viewing, not a share link without identity).

### Bottom Action Bar
- "share flavor journey" button → generates and shares PNG of `<FlavorJourneyShareCard>`.
- "table results" button → `/session/[id]/results`.
- "individual rankings" button → `/session/[id]/results/players`.
- "save to account" button.
- `@letsplayte` Instagram attribution link.

---

## Edge Cases & Rules

1. Minimum 3 dishes means there will always be at least 3 candidates for Most Loved and Nacho Type.
2. Most Loved and Nacho Type will never be the same dish (enforced in `computeInsights` by filtering out `mostLovedDishId` before selecting Nacho Type).
3. Hot & Cold requires at least 2 players to have tried the dish. A dish tried by only 1 player has variance 0 and is excluded.
4. Hot & Cold shows "No controversy - you're all on the same page" if all players ranked all dishes identically (all variances = 0). The card is still shown — it is never hidden.
5. If fewer than 2 players are in the session, Best Buds cannot be computed and will be null.
6. A player with no submitted rankings has no entry in `rankedByPlayer` and does not participate in Best Bud calculation.
7. The `hotColdDetail` `high`/`low` values represent **rank positions** (1 = best), not points. `highRank` = lowest position number, `lowRank` = highest position number.
8. The Best Buds below-10% fallback message is displayed in the value box; the pill still shows the numeric match %.
9. `computeInsights` is called exactly once per session, when the last player submits. The Flavor Journey page always reads pre-computed data.
10. Most Loved tiebreak uses `firstCounts` (count of #1 rankings); Nacho Type tiebreak uses `lastCounts` (count of last-place rankings). No alphabetical sorting is used.

---

## Files

| File | Role |
|------|------|
| `src/app/session/[id]/results/flavor/page.tsx` | Client page: fetches insights, renders 4 InsightCard components |
| `src/app/api/session/[id]/results/route.ts` | API: reads pre-computed insight IDs, computes live firstCounts/lastCounts and bestBud for viewer |
| `src/app/api/session/[id]/rank/route.ts` | Triggers `computeInsights` when last player submits |
| `src/lib/insights.ts` | `computeInsights`: all four insight algorithms + `spearman()` + `computeBestBuds()` |
| `src/components/ui/ShareCards/FlavorJourneyShareCard.tsx` | Off-screen share card for PNG generation |
| `prisma/schema.prisma` | `SessionInsight` model: `most_loved_dish_id`, `nacho_type_dish_id`, `hot_cold_dish_id`, `dish_rank_variance`, `player_best_buds` |

---

## Known Bugs / Discrepancies

1. **Most Loved uses `firstCounts` as primary sort, not highest average points.** In `computeInsights` (line 65), `mostLovedDishId` is selected by count of #1 rankings. Per spec, Most Loved = highest average points with `firstCounts` as tiebreak only. Fix: sort by `avgPoints` descending first, then by `firstCounts` descending as tiebreak.

2. **Nacho Type tiebreak is not implemented.** Nacho Type selection (line 66–68) sorts by lowest avg points with no tiebreak. Per spec, if two dishes share the lowest avg points, the one with the higher `lastCounts` wins.

3. **Hot & Cold variance is computed on points, not rank positions.** In `computeInsights` (line 43–47), `pts` holds point values (including 0 for skipped players). Per spec, variance must be computed on **rank positions** across players who tried the dish only. The current implementation inflates variance for dishes many people skipped.

4. **`hotColdDetail` stores points extremes, not rank position extremes.** In `rank/route.ts` (lines 81–84), `high` and `low` are derived from points arrays. Per spec, these must be the minimum and maximum rank **position** (not points) across players who tried the dish. Fix: iterate over `rankedByPlayer` for the hot/cold dish, collect `rankPosition` values, set `high = min(positions)` and `low = max(positions)`.

5. **Best Buds applies an overlap penalty not in the spec.** `computeBestBuds` (line 41) multiplies the Spearman score by `overlapRatio` (shared/union). Per spec, Best Buds uses **pure Spearman on shared tried dishes only** with no overlap penalty. This must be corrected so the Best Buds match % is identical to the player list match %.

6. **The below-10% fallback for Best Buds is not implemented.** The current `flavor/page.tsx` renders `ins.bestBud.displayName` unconditionally with no threshold check. Per spec, if match < 10%, show the fallback message.

7. **Hot & Cold null renders nothing instead of the no-controversy message.** The current `flavor/page.tsx` hides the Hot & Cold card when `hotCold` is null. Per spec, the card must always appear and show "No controversy - you're all on the same page" in the value box when there is no variance.

8. **`hotColdDetail` is stored inside `playerBestBuds` JSON, not as a top-level field.** This is a leaky data structure: `hotColdDetail` has nothing to do with best buds but is piggy-backed on that JSON column because `SessionInsight` has no dedicated column for it. A dedicated column or separate JSON field would be cleaner.
