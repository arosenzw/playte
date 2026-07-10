/**
 * Dev seed script — creates a test session you can jump straight into.
 *
 * Usage:
 *   npm run dev:seed              → ranking phase (default)
 *   npm run dev:seed -- --results → results phase (all players submitted)
 *
 * Outputs a localhost URL. Open it to land directly on the target page.
 */

import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";
import { computeScores, computeBestBuds, spearman } from "../src/lib/insights";

const prisma = new PrismaClient();

const DISHES = [
  "Truffle Fries",
  "Burrata Toast",
  "Spicy Tuna Roll",
  "Wagyu Slider",
  "Lobster Bisque",
  "Crispy Brussels Sprouts",
  "Bone Marrow Crostini",
  "Duck Confit Tacos",
  "Miso Black Cod",
  "Pistachio Crème Brûlée",
];

const PLAYER_NAMES = ["Alex", "Jordan", "Sam", "Riley"];

function randomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function randomToken() {
  return crypto.randomBytes(16).toString("hex");
}

async function main() {
  const wantResults = process.argv.includes("--results");

  // ── Find or create a dev restaurant ──────────────────────────────────────
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: "Dev Restaurant" },
  });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { name: "Dev Restaurant" },
    });
  }

  const joinCode = randomCode();

  // ── Create session ────────────────────────────────────────────────────────
  const session = await prisma.session.create({
    data: {
      restaurantId: restaurant.id,
      joinCode,
      status: wantResults ? "results" : "ranking",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      resultsRevealedAt: wantResults ? new Date() : null,
    },
  });

  // ── Create host player ────────────────────────────────────────────────────
  const hostToken = randomToken();
  const host = await prisma.sessionPlayer.create({
    data: {
      sessionId: session.id,
      displayName: "Allyson",
      guestToken: hostToken,
      isHost: true,
      submittedAt: wantResults ? new Date() : null,
    },
  });

  // ── Create extra players (for results page context) ───────────────────────
  const extraPlayers = [];
  if (wantResults) {
    for (const name of PLAYER_NAMES) {
      const p = await prisma.sessionPlayer.create({
        data: {
          sessionId: session.id,
          displayName: name,
          guestToken: randomToken(),
          isHost: false,
          submittedAt: new Date(),
        },
      });
      extraPlayers.push(p);
    }
  }

  // ── Create dishes ─────────────────────────────────────────────────────────
  const dishes = await Promise.all(
    DISHES.map((name) =>
      prisma.dish.create({
        data: { sessionId: session.id, restaurantId: restaurant!.id, name },
      })
    )
  );

  // ── Submit rankings for results phase ─────────────────────────────────────
  if (wantResults) {
    const allPlayers = [host, ...extraPlayers];
    const now = new Date();
    const n = dishes.length;

    // Each player gets a hand-crafted order index array so results are spread out.
    // Index into `dishes` array. Player 0 = host.
    const playerOrders: (number | null)[][] = [
      // Host:   loves truffle fries + pistachio, hates bisque
      [0, 9, 1, 3, 7, 2, 6, 4, 8, 5],
      // Alex:   loves burrata + miso, skips wagyu
      [1, 8, 9, 0, 2, 6, 7, 5, 4, null],
      // Jordan: loves wagyu + bone marrow, hates brussels
      [3, 6, 0, 9, 7, 2, 1, 8, 4, 5],
      // Sam:    loves spicy tuna + duck tacos, skips creme brulee
      [2, 7, 0, 1, 3, 6, 8, 4, 5, null],
      // Riley:  loves lobster bisque + brussels, hates truffle fries
      [4, 5, 8, 9, 6, 7, 3, 1, 2, 0],
    ];

    for (let pi = 0; pi < allPlayers.length; pi++) {
      const player = allPlayers[pi];
      const order = playerOrders[pi] ?? playerOrders[0];
      const tried: { dish: typeof dishes[0]; rank: number }[] = [];
      const skipped: typeof dishes[0][] = [];
      let rankPos = 1;
      for (const idx of order) {
        if (idx === null) continue; // this player skipped a dish — handled below
        tried.push({ dish: dishes[idx], rank: rankPos++ });
      }
      // Any dish not in the order at all gets skipped
      const usedIdxs = new Set(order.filter((x): x is number => x !== null));
      for (let i = 0; i < n; i++) {
        if (!usedIdxs.has(i)) skipped.push(dishes[i]);
      }

      await prisma.ranking.createMany({
        data: [
          ...tried.map(({ dish, rank }) => ({
            sessionId: session.id,
            restaurantId: restaurant!.id,
            sessionPlayerId: player.id,
            dishId: dish.id,
            rankPosition: rank,
            skipped: false,
            submittedAt: now,
          })),
          ...skipped.map((d) => ({
            sessionId: session.id,
            restaurantId: restaurant!.id,
            sessionPlayerId: player.id,
            dishId: d.id,
            rankPosition: null,
            skipped: true,
            submittedAt: now,
          })),
        ],
      });
    }

    // Compute and store insights so the results page has real data
    const allRankings = await prisma.ranking.findMany({
      where: { sessionId: session.id },
      select: { sessionPlayerId: true, dishId: true, rankPosition: true, skipped: true },
    });

    const rankedByPlayer: Record<string, Record<string, number>> = {};
    const skippedByPlayer: Record<string, Set<string>> = {};
    for (const r of allRankings) {
      if (!rankedByPlayer[r.sessionPlayerId]) rankedByPlayer[r.sessionPlayerId] = {};
      if (!skippedByPlayer[r.sessionPlayerId]) skippedByPlayer[r.sessionPlayerId] = new Set();
      if (r.skipped || r.rankPosition === null) {
        skippedByPlayer[r.sessionPlayerId].add(r.dishId);
      } else {
        rankedByPlayer[r.sessionPlayerId][r.dishId] = r.rankPosition;
      }
    }

    const { dishAvgPoints: dishAvgRanks, dishRankVariance, mostLovedDishId, nachoTypeDishId, hotColdDishId, hotColdDetail } =
      computeScores(rankedByPlayer, skippedByPlayer);

    const consensusRanks: Record<string, number> = {};
    Object.entries(dishAvgRanks).sort((a, b) => b[1] - a[1]).forEach(([dishId], i) => { consensusRanks[dishId] = i + 1; });

    const playerCorrelations: Record<string, number> = {};
    for (const [playerId, playerRanks] of Object.entries(rankedByPlayer)) {
      playerCorrelations[playerId] = spearman(playerRanks, consensusRanks) ?? 0;
    }

    const playerBestBuds = computeBestBuds(rankedByPlayer, skippedByPlayer);

    await prisma.sessionInsight.create({
      data: {
        sessionId: session.id,
        mostLovedDishId,
        nachoTypeDishId,
        hotColdDishId,
        dishAvgRanks,
        dishRankVariance,
        playerCorrelations,
        playerBestBuds: { ...playerBestBuds, hotColdDetail } as object,
      },
    });
  }

  // ── Print the dev URL ─────────────────────────────────────────────────────
  const base = "http://localhost:3000";
  const params = new URLSearchParams({
    session: session.id,
    player: host.id,
    token: hostToken,
    code: joinCode,
    host: "true",
    page: wantResults ? "wrapped" : "rank",
  });

  console.log("\n✅ Dev session created!\n");
  console.log(`   Session ID:  ${session.id}`);
  console.log(`   Join code:   ${joinCode}`);
  console.log(`   Restaurant:  ${restaurant.name}`);
  console.log(`   Dishes:      ${dishes.map((d) => d.name).join(", ")}`);
  if (wantResults) {
    console.log(`   Players:     You (Host) + ${PLAYER_NAMES.join(", ")}`);
  }
  console.log(`\n👉 Open this URL:\n`);
  console.log(`   ${base}/dev?${params.toString()}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
