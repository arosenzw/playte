/**
 * Dev seed script — creates a test session you can jump straight into.
 *
 * Usage:
 *   npm run dev:seed              → ranking phase (default)
 *   npm run dev:seed -- --results → results phase (all players submitted)
 *
 * Outputs a localhost URL. Open it to land directly on the target page.
 */

import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

const DISHES = [
  "Truffle Fries",
  "Burrata Toast",
  "Spicy Tuna Roll",
  "Wagyu Slider",
  "Lobster Bisque",
  "Crispy Brussels Sprouts",
  "Bone Marrow Crostini",
  "Duck Confit Tacos",
  "Miso Black Cod",
  "Pistachio Crème Brûlée",
];

const PLAYER_NAMES = ["Alex", "Jordan", "Sam", "Riley"];

function randomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function randomToken() {
  return crypto.randomBytes(16).toString("hex");
}

async function main() {
  const wantResults = process.argv.includes("--results");

  // ── Find or create a dev restaurant ──────────────────────────────────────
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: "Dev Restaurant" },
  });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { name: "Dev Restaurant" },
    });
  }

  const joinCode = randomCode();

  // ── Create session ────────────────────────────────────────────────────────
  const session = await prisma.session.create({
    data: {
      restaurantId: restaurant.id,
      joinCode,
      status: wantResults ? "results" : "ranking",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      resultsRevealedAt: wantResults ? new Date() : null,
    },
  });

  // ── Create host player ────────────────────────────────────────────────────
  const hostToken = randomToken();
  const host = await prisma.sessionPlayer.create({
    data: {
      sessionId: session.id,
      displayName: "You (Host)",
      guestToken: hostToken,
      isHost: true,
      submittedAt: wantResults ? new Date() : null,
    },
  });

  // ── Create extra players (for results page context) ───────────────────────
  const extraPlayers = [];
  if (wantResults) {
    for (const name of PLAYER_NAMES) {
      const p = await prisma.sessionPlayer.create({
        data: {
          sessionId: session.id,
          displayName: name,
          guestToken: randomToken(),
          isHost: false,
          submittedAt: new Date(),
        },
      });
      extraPlayers.push(p);
    }
  }

  // ── Create dishes ─────────────────────────────────────────────────────────
  const dishes = await Promise.all(
    DISHES.map((name) =>
      prisma.dish.create({
        data: { sessionId: session.id, restaurantId: restaurant!.id, name },
      })
    )
  );

  // ── Submit rankings for results phase ─────────────────────────────────────
  if (wantResults) {
    const allPlayers = [host, ...extraPlayers];
    const now = new Date();

    for (const player of allPlayers) {
      // Shuffle dishes differently per player
      const shuffled = [...dishes].sort(() => Math.random() - 0.5);
      const tried = shuffled.slice(0, Math.floor(Math.random() * 2) + dishes.length - 1); // skip 0 or 1
      const skipped = shuffled.slice(tried.length);

      await prisma.ranking.createMany({
        data: [
          ...tried.map((d, i) => ({
            sessionId: session.id,
            restaurantId: restaurant!.id,
            sessionPlayerId: player.id,
            dishId: d.id,
            rankPosition: i + 1,
            skipped: false,
            submittedAt: now,
          })),
          ...skipped.map((d) => ({
            sessionId: session.id,
            restaurantId: restaurant!.id,
            sessionPlayerId: player.id,
            dishId: d.id,
            rankPosition: null,
            skipped: true,
            submittedAt: now,
          })),
        ],
      });
    }

    console.log("  (insights not auto-computed — open any player's rank page and re-submit to trigger them)");
  }

  // ── Print the dev URL ─────────────────────────────────────────────────────
  const base = "http://localhost:3000";
  const params = new URLSearchParams({
    session: session.id,
    player: host.id,
    token: hostToken,
    code: joinCode,
    host: "true",
    page: wantResults ? "results" : "rank",
  });

  console.log("\n✅ Dev session created!\n");
  console.log(`   Session ID:  ${session.id}`);
  console.log(`   Join code:   ${joinCode}`);
  console.log(`   Restaurant:  ${restaurant.name}`);
  console.log(`   Dishes:      ${dishes.map((d) => d.name).join(", ")}`);
  if (wantResults) {
    console.log(`   Players:     You (Host) + ${PLAYER_NAMES.join(", ")}`);
  }
  console.log(`\n👉 Open this URL:\n`);
  console.log(`   ${base}/dev?${params.toString()}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
