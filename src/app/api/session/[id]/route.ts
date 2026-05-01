import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        _count: { select: { players: true } },
        dishes: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
        restaurant: true,
        hostPlayer: { select: { displayName: true, user: { select: { displayName: true } } } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const submittedCount = await prisma.sessionPlayer.count({
      where: { sessionId: id, submittedAt: { not: null } },
    });

    return NextResponse.json({
      id: session.id,
      joinCode: session.joinCode,
      status: session.status,
      playerCount: session._count.players,
      submittedCount,
      hostPlayerId: session.hostPlayerId,
      hostName: session.hostPlayer?.user?.displayName ?? session.hostPlayer?.displayName ?? null,
      dishes: session.dishes.map((d) => ({ id: d.id, name: d.name, sortOrder: d.sortOrder })),
      restaurant: { name: session.restaurant.name },
    });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
