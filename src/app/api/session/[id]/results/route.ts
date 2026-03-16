import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

function spearman(a: Record<string, number>, b: Record<string, number>): number {
  const dishes = Object.keys(a).filter((d) => b[d] !== undefined);
  const n = dishes.length;
  if (n < 2) return 50;
  const dSq = dishes.reduce((sum, d) => sum + (a[d] - b[d]) ** 2, 0);
  const rho = 1 - (6 * dSq) / (n * (n * n - 1));
  return Math.max(0, Math.round(((rho + 1) / 2) * 100));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const viewerPlayerId = request.nextUrl.searchParams.get("playerId");

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        restaurant: { select: { name: true } },
        dishes: { where: { deletedAt: null }, select: { id: true, name: true } },
        players: { select: { id: true, displayName: true, user: { select: { displayName: true } } } },
        insights: true,
      },
    });

    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const insights = session.insights;
    const dishAvgRanks = (insights?.dishAvgRanks ?? {}) as Record<string, number>;
    const playerCorrelations = (insights?.playerCorrelations ?? {}) as Record<string, number>;
    const playerBestBudsRaw = (insights?.playerBestBuds ?? {}) as Record<string, { playerId: string; match: number } | unknown>;
    const hotColdDetail = (playerBestBudsRaw as Record<string, unknown>).hotColdDetail as { high: number; low: number } | null ?? null;

    // Ranked dishes (group consensus)
    const rankedDishes = session.dishes
      .map((d) => ({ id: d.id, name: d.name, avgRank: dishAvgRanks[d.id] ?? 999 }))
      .sort((a, b) => a.avgRank - b.avgRank);

    // Players with match % — prefer linked User.displayName over stored session name
    const players = session.players.map((p) => ({
      id: p.id,
      displayName: p.user?.displayName ?? p.displayName,
      matchPercent: playerCorrelations[p.id] ?? 0,
    }));

    // Per-player rankings (for individual view)
    const allRankings = await prisma.ranking.findMany({
      where: { sessionId: id },
      select: { sessionPlayerId: true, dishId: true, rankPosition: true },
    });

    const byPlayer: Record<string, Record<string, number>> = {};
    for (const r of allRankings) {
      if (!byPlayer[r.sessionPlayerId]) byPlayer[r.sessionPlayerId] = {};
      byPlayer[r.sessionPlayerId][r.dishId] = r.rankPosition;
    }

    const viewerRanks = viewerPlayerId ? (byPlayer[viewerPlayerId] ?? {}) : null;

    const playersWithRankings = players.map((p) => {
      const playerRanks = byPlayer[p.id] ?? {};
      const rankedByPlayer = session.dishes
        .filter((d) => playerRanks[d.id] !== undefined)
        .map((d) => ({ id: d.id, name: d.name, position: playerRanks[d.id] }))
        .sort((a, b) => a.position - b.position);
      // Match % = viewer-vs-this-player (not vs group consensus)
      const matchPercent = viewerRanks && p.id !== viewerPlayerId
        ? spearman(viewerRanks, playerRanks)
        : p.matchPercent;
      return { ...p, matchPercent, rankedDishes: rankedByPlayer };
    });

    // Insight details
    const dishMap = Object.fromEntries(session.dishes.map((d) => [d.id, d.name]));
    const playerMap = Object.fromEntries(session.players.map((p) => [p.id, p.user?.displayName ?? p.displayName]));

    const firstCounts: Record<string, number> = {};
    const lastCounts: Record<string, number> = {};
    for (const [, playerRanks] of Object.entries(byPlayer)) {
      const max = Math.max(...Object.values(playerRanks));
      for (const [dishId, rank] of Object.entries(playerRanks)) {
        if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
        if (rank === max) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
      }
    }

    const mostLovedId = insights?.mostLovedDishId ?? null;
    const nachoTypeId = insights?.nachoTypeDishId ?? null;
    const hotColdId = insights?.hotColdDishId ?? null;

    // Best bud for viewer
    let bestBud = null;
    if (viewerPlayerId && playerBestBudsRaw[viewerPlayerId]) {
      const bud = playerBestBudsRaw[viewerPlayerId] as { playerId: string; match: number };
      bestBud = { displayName: playerMap[bud.playerId] ?? "someone", matchPercent: bud.match };
    }

    return NextResponse.json({
      restaurant: { name: session.restaurant.name },
      rankedDishes,
      players: playersWithRankings,
      insights: {
        mostLoved: mostLovedId ? { id: mostLovedId, name: dishMap[mostLovedId], count: firstCounts[mostLovedId] ?? 0 } : null,
        nachoType: nachoTypeId ? { id: nachoTypeId, name: dishMap[nachoTypeId], count: lastCounts[nachoTypeId] ?? 0 } : null,
        hotCold: hotColdId ? { id: hotColdId, name: dishMap[hotColdId], highRank: hotColdDetail?.high ?? 1, lowRank: hotColdDetail?.low ?? session.dishes.length } : null,
        bestBud,
      },
    });
  } catch (error) {
    console.error("Results error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
