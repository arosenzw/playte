# "Didn't Try" Feature — Implementation Plan

## Overview
Allow players to mark dishes they didn't eat during the ranking phase. Skipped dishes are excluded from a player's ranking but still participate in group scoring with 0 points.

---

## 1. Database

**Option A (recommended):** Add a `skipped` boolean column to the `Ranking` table.
- `skipped: true` means the player didn't try this dish — no rank position stored.
- Keeps all dish participation in one table, easy to query.

**Migration:**
```sql
ALTER TABLE rankings ADD COLUMN skipped BOOLEAN NOT NULL DEFAULT FALSE;
```

---

## 2. Ranking UI (`src/app/session/[id]/rank/page.tsx`)

- Each dish row gets a "didn't try" toggle (e.g. a small checkbox or tap-to-toggle button).
- Toggling a dish moves it out of the draggable ranked list into a separate "didn't try" section pinned at the bottom of the screen.
- Toggling back moves it into the bottom of the ranked list.
- The ranked list and "didn't try" section are visually distinct (e.g. grayed out dishes in the skipped section).

---

## 3. Ranking Submission (`src/app/api/session/[id]/rank/route.ts`)

**Request body change:**
```ts
{
  playerId, guestToken,
  rankings: [{ dishId, rankPosition }],  // tried dishes only
  skipped: [dishId, dishId, ...]          // didn't try
}
```

**On submission:**
- Insert `Ranking` rows for tried dishes with their `rankPosition`.
- Insert `Ranking` rows for skipped dishes with `skipped: true` and no `rankPosition`.

---

## 4. Scoring Algorithm (`src/app/api/session/[id]/rank/route.ts` — `computeInsights`)

Replace raw rank positions with a **points system**:

```
pointsAwarded = (numTriedByPlayer - rankPosition + 1)
skipped dish  = 0 points
```

**Example — 10 dishes, player tried 8:**
| Rank | Points |
|------|--------|
| #1   | 8      |
| #2   | 7      |
| ...  | ...    |
| #8   | 1      |
| skipped | 0   |
| skipped | 0   |

**Group consensus** = total points per dish across all players, sorted descending.

**Changes needed in `computeInsights`:**
- Build `byPlayer` map from points (not rank positions).
- Build `dishTotalPoints` map for consensus.
- Skipped dishes contribute 0 — no special handling needed beyond that.

---

## 5. Best Taste Buds — Overlap Penalty (`src/lib/insights.ts`)

Update `computeBestBuds` to penalize for low dish overlap between two players:

```ts
function matchWithOverlap(
  aPoints: Record<string, number>,
  bPoints: Record<string, number>,
  aSkipped: Set<string>,
  bSkipped: Set<string>
): number {
  const aTried = Object.keys(aPoints).filter(d => !aSkipped.has(d));
  const bTried = Object.keys(bPoints).filter(d => !bSkipped.has(d));
  const shared = aTried.filter(d => bTried.includes(d));
  const union = new Set([...aTried, ...bTried]);

  const overlapRatio = shared.length / union.size;
  const rankSimilarity = spearman(
    Object.fromEntries(shared.map((d, i) => [d, aTried.indexOf(d) + 1])),
    Object.fromEntries(shared.map((d, i) => [d, bTried.indexOf(d) + 1]))
  );
  return Math.round(rankSimilarity * overlapRatio);
}
```

Update `computeBestBuds` signature to accept skipped sets per player.

---

## 6. Results API (`src/app/api/session/[id]/results/route.ts`)

- Fetch skipped dish IDs per player from the `rankings` table (`skipped: true`).
- Pass skipped sets into the match % computation.
- Return `skippedDishes: string[]` per player in the response.

---

## 7. Individual Rankings UI (`src/app/session/[id]/results/players/[playerId]/page.tsx`)

- Render tried dishes in ranked order (existing behavior).
- Add a "didn't try" section below with a divider, listing skipped dishes in gray/muted style.

---

## 8. Test Updates (`scripts/test-best-buds.ts`)

Add test cases for:
- Two players with full overlap — behavior unchanged.
- Two players with partial overlap — match % is dampened.
- Extreme case: 1 shared dish out of 10 — match % ≈ 10% even if Spearman is 100%.
- All dishes skipped edge case.

---

## Files to Modify

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Add `skipped` field to `Ranking` model |
| `src/app/session/[id]/rank/page.tsx` | "Didn't try" toggle UI |
| `src/app/api/session/[id]/rank/route.ts` | Accept `skipped[]`, store skipped rankings, points-based scoring |
| `src/lib/insights.ts` | Overlap-penalized match %, update `computeBestBuds` |
| `src/app/api/session/[id]/results/route.ts` | Return skipped dishes per player, pass to match % |
| `src/app/session/[id]/results/players/[playerId]/page.tsx` | Show "didn't try" section |
| `scripts/test-best-buds.ts` | New test cases |

---

## Out of Scope (for now)
- Flavor Journey insights (most loved, nacho type, hot & cold) — these can continue using the existing points-based data without changes.
- Host removing a dish mid-game — existing soft-delete behavior is unaffected.
