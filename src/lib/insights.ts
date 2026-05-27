// Returns Spearman rank correlation as a 0–100 match percentage
export function spearman(a: Record<string, number>, b: Record<string, number>): number {
  const dishes = Object.keys(a).filter((d) => b[d] !== undefined);
  const n = dishes.length;
  if (n < 2) return 50;
  const dSq = dishes.reduce((sum, d) => sum + (a[d] - b[d]) ** 2, 0);
  const rho = 1 - (6 * dSq) / (n * (n * n - 1));
  return Math.max(0, Math.round(((rho + 1) / 2) * 100));
}

// Each player gets their highest overlap-penalized Spearman match.
// Match % = Spearman(shared dishes) × (shared / union) to penalize players who tried different dishes.
// On a tie, prefer a candidate not yet picked by anyone; otherwise pick randomly.
// Non-ties are never blocked — two players can share the same best bud if that's genuinely their top match.
export function computeBestBuds(
  rankedByPlayer: Record<string, Record<string, number>>,
  skippedByPlayer: Record<string, Set<string>> = {}
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
      const aSkipped = skippedByPlayer[id] ?? new Set<string>();
      const bSkipped = skippedByPlayer[otherId] ?? new Set<string>();

      const aTried = Object.keys(aRanks).filter((d) => !aSkipped.has(d));
      const bTried = Object.keys(bRanks).filter((d) => !bSkipped.has(d));
      const shared = aTried.filter((d) => bTried.includes(d));
      const union = new Set([...aTried, ...bTried]);

      const overlapRatio = union.size > 0 ? shared.length / union.size : 0;
      const rawMatch = spearman(aRanks, bRanks); // uses intersection only internally
      const corr = Math.round(rawMatch * overlapRatio);

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
