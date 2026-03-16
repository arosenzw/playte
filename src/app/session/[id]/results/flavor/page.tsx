"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FlavorJourneyShareCard } from "@/components/ui/ShareCards/FlavorJourneyShareCard";
import { pregenerateBlob, shareBlob } from "@/lib/shareImage";

type Insights = {
  mostLoved: { name: string; count: number } | null;
  nachoType: { name: string; count: number } | null;
  hotCold: { name: string; highRank: number; lowRank: number } | null;
  bestBud: { displayName: string; matchPercent: number } | null;
};
type Data = { restaurant: { name: string }; insights: Insights };

function InsightCard({
  emoji,
  title,
  subtitle,
  value,
  detail,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="w-full bg-[#FFFCF5] rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-2">
      <p className="text-[#FE392D] text-base font-bold text-center">
        {emoji}&nbsp;&nbsp;{title}&nbsp;&nbsp;{emoji}
      </p>
      <p className="text-[#646464] text-xs text-center">{subtitle}</p>
      <div className="bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-xl px-4 py-3 text-[#646464] text-base text-center">
        {value}
      </div>
      <div className="bg-[#FCCC75] rounded-full px-3 py-1 text-[#646464] text-xs text-center self-center">
        {detail}
      </div>
    </div>
  );
}

export default function FlavorJourneyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null!);
  const cachedBlob = useRef<Blob | null>(null);

  useEffect(() => {
    const playerId = sessionStorage.getItem("playerId");
    const url = `/api/session/${id}/results${playerId ? `?playerId=${playerId}` : ""}`;
    fetch(url).then((r) => r.json()).then(setData);
  }, [id]);

  useEffect(() => {
    if (!data) return;
    setTimeout(async () => {
      if (cardRef.current) cachedBlob.current = await pregenerateBlob(cardRef.current);
    }, 800);
  }, [data]);

  const ins = data?.insights;

  async function handleShare() {
    if (!cachedBlob.current) return;
    setSharing(true);
    try {
      await shareBlob(cachedBlob.current, "playte-flavor-journey.png");
    } finally {
      setSharing(false);
    }
  }

  function goToMyRankings() {
    router.push(`/session/${id}/results/players`);
  }

  return (
    <main className="h-screen bg-[#FFF8E8] flex flex-col">
      {data && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", pointerEvents: "none" }}>
          <FlavorJourneyShareCard restaurantName={data.restaurant.name} insights={data.insights} cardRef={cardRef} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4">
        <button onClick={() => router.back()} className="self-start text-[#9CA3AF] italic text-sm mb-2">
          ← ranking results
        </button>
        <Image src="/logo_long_red.png" alt="playte" width={180} height={60} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-1">{data?.restaurant.name ?? ""}</p>
        <h1 className="text-[#FE392D] text-3xl font-bold mt-2 mb-6">Flavor Journey</h1>

        <div className="w-full max-w-sm flex flex-col gap-4">
          {ins?.mostLoved && (
            <InsightCard emoji="😍" title="most loved" subtitle="clean plate club" value={ins.mostLoved.name} detail={`ranked #1 by ${ins.mostLoved.count}`} />
          )}
          {ins?.nachoType && (
            <InsightCard emoji="🥴" title="nacho type" subtitle="zero out of ten, respectfully" value={ins.nachoType.name} detail={`ranked last by ${ins.nachoType.count}`} />
          )}
          {ins?.hotCold && (
            <InsightCard emoji="😐" title="hot & cold" subtitle="most controversial playte debate" value={ins.hotCold.name} detail={`as high as #${ins.hotCold.highRank}, as low as #${ins.hotCold.lowRank}`} />
          )}
          {ins?.bestBud && (
            <InsightCard emoji="👯" title="best (taste) buds" subtitle="you should share next time" value={ins.bestBud.displayName} detail={`${ins.bestBud.matchPercent}% match`} />
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 pb-8 pt-4 bg-[#FFF8E8] w-full flex justify-center">
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={handleShare}
            disabled={sharing || !data}
            className="w-full bg-[#FE392D] text-white text-xl font-semibold py-4 rounded-full disabled:opacity-60"
          >
            {sharing ? "generating..." : "share flavor journey"}
          </button>
          <button
            onClick={goToMyRankings}
            className="w-full bg-[#F88888] text-white text-xl font-semibold py-4 rounded-full"
          >
            individual rankings →
          </button>
        </div>
      </div>
    </main>
  );
}
