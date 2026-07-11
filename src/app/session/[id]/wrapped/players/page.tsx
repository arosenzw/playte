"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type Player = { id: string; displayName: string; matchPercent: number | null };
type Data = { restaurant: { name: string }; players: Player[] };

function PlayersInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerId = searchParams.get("viewerId") ?? "";
  const [data, setData] = useState<Data | null>(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const pid = viewerId || sessionStorage.getItem("playerId") || "";
    setMyId(pid);
    fetch(`/api/session/${id}/results${pid ? `?playerId=${pid}` : ""}`)
      .then((r) => r.json())
      .then(setData);
  }, [id, viewerId]);

  const me = data?.players.find((p) => p.id === myId);
  const others = data?.players.filter((p) => p.id !== myId) ?? [];
  const doneUrl = `/session/${id}/wrapped/done?viewerId=${viewerId}`;

  function playerUrl(playerId: string) {
    return `/session/${id}/wrapped/players/${playerId}?viewerId=${viewerId}`;
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-6 pb-6">
        <button
          onClick={() => router.push(doneUrl)}
          className="self-start text-[#9CA3AF] italic text-sm mb-4"
        >
          ← back
        </button>

        <Image src="/logo_long_red.png" alt="playte" width={120} height={40} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-1">{data?.restaurant.name ?? ""}</p>
        <h1 className="text-[#FE392D] text-2xl font-bold mt-2 mb-6">playters</h1>

        <div className="w-full max-w-sm flex flex-col gap-3">
          {me && (
            <button
              onClick={() => router.push(playerUrl(me.id))}
              className="w-full bg-[#FFFCF5] rounded-2xl px-4 py-4 text-left border-2 border-[#FE392D]/20 shadow-sm"
            >
              <p className="text-[#FE392D] text-lg font-semibold">
                {me.displayName}
                <span className="text-[#9CA3AF] text-sm font-normal ml-2">(you)</span>
              </p>
            </button>
          )}
          {others.map((player) => (
            <button
              key={player.id}
              onClick={() => router.push(playerUrl(player.id))}
              className="w-full bg-[#FFFCF5] rounded-2xl px-4 py-4 text-left border-2 border-[#FCCC75]/60 shadow-sm"
            >
              <p className="text-[#FE392D] text-lg font-semibold">{player.displayName}</p>
              {player.matchPercent !== null ? (
                <div className="relative w-full bg-[#FCCC75]/20 rounded-full h-6 mt-2 overflow-hidden">
                  <div
                    className="bg-[#FCCC75] h-full rounded-full"
                    style={{ width: `${player.matchPercent}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[#646464] text-xs font-semibold">
                    {player.matchPercent}% match
                  </span>
                </div>
              ) : (
                <p className="text-[#9CA3AF] text-xs italic mt-2">didn&apos;t try the same dishes</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function WrappedPlayersPage() {
  return (
    <Suspense>
      <PlayersInner />
    </Suspense>
  );
}
