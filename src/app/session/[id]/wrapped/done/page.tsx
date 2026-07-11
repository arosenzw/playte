"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import AccountStatus from "@/components/ui/AccountStatus";

function DoneInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerId = searchParams.get("viewerId") ?? "";
  const fromHistory = searchParams.get("from") === "history";
  const [restaurantName, setRestaurantName] = useState("");
  const [date, setDate] = useState("");
  const [saved, setSaved] = useState(fromHistory); // history games are already saved
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!fromHistory) {
      const isSaved = sessionStorage.getItem(`saved_${id}`) === "1";
      setSaved(isSaved);
    }
    const pid = viewerId || sessionStorage.getItem("playerId") || "";
    fetch(`/api/session/${id}/results${pid ? `?playerId=${pid}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setRestaurantName(data.restaurant?.name ?? "");
        if (data.date) {
          setDate(new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase());
        }
      });
  }, [id, viewerId, fromHistory]);

  async function handleSave() {
    if (saved || saving) return;
    const playerId = sessionStorage.getItem("playerId") || viewerId;
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setSaving(true);
    const res = await fetch("/api/auth/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, playerId }),
    });
    if (res.ok) {
      sessionStorage.setItem(`saved_${id}`, "1");
      setSaved(true);
    }
    setSaving(false);
  }

  const wrappedUrl = `/session/${id}/wrapped?viewerId=${viewerId}${fromHistory ? "&from=history" : ""}`;
  const playersUrl = `/session/${id}/wrapped/players?viewerId=${viewerId}`;

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-12 pb-14 relative">
      <AccountStatus corner />
      {/* Logo */}
      <Image src="/logo_long_red.png" alt="playte" width={110} height={37} priority />

      {/* Date */}
      <p className="text-[#9CA3AF] font-bold text-[10px] tracking-widest uppercase mt-3">{date}</p>

      {/* Yellow divider */}
      <div className="w-10 h-[3px] bg-[#FCCC75] rounded-full mt-2" />

      {/* Restaurant name — biggest element */}
      {restaurantName && (
        <p className="text-[#FE392D] text-4xl font-bold text-center mt-4 leading-tight">{restaurantName}</p>
      )}

      {/* Subtitle */}
      <p className="text-[#9CA3AF] text-lg italic text-center mt-2">that&apos;s a wrap!</p>

      {/* Buttons — centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-sm gap-3">
        <button
          onClick={() => router.push(wrappedUrl)}
          className="w-full bg-[#FE392D] text-white text-base font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-3"
        >
          <span className="text-2xl leading-none">↺</span>
          <span>re-playte the results</span>
        </button>
        <button
          onClick={() => router.push(playersUrl)}
          className="w-full bg-white border-2 border-[#FCCC75] text-[#FE392D] text-base font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-3"
        >
          <span className="text-xl leading-none">👥</span>
          <span>individual rankings</span>
        </button>
        <button
          onClick={handleSave}
          disabled={saved || saving}
          className={`w-full text-base font-bold py-4 rounded-2xl shadow-sm border-2 transition-colors ${
            saved
              ? "bg-white border-[#FCCC75] text-[#FE392D]"
              : "bg-white border-[#E5E7EB] text-[#9CA3AF]"
          }`}
        >
          {saved ? "saved to account ✓" : saving ? "saving..." : "save to account"}
        </button>
      </div>
    </main>
  );
}

export default function DonePage() {
  return (
    <Suspense>
      <DoneInner />
    </Suspense>
  );
}
