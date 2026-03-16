import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId, email, displayName } = await req.json();

  try {
    await prisma.user.create({
      data: { id: userId, email, displayName },
    });
  } catch {
    // User already exists — unique constraint violation, that's fine
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { displayName: true } });
  return NextResponse.json({ displayName: dbUser?.displayName ?? null });
}
