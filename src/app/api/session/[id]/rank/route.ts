import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { spearman, computeBestBuds } from "@/lib/insights";

async function computeInsights(sessionId: string) {
  const allRankings = await prisma.ranking.findMany({
    where: { sessionId },
    select: { sessionPlayerId: true, dishId: true, rankPosition: true, skipped: true },
  });

  // Build per-player tried-only rank maps (for Spearman) and skipped sets
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

  // Points per player per dish: tried rank #k out of N tried → (N - k + 1) pts; skipped → 0
  const byDishPoints: Record<string, number[]> = {};
  for (const [pid, ranks] of Object.entries(rankedByPlayer)) {
    const n = Object.keys(ranks).length;
    for (const [dishId, pos] of Object.entries(ranks)) {
      const pts = n - pos + 1;
      if (!byDishPoints[dishId]) byDishPoints[dishId] = [];
      byDishPoints[dishId].push(pts);
    }
    for (const dishId of skippedByPlayer[pid] ?? []) {
      if (!byDishPoints[dishId]) byDishPoints[dishId] = [];
      byDishPoints[dishId].push(0);
    }
  }

  // Group consensus: higher avg points = better rank. Store as dishAvgRanks (avg points, descending is better).
  const dishAvgRanks: Record<string, number> = {};
  const dishRankVariance: Record<string, number> = {};
  for (const [dishId, pts] of Object.entries(byDishPoints)) {
    const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
    dishAvgRanks[dishId] = avg;
    dishRankVariance[dishId] = pts.reduce((sum, p) => sum + (p - avg) ** 2, 0) / pts.length;
  }

  const consensusRanks: Record<string, number> = {};
  Object.entries(dishAvgRanks)
    .sort((a, b) => b[1] - a[1]) // descending points → rank 1
    .forEach(([dishId], i) => { consensusRanks[dishId] = i + 1; });

  // Most loved: dish ranked #1 most often (among tried dishes)
  const firstCounts: Record<string, number> = {};
  const lastCounts: Record<string, number> = {};
  for (const playerRanks of Object.values(rankedByPlayer)) {
    const n = Object.keys(playerRanks).length;
    for (const [dishId, rank] of Object.entries(playerRanks)) {
      if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
      if (rank === n) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
    }
  }

  const mostLovedDishId = Object.entries(firstCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const nachoTypeDishId = Object.entries(dishAvgRanks)
    .filter(([id]) => id !== mostLovedDishId)
    .sort((a, b) => a[1] - b[1])[0]?.[0] ?? null; // lowest avg points (most disliked)
  const hotColdSorted = Object.entries(dishRankVariance).sort((a, b) => b[1] - a[1]);
  const hotColdDishId = (hotColdSorted[0]?.[1] ?? 0) > 0 ? hotColdSorted[0][0] : null;

  // Player correlation with group consensus
  const playerCorrelations: Record<string, number> = {};
  for (const [playerId, playerRanks] of Object.entries(rankedByPlayer)) {
    playerCorrelations[playerId] = spearman(playerRanks, consensusRanks);
  }

  const playerBestBuds = computeBestBuds(rankedByPlayer, skippedByPlayer);

  // Hot/cold: find actual min/max points for the most variance dish
  const hotColdPoints = hotColdDishId ? byDishPoints[hotColdDishId] : [];
  const hotColdDetail = hotColdDishId && hotColdPoints.length > 0
    ? { high: Math.min(...hotColdPoints), low: Math.max(...hotColdPoints) }
    : null;

  await prisma.sessionInsight.upsert({
    where: { sessionId },
    create: {
      sessionId, mostLovedDishId, nachoTypeDishId, hotColdDishId,
      dishAvgRanks, dishRankVariance, playerCorrelations,
      playerBestBuds: { ...playerBestBuds, hotColdDetail } as object,
    },
    update: {
      mostLovedDishId, nachoTypeDishId, hotColdDishId,
      dishAvgRanks, dishRankVariance, playerCorrelations,
      playerBestBuds: { ...playerBestBuds, hotColdDetail } as object,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { playerId, guestToken, rankings, skipped = [] } = await request.json();
    // rankings: [{ dishId: string, rankPosition: number }]
    // skipped: string[] of dishIds the player didn't try

    if (!playerId || !guestToken || !Array.isArray(rankings)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const player = await prisma.sessionPlayer.findFirst({
      where: { id: playerId, sessionId: id, guestToken },
    });
    if (!player) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const session = await prisma.session.findUnique({
      where: { id },
      select: { restaurantId: true, status: true, _count: { select: { players: true } } },
    });
    if (!session || session.status !== "ranking") {
      return NextResponse.json({ error: "Session not in ranking phase" }, { status: 400 });
    }

    const now = new Date();

    await prisma.$transaction([
      // Delete existing rankings for this player in case of resubmit
      prisma.ranking.deleteMany({ where: { sessionPlayerId: playerId, sessionId: id } }),
      // Create new rankings for tried dishes
      prisma.ranking.createMany({
        data: rankings.map(({ dishId, rankPosition }: { dishId: string; rankPosition: number }) => ({
          sessionPlayerId: playerId,
          dishId,
          sessionId: id,
          restaurantId: session.restaurantId,
          rankPosition,
          skipped: false,
          submittedAt: now,
        })),
      }),
      // Create skipped rankings
      prisma.ranking.createMany({
        data: (skipped as string[]).map((dishId: string) => ({
          sessionPlayerId: playerId,
          dishId,
          sessionId: id,
          restaurantId: session.restaurantId,
          rankPosition: null,
          skipped: true,
          submittedAt: now,
        })),
      }),
      // Mark player as submitted
      prisma.sessionPlayer.update({
        where: { id: playerId },
        data: { submittedAt: now },
      }),
    ]);

    // Check if all players have submitted
    const submittedCount = await prisma.sessionPlayer.count({
      where: { sessionId: id, submittedAt: { not: null } },
    });

    if (submittedCount >= session._count.players) {
      await prisma.session.update({
        where: { id },
        data: { status: "results", resultsRevealedAt: now },
      });
      await computeInsights(id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Submit ranking error:", error);
    return NextResponse.json({ error: "Failed to submit ranking" }, { status: 500 });
  }
}
