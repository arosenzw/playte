import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { name, playerId, guestToken } = await request.json();

    if (!name?.trim() || !playerId || !guestToken) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify player belongs to session
    const player = await prisma.sessionPlayer.findFirst({
      where: { id: playerId, sessionId: id, guestToken },
    });
    if (!player) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const session = await prisma.session.findUnique({
      where: { id },
      select: { restaurantId: true, status: true },
    });
    if (!session || session.status !== "ranking") {
      return NextResponse.json({ error: "Session not accepting dishes" }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: {
        sessionId: id,
        restaurantId: session.restaurantId,
        name: name.trim(),
      },
    });

    return NextResponse.json({ id: dish.id, name: dish.name });
  } catch (error) {
    console.error("Add dish error:", error);
    return NextResponse.json({ error: "Failed to add dish" }, { status: 500 });
  }
}
