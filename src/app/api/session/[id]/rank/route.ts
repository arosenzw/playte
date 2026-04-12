import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { spearman, computeBestBuds } from "@/lib/insights";

async function computeInsights(sessionId: string) {
  const allRankings = await prisma.ranking.findMany({
    where: { sessionId },
    select: { sessionPlayerId: true, dishId: true, rankPosition: true },
  });

  const byPlayer: Record<string, Record<string, number>> = {};
  const byDish: Record<string, number[]> = {};

  for (const r of allRankings) {
    if (!byPlayer[r.sessionPlayerId]) byPlayer[r.sessionPlayerId] = {};
    byPlayer[r.sessionPlayerId][r.dishId] = r.rankPosition;
    if (!byDish[r.dishId]) byDish[r.dishId] = [];
    byDish[r.dishId].push(r.rankPosition);
  }

  const dishAvgRanks: Record<string, number> = {};
  const dishRankVariance: Record<string, number> = {};
  for (const [dishId, ranks] of Object.entries(byDish)) {
    const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
    dishAvgRanks[dishId] = avg;
    dishRankVariance[dishId] = ranks.reduce((sum, r) => sum + (r - avg) ** 2, 0) / ranks.length;
  }

  // Consensus ranks: dishes sorted by avg rank → position 1, 2, 3...
  const consensusRanks: Record<string, number> = {};
  Object.entries(dishAvgRanks)
    .sort((a, b) => a[1] - b[1])
    .forEach(([dishId], i) => { consensusRanks[dishId] = i + 1; });

  // Most loved / nacho type
  const firstCounts: Record<string, number> = {};
  const lastCounts: Record<string, number> = {};
  for (const playerRanks of Object.values(byPlayer)) {
    const max = Math.max(...Object.values(playerRanks));
    for (const [dishId, rank] of Object.entries(playerRanks)) {
      if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
      if (rank === max) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
    }
  }

  const mostLovedDishId = Object.entries(firstCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const nachoTypeDishId = Object.entries(dishAvgRanks)
    .filter(([id]) => id !== mostLovedDishId)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const hotColdSorted = Object.entries(dishRankVariance).sort((a, b) => b[1] - a[1]);
  const hotColdDishId = (hotColdSorted[0]?.[1] ?? 0) > 0 ? hotColdSorted[0][0] : null;

  // Player correlation with group consensus
  const playerCorrelations: Record<string, number> = {};
  for (const [playerId, playerRanks] of Object.entries(byPlayer)) {
    playerCorrelations[playerId] = spearman(playerRanks, consensusRanks);
  }

  const playerBestBuds = computeBestBuds(byPlayer);

  // Hot/cold: find actual min/max rank for the most variance dish
  const hotColdRanks = hotColdDishId ? byDish[hotColdDishId] : [];
  const hotColdDetail = hotColdDishId
    ? { high: Math.min(...hotColdRanks), low: Math.max(...hotColdRanks) }
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
    const { playerId, guestToken, rankings } = await request.json();
    // rankings: [{ dishId: string, rankPosition: number }]

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
      // Create new rankings
      prisma.ranking.createMany({
        data: rankings.map(({ dishId, rankPosition }: { dishId: string; rankPosition: number }) => ({
          sessionPlayerId: playerId,
          dishId,
          sessionId: id,
          restaurantId: session.restaurantId,
          rankPosition,
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
