import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import crypto from "crypto";

const JOIN_CODE_CHARS = "BCDFGHJKLMNPQRSTVWXYZ23456789";

async function generateJoinCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = Array.from({ length: 6 }, () =>
      JOIN_CODE_CHARS[Math.floor(Math.random() * JOIN_CODE_CHARS.length)]
    ).join("");

    const existing = await prisma.session.findFirst({
      where: { joinCode: code, status: { not: "archived" } },
    });

    if (!existing) return code;
  }
  throw new Error("Could not generate unique join code after 10 attempts");
}

export async function POST(request: NextRequest) {
  try {
    const { hostName, restaurant, dishes } = await request.json();

    if (!hostName || !restaurant || !dishes?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert restaurant
    let restaurantRecord;
    if (restaurant.placeId) {
      restaurantRecord = await prisma.restaurant.findFirst({
        where: { externalPlaceId: restaurant.placeId },
      });
    }
    if (!restaurantRecord) {
      restaurantRecord = await prisma.restaurant.create({
        data: {
          name: restaurant.name,
          addressLine: restaurant.address ?? null,
          lat: restaurant.lat ?? null,
          lng: restaurant.lng ?? null,
          externalPlaceId: restaurant.placeId ?? null,
          cuisineType: restaurant.cuisineType ?? null,
          isManualEntry: !restaurant.placeId,
        },
      });
    }

    const joinCode = await generateJoinCode();
    const guestToken = crypto.randomBytes(32).toString("hex");

    // Create session + host player + dishes in one transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create session (hostPlayerId set after player is created)
      const session = await tx.session.create({
        data: {
          joinCode,
          restaurantId: restaurantRecord!.id,
          status: "lobby",
        },
      });

      // Create host player
      const hostPlayer = await tx.sessionPlayer.create({
        data: {
          sessionId: session.id,
          displayName: hostName,
          isHost: true,
          guestToken,
        },
      });

      // Link host player back to session
      await tx.session.update({
        where: { id: session.id },
        data: { hostPlayerId: hostPlayer.id },
      });

      // Create dishes
      await tx.dish.createMany({
        data: dishes.map((name: string, index: number) => ({
          sessionId: session.id,
          restaurantId: restaurantRecord!.id,
          name,
          sortOrder: index,
        })),
      });

      return { session, hostPlayer };
    });

    return NextResponse.json({
      sessionId: result.session.id,
      joinCode: result.session.joinCode,
      playerId: result.hostPlayer.id,
      guestToken,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
