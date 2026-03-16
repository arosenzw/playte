"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Podium } from "@/components/ui/Podium";
import { PodiumShareCard } from "@/components/ui/ShareCards/PodiumShareCard";
import { pregenerateBlob, shareBlob } from "@/lib/shareImage";

type Dish = { id: string; name: string; position: number };
type Player = { id: string; displayName: string; matchPercent: number; rankedDishes: Dish[] };
type Data = { restaurant: { name: string }; players: Player[] };

export default function ResultsIndividualPage() {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null!);
  const cachedBlob = useRef<Blob | null>(null);

  useEffect(() => {
    fetch(`/api/session/${id}/results`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  const player = data?.players.find((p) => p.id === playerId);
  const top3 = player?.rankedDishes.slice(0, 3) ?? [];
  const rest = player?.rankedDishes.slice(3) ?? [];

  useEffect(() => {
    if (!player) return;
    setTimeout(async () => {
      if (cardRef.current) cachedBlob.current = await pregenerateBlob(cardRef.current);
    }, 800);
  }, [player]);

  async function handleShare() {
    if (!cachedBlob.current) return;
    setSharing(true);
    try {
      await shareBlob(cachedBlob.current, "playte-my-rankings.png");
    } finally {
      setSharing(false);
    }
  }

  return (
    <main className="h-screen bg-[#FFF8E8] flex flex-col">
      {player && data && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", pointerEvents: "none" }}>
          <PodiumShareCard restaurantName={data.restaurant.name} handle={player.displayName} dishes={player.rankedDishes} cardRef={cardRef} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4">
        <button onClick={() => router.back()} className="self-start text-[#9CA3AF] italic text-sm mb-2">
          ← individual rankings
        </button>
        <Image src="/logo_long_red.png" alt="playte" width={160} height={52} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-2">{data?.restaurant.name ?? ""}</p>

        {player && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-full bg-[#FE392D] flex items-center justify-center">
              <Image src="/logo.png" alt="" width={24} height={24} />
            </div>
            <p className="text-[#FE392D] text-xl font-bold">@{player.displayName}</p>
          </div>
        )}

        {top3.length >= 1 && (
          <div className="w-full max-w-sm mt-4">
            <Podium dishes={top3} />
          </div>
        )}

        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          {rest.map((dish, i) => (
            <div key={dish.id} className="flex items-center gap-3">
              <span className="text-[#FE392D] text-lg font-bold w-6 text-right flex-shrink-0">
                {i + 4}
              </span>
              <div className="flex-1 bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-2xl px-4 py-3">
                <span className="text-[#646464] text-base">{dish.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
