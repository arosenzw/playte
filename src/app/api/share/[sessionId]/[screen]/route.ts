import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { rankingsCard }  from "@/lib/shareCards/rankingsCard";
import { mostLovedCard } from "@/lib/shareCards/mostLovedCard";
import { nachoTypeCard } from "@/lib/shareCards/nachoTypeCard";
import { hotColdCard }   from "@/lib/shareCards/hotColdCard";
import { bestBudsCard }  from "@/lib/shareCards/bestBudsCard";
import { summaryCard }   from "@/lib/shareCards/summaryCard";

const FONTS_DIR = path.join(process.cwd(), "public", "fonts");

function loadFont(name: string): Buffer {
  return fs.readFileSync(path.join(FONTS_DIR, name));
}

const CARD_W = 1080;
const CARD_H = 1920;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; screen: string }> }
) {
  const { screen } = await params;

  try {
    const data = await request.json();

    let jsx: React.ReactNode;
    switch (screen) {
      case "rankings":   jsx = rankingsCard(data);  break;
      case "most-loved": jsx = mostLovedCard(data); break;
      case "nacho-type": jsx = nachoTypeCard(data); break;
      case "hot-cold":   jsx = hotColdCard(data);   break;
      case "best-buds":  jsx = bestBudsCard(data);  break;
      case "summary":    jsx = summaryCard(data);    break;
      default:
        return NextResponse.json({ error: "Unknown screen" }, { status: 400 });
    }

    const svg = await satori(jsx as Parameters<typeof satori>[0], {
      width: CARD_W,
      height: CARD_H,
      fonts: [
        { name: "Poppins", data: loadFont("Poppins-Regular.ttf"), weight: 400, style: "normal" },
        { name: "Poppins", data: loadFont("Poppins-Bold.ttf"),    weight: 700, style: "normal" },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: CARD_W } });
    const png = resvg.render().asPng();

    return new NextResponse(png.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[share] error:", e);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
