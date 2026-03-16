import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.status !== "lobby") {
      return NextResponse.json({ error: "Session is not in lobby" }, { status: 400 });
    }

    await prisma.session.update({
      where: { id },
      data: { status: "ranking", rankingStartedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Start session error:", error);
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }
}
