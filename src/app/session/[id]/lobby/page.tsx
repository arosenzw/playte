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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

  async function handleShare() {
    const url = `${window.location.origin}/join/code?code=${joinCode}`;
    const text = `join my playte game! use code ${joinCode} or tap the link: ${url}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(url);
      alert("link copied!");
    }
  }

  return (
    <main className="fixed inset-0 bg-[#FFF8E8] flex flex-col items-center px-6 pt-8 pb-6">
      {/* Logo */}
      <Image src="/logo.png" alt="playte" width={56} height={56} priority />

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center w-full max-w-sm">
        <h1 className="text-[#FE392D] text-3xl font-bold">waiting room</h1>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[#FE392D] text-6xl font-bold">{playerCount}</span>
          <span className="text-[#6B7280] italic text-sm">
            {playerCount === 1 ? "playter joined" : "playters joined"}
          </span>
        </div>

        {/* PIN + invite — smaller, secondary */}
        {joinCode && (
          <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-4 py-3 mt-2">
            <QRCodeSVG
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/join/code?code=${joinCode}`}
              size={56}
              fgColor="#FE392D"
              bgColor="transparent"
            />
            <div className="text-left">
              <p className="text-[#9CA3AF] text-xs italic">pin</p>
              <p className="text-[#FE392D] text-2xl font-bold tracking-wider">{joinCode}</p>
              <button
                onClick={handleShare}
                className="text-[#9CA3AF] text-xs underline mt-0.5"
              >
                invite via text
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Button pinned at bottom */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2">
        <p className="text-[#6B7280] text-sm">
          {canStart ? "everyone in? let's go!" : "need at least 2 playters to start"}
        </p>
        <button
          onClick={handleStart}
          disabled={!canStart || starting}
          className={`w-full text-white text-xl font-semibold py-4 rounded-full transition-colors ${
            canStart ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          {starting ? "starting..." : "let's playte"}
        </button>
      </div>
    </main>
  );
}
