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

  const history = links.map((link) => {
    const session = link.sessionPlayer.session;
    const insights = session.insights;

    let topDish: string | null = null;

    if (insights && insights.dishAvgRanks) {
      const avgRanks = insights.dishAvgRanks as Record<string, number>;
      let bestDishId: string | null = null;
      let bestRank = Infinity;

      for (const [dishId, rank] of Object.entries(avgRanks)) {
        if (rank < bestRank) {
          bestRank = rank;
          bestDishId = dishId;
        }
      }

      if (bestDishId) {
        const dish = session.dishes.find((d) => d.id === bestDishId);
        topDish = dish?.name ?? null;
      }
    }

    const date = new Date(session.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      sessionId: session.id,
      restaurantName: session.restaurant.name,
      date,
      playerCount: session.players.length,
      topDish,
    };
  });

  return NextResponse.json(history);
}
