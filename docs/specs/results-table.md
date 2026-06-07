# Spec: Group Dish Ranking Page

## Overview

The Group Dish Ranking page (`/session/[id]/results`) displays the consensus ranking of all dishes across all players. It is the first results screen players land on after everyone submits. Rankings are determined by a points system: each player's personal ordering is converted into points, and those points are averaged across all players to produce a group score. Higher average points = better group rank.

The page features an animated podium for the top three positions, followed by a scrollable numbered list for positions 4 and beyond.

---

## Data Flow

1. When the last player submits, `POST /api/session/[id]/rank` calls `computeInsights(sessionId)`.
2. `computeInsights` calculates per-dish average points and persists them in `SessionInsight.dishAvgRanks` (JSON keyed by `dishId`).
3. The results page fetches `GET /api/session/[id]/results`, which reads `dishAvgRanks` and returns an array of `{ id, name, avgRank }` sorted descending by `avgRank` (higher = better).
4. The client renders the first three rank positions as a podium and positions 4+ as a numbered list.

### Relevant DB Tables

- `rankings` — one row per (player, dish); stores `rank_position` (1 = player's top pick) and `skipped` flag.
- `session_insights.dish_avg_ranks` — JSON `{ [dishId]: avgPoints }` computed once at submission time.
- `dishes` — source of dish names; `deleted_at` soft-delete excludes removed dishes.

---

## Algorithm

### Points Conversion

For each player who submits rankings:

- Let **N** = number of dishes that player **tried** (i.e., not skipped). This varies per player.
- The dish they ranked #1 receives **N** points.
- The dish they ranked #2 receives **N - 1** points.
- ...
- The dish they ranked #N (last) receives **1** point.
- Any dish that player skipped receives **0** points from that player.

A player who tried 8 of 10 dishes awards a maximum of 8 points; a player who tried all 10 awards a maximum of 10. Skipping dishes reduces your scoring ceiling.

### Group Consensus Score

For each dish, collect points from all players (0 for skippers). The group score is the arithmetic mean:

```
avgPoints(dish) = sum(pointsFromAllPlayers) / totalNumberOfPlayers
```

### Sort Order

Dishes are sorted descending by `avgPoints`. Higher score = better rank.

### Tie-breaking

If two dishes have identical `avgPoints`, they share the same rank position and are displayed together with a TIE badge. No secondary sort is needed for display ordering — ties are rendered as a combined entry.

### Numeric Example

4 players, 5 dishes: Pasta, Salad, Pizza, Tacos, Soup.

| Player | Tried (N) | Rankings → pts |
|--------|-----------|----------------|
| Alice  | 3 | Pasta→3, Salad→2, Pizza→1; Tacos→0, Soup→0 |
| Bob    | 3 | Pasta→3, Tacos→2, Soup→1; Salad→0, Pizza→0 |
| Carol  | 3 | Salad→3, Tacos→2, Pizza→1; Pasta→0, Soup→0 |
| Dave   | 3 | Pasta→3, Pizza→2, Soup→1; Salad→0, Tacos→0 |

Avg points per dish:
- Pasta: (3+3+0+3)/4 = **2.25** → #1
- Salad: (2+0+3+0)/4 = **1.25** → #2
- Pizza: (1+0+1+2)/4 = **1.00** → #3 (tied)
- Tacos: (0+2+2+0)/4 = **1.00** → #3 (tied)
- Soup:  (0+1+0+1)/4 = **0.50** → #5

Final ranking: Pasta (#1), Salad (#2), Pizza + Tacos (#3 TIE), Soup (#5).

---

## UI Requirements

### Header
- Playte logo (links to `/`).
- Restaurant name in italic gray below logo.
- Heading: "the results are in." in red.

### Podium (positions 1–3)

- Rendered by the `<Podium>` component.
- Layout: position 2 on left, position 1 in center (taller), position 3 on right.
- Each column shows a medal circle (gold/silver/bronze), dish name(s), and a stack of plate images.
- Reveal animation: position 3 first, then 2, then 1. Position 1 triggers confetti.
- The podium always shows 3 filled slots (minimum 3 dishes ensures this).

**Tied dishes on the podium:**
- Both dish names appear in the same column, truncated to the maximum length that remains readable at the current font size, formatted as:
  `"{Name1truncated}... / {Name2truncated}... TIE"`
  Example: `"Pasta... / Salad... TIE"` (truncation applied equally to both names)
- The position badge shows the shared rank number.
- If two dishes tie for position 2, the #3 podium slot is **filled by the next available dish** (not left blank).
- If two dishes tie for position 1, the #2 and #3 slots are filled by the next two dishes.

### List (positions 4+)

- Each item: rank number (red, right-aligned), dish name in a rounded card (pale yellow border).
- Items fade and slide up 400 ms after data loads.
- Tied dishes share one row in the same `"{Name1}... / {Name2}... TIE"` format.
- Position numbers are **sequential with no gaps**: if two dishes tie at #4, the next dish is **#5** (not #6).

### Bottom Action Bar
- "flavor journey" button → `/session/[id]/results/flavor`
- "individual rankings" button → `/session/[id]/results/players`
- "share results" button → generates and shares PNG of `<PodiumShareCard>`.
- "save to account" button → calls `POST /api/auth/save`; redirects to `/auth` if not logged in; shows "saved ✓" after success.
- `@letsplayte` Instagram attribution link above the buttons.

### URL parameter
- `viewerId` query param is preserved when navigating to sub-pages (flavor, players).

---

## Edge Cases & Rules

1. Minimum 4 dishes are enforced at session creation, so the podium will always have 3 filled slots.
2. If two dishes tie for position 1, they share the #1 podium slot; #2 and #3 are filled by the next two dishes in score order.
3. If two dishes tie for position 2, they share the #2 podium slot; #3 is filled by the next dish in score order.
4. A player who skipped dishes has a lower per-dish points ceiling than one who tried everything. N = that player's tried count, not the total dish count.
5. Dishes with `deleted_at IS NOT NULL` are excluded from results entirely.
6. The `avgRank` field returned by the API holds average **points** (higher = better). The name is misleading but the descending sort direction is correct.
7. Ties in the list below the podium share a single row with a TIE badge; position numbers do not skip — the next item is always the previous number + 1.

---

## Files

| File | Role |
|------|------|
| `src/app/session/[id]/results/page.tsx` | Client page: fetches data, renders podium + list, action bar |
| `src/app/api/session/[id]/results/route.ts` | API: reads `dishAvgRanks` from `SessionInsight`, returns sorted dish list |
| `src/app/api/session/[id]/rank/route.ts` | Persists player rankings; triggers `computeInsights` when last player submits |
| `src/lib/insights.ts` | Points conversion, avg computation, upsert to DB |
| `src/components/ui/Podium.tsx` | Animated podium component (positions 1–3) |
| `src/components/ui/ShareCards/PodiumShareCard.tsx` | Off-screen share card rendered to PNG |
| `prisma/schema.prisma` | `Ranking`, `SessionInsight`, `Dish` models |

---

## Known Bugs

1. **Ties are not implemented.** No tie-detection, no TIE badge, no combined dish name display. The `<Podium>` component accepts a flat array with one dish per slot. If two dishes have identical `avgRank`, the API returns them in arbitrary order and the podium silently shows one per slot.

2. **Position numbers below the podium ignore ties.** The list uses `i + 4` (a simple counter) so tied dishes would each get different numbers rather than sharing a position.

3. **`avgRank` field name is misleading.** Holds average points (higher = better), not a rank number. Sort direction in the API is correct (descending), but any consumer assuming lower = better would break.

4. **`hotColdDetail` stores points extremes, not rank position extremes.** This affects the Hot & Cold detail pill — see `spec-results-flavor.md` bug #4 for full detail.
