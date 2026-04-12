// Standalone test for best buds algorithm — imports the real implementation
// Run with: npx tsx scripts/test-best-buds.ts

import { spearman, computeBestBuds } from "../src/lib/insights";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e: unknown) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${(e as Error).message}`);
    failed++;
  }
}

function expect(val: unknown) {
  return {
    toBe(expected: unknown) {
      if (val !== expected) throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    },
    toBeOneOf(options: unknown[]) {
      if (!options.includes(val)) throw new Error(`expected one of ${JSON.stringify(options)}, got ${JSON.stringify(val)}`);
    },
    toBeGreaterThanOrEqual(n: number) {
      if ((val as number) < n) throw new Error(`expected >= ${n}, got ${val}`);
    },
    toBeLessThanOrEqual(n: number) {
      if ((val as number) > n) throw new Error(`expected <= ${n}, got ${val}`);
    },
  };
}

// ─── Dishes ───────────────────────────────────────────────────────────────────
const [P, Q, S, T] = ["pasta", "pizza", "salad", "tiramisu"];

console.log("\n── Spearman ──────────────────────────────────────────────────────");

test("identical rankings = 100%", () => {
  const a = { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 };
  expect(spearman(a, a)).toBe(100);
});

test("reversed rankings = 0%", () => {
  const a = { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 };
  const b = { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 };
  expect(spearman(a, b)).toBe(0);
});

test("one swap is high but not 100%", () => {
  const a = { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 };
  const b = { [P]: 1, [Q]: 2, [S]: 4, [T]: 3 };
  const score = spearman(a, b);
  expect(score).toBeGreaterThanOrEqual(80);
  expect(score).toBeLessThanOrEqual(99);
});

test("only 1 shared dish returns 50", () => {
  const a = { [P]: 1 };
  const b = { [P]: 1 };
  expect(spearman(a, b)).toBe(50);
});

console.log("\n── Best Buds: 2 players ──────────────────────────────────────────");

test("2 players: each gets the other", () => {
  const byPlayer = {
    annie: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
  };
  const result = computeBestBuds(byPlayer);
  expect(result.annie.playerId).toBe("allie");
  expect(result.allie.playerId).toBe("annie");
});

test("2 players opposite rankings: still get each other (only option)", () => {
  const byPlayer = {
    annie: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie: { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
  };
  const result = computeBestBuds(byPlayer);
  expect(result.annie.playerId).toBe("allie");
  expect(result.allie.playerId).toBe("annie");
});

console.log("\n── Best Buds: 3 players ──────────────────────────────────────────");

test("3 players: clear best match wins", () => {
  const byPlayer = {
    annie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    johnny: { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
  };
  const result = computeBestBuds(byPlayer);
  expect(result.annie.playerId).toBe("allie");
  expect(result.allie.playerId).toBe("annie");
  expect(result.johnny.playerId).toBeOneOf(["annie", "allie"]);
});

test("3 players all identical: all get 100%, unique picks", () => {
  const byPlayer = {
    annie: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    debra: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
  };
  for (let run = 0; run < 20; run++) {
    const result = computeBestBuds(byPlayer);
    expect(result.annie.match).toBe(100);
    expect(result.allie.match).toBe(100);
    expect(result.debra.match).toBe(100);
    if (result.annie.playerId === result.allie.playerId)
      throw new Error(`annie and allie both picked ${result.annie.playerId}`);
  }
});

console.log("\n── Best Buds: 4 players ──────────────────────────────────────────");

test("4 players: clear pairs emerge", () => {
  const byPlayer = {
    annie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    debra:  { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
    johnny: { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
  };
  const result = computeBestBuds(byPlayer);
  expect(result.annie.playerId).toBe("allie");
  expect(result.allie.playerId).toBe("annie");
  expect(result.debra.playerId).toBe("johnny");
  expect(result.johnny.playerId).toBe("debra");
});

test("4 players all identical: no two of first 3 get the same pick", () => {
  const byPlayer = {
    annie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    debra:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    johnny: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
  };
  for (let run = 0; run < 50; run++) {
    const result = computeBestBuds(byPlayer);
    const picks = [result.annie.playerId, result.allie.playerId, result.debra.playerId];
    if (new Set(picks).size !== 3)
      throw new Error(`duplicate picks among first 3: ${picks.join(", ")}`);
  }
});

test("4 players: Debra's real best match wins even if they're popular", () => {
  const byPlayer = {
    annie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    allie:  { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    debra:  { [P]: 1, [Q]: 2, [S]: 4, [T]: 3 },
    johnny: { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
  };
  const result = computeBestBuds(byPlayer);
  expect(result.debra.playerId).toBeOneOf(["annie", "allie"]);
  expect(result.debra.match).toBeGreaterThanOrEqual(80);
});

test("4 players: higher match % wins regardless of processing order", () => {
  const scenarios = [
    { annie: { [P]:1,[Q]:2,[S]:3,[T]:4 }, debra: { [P]:1,[Q]:2,[S]:4,[T]:3 }, allie: { [P]:1,[Q]:2,[S]:3,[T]:4 }, johnny: { [P]:4,[Q]:3,[S]:2,[T]:1 } },
    { allie: { [P]:1,[Q]:2,[S]:3,[T]:4 }, debra: { [P]:1,[Q]:2,[S]:4,[T]:3 }, annie: { [P]:1,[Q]:2,[S]:3,[T]:4 }, johnny: { [P]:4,[Q]:3,[S]:2,[T]:1 } },
  ];
  for (const byPlayer of scenarios) {
    for (let run = 0; run < 20; run++) {
      const result = computeBestBuds(byPlayer);
      if (result.allie) expect(result.allie.playerId).toBe("annie");
      if (result.annie) expect(result.annie.playerId).toBe("allie");
      if (result.debra) expect(result.debra.playerId).toBeOneOf(["annie", "allie"]);
      if (result.debra) expect(result.debra.match).toBeGreaterThanOrEqual(80);
    }
  }
});

test("match % is always 0-100", () => {
  const byPlayer = {
    a: { [P]: 1, [Q]: 4, [S]: 2, [T]: 3 },
    b: { [P]: 3, [Q]: 2, [S]: 4, [T]: 1 },
    c: { [P]: 2, [Q]: 1, [S]: 3, [T]: 4 },
    d: { [P]: 4, [Q]: 3, [S]: 1, [T]: 2 },
  };
  const result = computeBestBuds(byPlayer);
  for (const [player, bud] of Object.entries(result)) {
    if (bud.match < 0 || bud.match > 100)
      throw new Error(`${player} has out-of-range match: ${bud.match}`);
  }
});

test("every player gets a best bud assigned", () => {
  const byPlayer = {
    a: { [P]: 1, [Q]: 2, [S]: 3, [T]: 4 },
    b: { [P]: 2, [Q]: 1, [S]: 4, [T]: 3 },
    c: { [P]: 3, [Q]: 4, [S]: 1, [T]: 2 },
    d: { [P]: 4, [Q]: 3, [S]: 2, [T]: 1 },
    e: { [P]: 1, [Q]: 3, [S]: 2, [T]: 4 },
  };
  const result = computeBestBuds(byPlayer);
  for (const id of Object.keys(byPlayer)) {
    if (!result[id]) throw new Error(`${id} was not assigned a best bud`);
    if (!result[id].playerId) throw new Error(`${id}.playerId is missing`);
  }
});

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
