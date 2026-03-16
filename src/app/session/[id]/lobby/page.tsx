"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

export default function LobbyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [joinCode, setJoinCode] = useState<string | null>(searchParams.get("code"));
  const [playerCount, setPlayerCount] = useState(1);
  const [starting, setStarting] = useState(false);

  // Fetch player count (join code already available from URL), then poll every 3s
  useEffect(() => {
    function fetchCount() {
      fetch(`/api/session/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (!joinCode) setJoinCode(data.joinCode);
          setPlayerCount(data.playerCount);
        });
    }

    fetchCount();
    const interval = setInterval(fetchCount, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Realtime subscription for player count
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`lobby:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "session_players",
          filter: `session_id=eq.${id}`,
        },
        () => {
          setPlayerCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  async function handleStart() {
    if (playerCount < 2 || starting) return;
    setStarting(true);

    const res = await fetch(`/api/session/${id}/start`, { method: "POST" });
    if (res.ok) {
      router.push(`/session/${id}/rank`);
    } else {
      setStarting(false);
    }
  }

  const canStart = playerCount >= 2;

  return (
    <main className="min-h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      {/* Logo */}
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-[#FE392D] text-4xl font-bold">gather around</h1>
        <p className="text-[#6B7280] italic text-base">share this PIN with your table</p>

        {/* Join code */}
        <p className="text-[#FE392D] text-6xl font-bold tracking-wider mt-8">
          {joinCode ?? "------"}
        </p>

        {/* QR code */}
        {joinCode && (
          <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm">
            <QRCodeSVG
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/join/code?code=${joinCode}`}
              size={160}
              fgColor="#FE392D"
              bgColor="#FFFFFF"
            />
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3">
        <p className="text-[#6B7280] text-base">
          {canStart ? `${playerCount} people joined` : "Waiting for playters..."}
        </p>
        <button
          onClick={handleStart}
          disabled={!canStart || starting}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            canStart ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          {starting ? "starting..." : "let's playte"}
        </button>
      </div>
    </main>
  );
}
