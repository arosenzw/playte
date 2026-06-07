// Returns Spearman rank correlation as a 0–100 match percentage,
// or null if the two players share fewer than 2 tried dishes (cannot compute).
export function spearman(a: Record<string, number>, b: Record<string, number>): number | null {
  const dishes = Object.keys(a).filter((d) => b[d] !== undefined);
  const n = dishes.length;
  if (n < 2) return null;
  const dSq = dishes.reduce((sum, d) => sum + (a[d] - b[d]) ** 2, 0);
  const rho = 1 - (6 * dSq) / (n * (n * n - 1));
  return Math.max(0, Math.round(((rho + 1) / 2) * 100));
}

// For each player, find the other player whose taste most closely matches theirs.
// Uses pure Spearman on shared tried dishes only — no overlap penalty.
// If n < 2 shared dishes, that pair scores 0 (will not win over a computable match).
// On a tie, prefer a candidate not yet picked by anyone; otherwise pick randomly.
// Non-ties are never blocked — two players can share the same best bud.
export function computeBestBuds(
  rankedByPlayer: Record<string, Record<string, number>>,
  _skippedByPlayer: Record<string, Set<string>> = {}
) {
  const result: Record<string, { playerId: string; match: number }> = {};
  const playerIds = Object.keys(rankedByPlayer);
  const pickedAs = new Set<string>();

  for (const id of playerIds) {
    let best = -1;
    let candidates: string[] = [];
    for (const otherId of playerIds) {
      if (otherId === id) continue;

      const aRanks = rankedByPlayer[id];
      const bRanks = rankedByPlayer[otherId];

      const rawMatch = spearman(aRanks, bRanks);
      const corr = rawMatch ?? 0; // null (< 2 shared dishes) counts as 0

      if (corr > best) { best = corr; candidates = [otherId]; }
      else if (corr === best) { candidates.push(otherId); }
    }
    if (candidates.length > 0) {
      const pool = candidates.filter((c) => !pickedAs.has(c));
      const pick = (pool.length > 0 ? pool : candidates)[Math.floor(Math.random() * (pool.length || candidates.length))];
      result[id] = { playerId: pick, match: best };
      pickedAs.add(pick);
    }
  }
  return result;
}

export type ScoreResult = {
  dishAvgPoints: Record<string, number>;
  dishRankVariance: Record<string, number>;
  mostLovedDishId: string | null;
  nachoTypeDishId: string | null;
  hotColdDishId: string | null;
  hotColdDetail: { high: number; low: number } | null;
  firstCounts: Record<string, number>;
  lastCounts: Record<string, number>;
};

/**
 * Pure scoring function — no DB calls. Takes the per-player ranking data and
 * returns all per-dish statistics plus the four insight dish IDs.
 *
 * rankedByPlayer: { playerId → { dishId → rankPosition } }
 *   Only includes dishes the player actually tried (non-skipped, rankPosition ≥ 1).
 *
 * skippedByPlayer: { playerId → Set<dishId> }
 *   Dishes this player marked as "didn't try". Each skipped dish contributes 0 pts.
 */
export function computeScores(
  rankedByPlayer: Record<string, Record<string, number>>,
  skippedByPlayer: Record<string, Set<string>>
): ScoreResult {
  // ── Points per dish ────────────────────────────────────────────────────────
  // For a player who tried N dishes, their rank #k dish earns (N - k + 1) pts.
  // A skipped dish earns 0 pts and its 0 is included in the average denominator.
  const byDishPoints: Record<string, number[]> = {};
  const byDishRankPositions: Record<string, number[]> = {};

  for (const [pid, ranks] of Object.entries(rankedByPlayer)) {
    const n = Object.keys(ranks).length;
    for (const [dishId, pos] of Object.entries(ranks)) {
      const pts = n - pos + 1;
      if (!byDishPoints[dishId]) byDishPoints[dishId] = [];
      byDishPoints[dishId].push(pts);
      if (!byDishRankPositions[dishId]) byDishRankPositions[dishId] = [];
      byDishRankPositions[dishId].push(pos);
    }
    for (const dishId of skippedByPlayer[pid] ?? []) {
      if (!byDishPoints[dishId]) byDishPoints[dishId] = [];
      byDishPoints[dishId].push(0);
      // skipped dishes are NOT added to byDishRankPositions — they have no position
    }
  }

  // ── Average points per dish ────────────────────────────────────────────────
  const dishAvgPoints: Record<string, number> = {};
  for (const [dishId, pts] of Object.entries(byDishPoints)) {
    dishAvgPoints[dishId] = pts.reduce((a, b) => a + b, 0) / pts.length;
  }

  // ── Variance of rank positions (tried-only, requires ≥ 2 players) ─────────
  const dishRankVariance: Record<string, number> = {};
  for (const [dishId, positions] of Object.entries(byDishRankPositions)) {
    if (positions.length < 2) continue;
    const avg = positions.reduce((a, b) => a + b, 0) / positions.length;
    dishRankVariance[dishId] = positions.reduce((sum, p) => sum + (p - avg) ** 2, 0) / positions.length;
  }

  // ── firstCounts / lastCounts ───────────────────────────────────────────────
  const firstCounts: Record<string, number> = {};
  const lastCounts: Record<string, number> = {};
  for (const playerRanks of Object.values(rankedByPlayer)) {
    const n = Object.keys(playerRanks).length;
    for (const [dishId, rank] of Object.entries(playerRanks)) {
      if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
      if (rank === n) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
    }
  }

  // ── Most Loved: highest avg points; tiebreak → most #1 rankings ───────────
  const mostLovedDishId = Object.entries(dishAvgPoints)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return (firstCounts[b[0]] ?? 0) - (firstCounts[a[0]] ?? 0);
    })[0]?.[0] ?? null;

  // ── Nacho Type: lowest avg points (excl. Most Loved); tiebreak → most last ─
  const nachoTypeDishId = Object.entries(dishAvgPoints)
    .filter(([id]) => id !== mostLovedDishId)
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] - b[1];
      return (lastCounts[b[0]] ?? 0) - (lastCounts[a[0]] ?? 0);
    })[0]?.[0] ?? null;

  // ── Hot & Cold: highest rank-position variance ────────────────────────────
  const hotColdSorted = Object.entries(dishRankVariance).sort((a, b) => b[1] - a[1]);
  const hotColdDishId = (hotColdSorted[0]?.[1] ?? 0) > 0 ? hotColdSorted[0][0] : null;

  const hotColdPositions = hotColdDishId ? (byDishRankPositions[hotColdDishId] ?? []) : [];
  const hotColdDetail = hotColdPositions.length > 0
    ? { high: Math.min(...hotColdPositions), low: Math.max(...hotColdPositions) }
    : null;

  return {
    dishAvgPoints,
    dishRankVariance,
    mostLovedDishId,
    nachoTypeDishId,
    hotColdDishId,
    hotColdDetail,
    firstCounts,
    lastCounts,
  };
}
