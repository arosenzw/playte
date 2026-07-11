"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type Dish = { id: string; name: string };
type Player = { id: string; displayName: string; matchPercent: number; rankedDishes: Dish[]; skippedDishes: Dish[] };
type Data = { restaurant: { name: string }; players: Player[] };

const POD_CONFIG = [
  { slotIdx: 1, num: "2", height: 78,  bg: "#DEDEDE", border: "#BDBDBD", numColor: "#888",    winner: false },
  { slotIdx: 0, num: "1", height: 115, bg: "#F5A623", border: "#C88A0A", numColor: "#1A1A1A", winner: true  },
  { slotIdx: 2, num: "3", height: 52,  bg: "#EDCFAA", border: "#C8A070", numColor: "#AA7840", winner: false },
];

function IndividualInner() {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerId = searchParams.get("viewerId") ?? "";
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch(`/api/session/${id}/results`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  const player = data?.players.find((p) => p.id === playerId);
  const top3 = player?.rankedDishes.slice(0, 3) ?? [];
  const rest = player?.rankedDishes.slice(3) ?? [];
  const playersUrl = `/session/${id}/wrapped/players?viewerId=${viewerId}`;

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-6 pb-8">
        <button
          onClick={() => router.push(playersUrl)}
          className="self-start text-[#9CA3AF] italic text-sm mb-4"
        >
          ← playters
        </button>

        <Image src="/logo_long_red.png" alt="playte" width={120} height={40} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-1">{data?.restaurant.name ?? ""}</p>

        {player && (
          <div className="flex items-center gap-2 mt-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#FE392D] flex items-center justify-center flex-shrink-0">
              <Image src="/logo.png" alt="" width={20} height={20} />
            </div>
            <p className="text-[#FE392D] text-xl font-bold">@{player.displayName}</p>
          </div>
        )}

        {/* Static podium — same bar style as wrapped rankings slide, no animations */}
        {top3.length > 0 && (
          <div className="w-full max-w-sm">
            <div className="flex items-end justify-center gap-3 w-[80%] mx-auto">
              {POD_CONFIG.map((pod, pi) => {
                const dish = top3[pod.slotIdx];
                if (!dish) return <div key={pi} className="flex-1" />;
                return (
                  <div key={pi} className="flex flex-col items-center flex-1 min-w-0">
                    <div className="mb-3 w-full flex flex-col items-center px-1">
                      {pod.winner ? (
                        <span
                          className="text-[13px] font-bold text-white text-center leading-tight"
                          style={{ background: "#FE392D", padding: "3px 8px", borderRadius: 999, wordBreak: "break-word" }}
                        >
                          {dish.name}
                        </span>
                      ) : (
                        <span
                          className="text-[13px] font-bold text-[#888] text-center leading-tight"
                          style={{ wordBreak: "break-word" }}
                        >
                          {dish.name}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: pod.height,
                        background: pod.bg,
                        border: `2.5px solid ${pod.border}`,
                        borderRadius: "10px 10px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 26, fontWeight: "bold", color: pod.numColor }}>{pod.num}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-[2px] bg-[#E5DFD5] w-[80%] mx-auto" />
          </div>
        )}

        {/* Remaining ranked dishes */}
        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          {rest.map((dish, i) => (
            <div key={dish.id} className="flex items-center gap-3">
              <span className="text-[#FE392D] text-base font-bold w-5 text-right flex-shrink-0">
                {i + 4}
              </span>
              <div className="flex-1 bg-white border border-[#F0E8D0] rounded-xl px-3 py-2.5 shadow-sm">
                <span className="text-[#444] text-sm font-semibold">{dish.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Didn't try */}
        {(player?.skippedDishes?.length ?? 0) > 0 && (
          <div className="w-full max-w-sm mt-5">
            <p className="text-[#9CA3AF] text-xs italic text-center mb-2">didn&apos;t try</p>
            <div className="flex flex-col gap-2">
              {player!.skippedDishes.map((dish) => (
                <div key={dish.id} className="flex items-center gap-3">
                  <span className="w-5 flex-shrink-0" />
                  <div className="flex-1 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl px-3 py-2.5">
                    <span className="text-[#9CA3AF] text-sm">{dish.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function WrappedIndividualPage() {
  return (
    <Suspense>
      <IndividualInner />
    </Suspense>
  );
}
