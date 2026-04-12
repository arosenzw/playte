// Returns Spearman rank correlation as a 0–100 match percentage
export function spearman(a: Record<string, number>, b: Record<string, number>): number {
  const dishes = Object.keys(a).filter((d) => b[d] !== undefined);
  const n = dishes.length;
  if (n < 2) return 50;
  const dSq = dishes.reduce((sum, d) => sum + (a[d] - b[d]) ** 2, 0);
  const rho = 1 - (6 * dSq) / (n * (n * n - 1));
  return Math.max(0, Math.round(((rho + 1) / 2) * 100));
}

// Each player gets their highest Spearman match.
// On a tie, prefer a candidate not yet picked by anyone; otherwise pick randomly.
// Non-ties are never blocked — two players can share the same best bud if that's genuinely their top match.
export function computeBestBuds(byPlayer: Record<string, Record<string, number>>) {
  const result: Record<string, { playerId: string; match: number }> = {};
  const playerIds = Object.keys(byPlayer);
  const pickedAs = new Set<string>();

  for (const id of playerIds) {
    let best = -1;
    let candidates: string[] = [];
    for (const otherId of playerIds) {
      if (otherId === id) continue;
      const corr = spearman(byPlayer[id], byPlayer[otherId]);
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
