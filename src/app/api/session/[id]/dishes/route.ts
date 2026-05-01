import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// Single dish add (used during ranking phase)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Bulk add during lobby phase
    if (Array.isArray(body.dishes)) {
      const { dishes, playerId, guestToken } = body;
      if (!playerId || !guestToken || !dishes.length) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      const player = await prisma.sessionPlayer.findFirst({
        where: { id: playerId, sessionId: id, guestToken, isHost: true },
      });
      if (!player) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

      const session = await prisma.session.findUnique({
        where: { id },
        select: { restaurantId: true, status: true },
      });
      if (!session || session.status !== "lobby") {
        return NextResponse.json({ error: "Session not in lobby" }, { status: 400 });
      }

      await prisma.dish.createMany({
        data: dishes.map((name: string, index: number) => ({
          sessionId: id,
          restaurantId: session.restaurantId,
          name,
          sortOrder: index,
        })),
      });
      return NextResponse.json({ ok: true });
    }

    // Single dish add (ranking phase)
    const { name, playerId, guestToken } = body;
    if (!name?.trim() || !playerId || !guestToken) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const player = await prisma.sessionPlayer.findFirst({
      where: { id: playerId, sessionId: id, guestToken },
    });
    if (!player) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const session = await prisma.session.findUnique({
      where: { id },
      select: { restaurantId: true, status: true },
    });
    if (!session || session.status !== "ranking") {
      return NextResponse.json({ error: "Session not accepting dishes" }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: { sessionId: id, restaurantId: session.restaurantId, name: name.trim() },
    });
    return NextResponse.json({ id: dish.id, name: dish.name });
  } catch (error) {
    console.error("Add dish error:", error);
    return NextResponse.json({ error: "Failed to add dish" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { dishId, playerId, guestToken } = await request.json();

  const player = await prisma.sessionPlayer.findFirst({
    where: { id: playerId, sessionId: id, guestToken, isHost: true },
  });
  if (!player) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await prisma.dish.update({
    where: { id: dishId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
