import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { spearman, computeBestBuds, computeScores } from "@/lib/insights";

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

  const {
    dishAvgPoints: dishAvgRanks,
    dishRankVariance,
    mostLovedDishId,
    nachoTypeDishId,
    hotColdDishId,
    hotColdDetail,
  } = computeScores(rankedByPlayer, skippedByPlayer);

  // Player correlation with group consensus
  const consensusRanks: Record<string, number> = {};
  Object.entries(dishAvgRanks)
    .sort((a, b) => b[1] - a[1])
    .forEach(([dishId], i) => { consensusRanks[dishId] = i + 1; });

  const playerCorrelations: Record<string, number> = {};
  for (const [playerId, playerRanks] of Object.entries(rankedByPlayer)) {
    playerCorrelations[playerId] = spearman(playerRanks, consensusRanks) ?? 0;
  }

  const playerBestBuds = computeBestBuds(rankedByPlayer, skippedByPlayer);

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
