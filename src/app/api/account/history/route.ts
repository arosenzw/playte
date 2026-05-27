import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.userSessionLink.findMany({
    where: { userId: user.id },
    orderBy: { linkedAt: "desc" },
    include: {
      sessionPlayer: {
        include: {
          session: {
            include: {
              restaurant: { select: { name: true } },
              players: { select: { id: true } },
              dishes: {
                where: { deletedAt: null },
                select: { id: true, name: true },
              },
              insights: {
                select: { dishAvgRanks: true, mostLovedDishId: true },
              },
            },
          },
        },
      },
    },
  });

  const upcoming: object[] = [];
  const history: object[] = [];

  for (const link of links) {
    const session = link.sessionPlayer.session;
    const insights = session.insights;

    const date = new Date(session.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (session.status === "lobby") {
      upcoming.push({
        sessionId: session.id,
        playerId: link.sessionPlayer.id,
        restaurantName: session.restaurant.name,
        date,
        joinCode: session.joinCode,
      });
      continue;
    }

    let topDish: string | null = null;
    if (insights?.dishAvgRanks) {
      const avgRanks = insights.dishAvgRanks as Record<string, number>;
      let bestDishId: string | null = null;
      let bestPoints = -1;
      for (const [dishId, pts] of Object.entries(avgRanks)) {
        if (pts > bestPoints) { bestPoints = pts; bestDishId = dishId; }
      }
      if (bestDishId) {
        topDish = session.dishes.find((d) => d.id === bestDishId)?.name ?? null;
      }
    }

    history.push({
      sessionId: session.id,
      playerId: link.sessionPlayer.id,
      restaurantName: session.restaurant.name,
      date,
      playerCount: session.players.length,
      topDish,
    });
  }

  return NextResponse.json({ upcoming, history });
}
