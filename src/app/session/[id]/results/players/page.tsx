"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type Player = { id: string; displayName: string; matchPercent: number };
type Data = { restaurant: { name: string }; players: Player[] };

export default function ResultsPlayersPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const pid = sessionStorage.getItem("playerId");
    setMyPlayerId(pid);
    const qs = pid ? `?playerId=${pid}` : "";
    fetch(`/api/session/${id}/results${qs}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  const me = data?.players.find((p) => p.id === myPlayerId);
  const others = data?.players.filter((p) => p.id !== myPlayerId) ?? [];

  function PlayerCard({ player, isMe }: { player: Player; isMe: boolean }) {
    return (
      <button
        onClick={() => router.push(`/session/${id}/results/players/${player.id}`)}
        className="w-full bg-[#FFFCF5] rounded-2xl px-4 py-4 text-left shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[#FE392D] text-lg font-semibold">
              {player.displayName}{isMe && <span className="text-[#9CA3AF] text-sm font-normal ml-2">(you)</span>}
            </p>
            {!isMe && (
              <div className="relative w-full bg-[#FCCC75]/30 rounded-full h-6 mt-2 overflow-hidden">
                <div className="bg-[#FCCC75] h-full rounded-full" style={{ width: `${player.matchPercent}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[#646464] text-xs font-semibold">
                  {player.matchPercent}% match
                </span>
              </div>
            )}
          </div>
          <div className="ml-4 w-12 h-12 rounded-full bg-[#FE392D] flex items-center justify-center flex-shrink-0">
            <Image src="/logo.png" alt="" width={32} height={32} />
          </div>
        </div>
      </button>
    );
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4">
        <Image src="/logo.png" alt="playte" width={70} height={70} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-2">{data?.restaurant.name ?? ""}</p>
        <h1 className="text-[#FE392D] text-3xl font-bold mt-1">playters</h1>

        <div className="w-full max-w-sm flex flex-col gap-3 mt-6">
          {me && <PlayerCard player={me} isMe />}
          {others.map((player) => (
            <PlayerCard key={player.id} player={player} isMe={false} />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 pb-8 pt-4 bg-[#FFF8E8] w-full flex justify-center">
        <div className="w-full max-w-sm flex flex-col gap-2">
          <button
            onClick={() => router.push(`/session/${id}/results`)}
            className="w-full bg-[#F88888] text-white text-base font-semibold py-3 rounded-full"
          >
            table results
          </button>
          <button
            onClick={() => router.push(`/session/${id}/results/flavor`)}
            className="w-full bg-[#F88888] text-white text-base font-semibold py-3 rounded-full"
          >
            flavor journey
          </button>
        </div>
      </div>
    </main>
  );
}
