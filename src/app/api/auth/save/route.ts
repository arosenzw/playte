import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, playerId, extend } = await req.json();

  await prisma.userSessionLink.upsert({
    where: { sessionPlayerId: playerId },
    create: { userId: user.id, sessionPlayerId: playerId, sessionId },
    update: { userId: user.id },
  });

  await prisma.sessionPlayer.update({
    where: { id: playerId },
    data: { userId: user.id },
  });

  if (extend) {
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: thirtyDays },
    });
  }

  return NextResponse.json({ ok: true });
}
