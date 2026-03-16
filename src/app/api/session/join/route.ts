import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { code, playerName } = await request.json();

    if (!code || !playerName) {
      return NextResponse.json({ error: "Missing code or name" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { joinCode: code.toUpperCase(), status: { not: "archived" } },
      include: { _count: { select: { players: true } } },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.status !== "lobby") {
      return NextResponse.json({ error: "Game has already started" }, { status: 400 });
    }
    if (session._count.players >= session.maxPlayers) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 });
    }

    const guestToken = crypto.randomBytes(32).toString("hex");

    const player = await prisma.sessionPlayer.create({
      data: {
        sessionId: session.id,
        displayName: playerName,
        isHost: false,
        guestToken,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      playerId: player.id,
      guestToken,
    });
  } catch (error) {
    console.error("Join session error:", error);
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }
}
