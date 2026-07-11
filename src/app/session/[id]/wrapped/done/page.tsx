"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function DoneInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerId = searchParams.get("viewerId") ?? "";
  const fromHistory = searchParams.get("from") === "history";
  const [restaurantName, setRestaurantName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isSaved = sessionStorage.getItem(`saved_${id}`) === "1";
    setSaved(isSaved);
    const pid = viewerId || sessionStorage.getItem("playerId") || "";
    fetch(`/api/session/${id}/results${pid ? `?playerId=${pid}` : ""}`)
      .then((r) => r.json())
      .then((data) => setRestaurantName(data.restaurant?.name ?? ""));
  }, [id, viewerId]);

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
    <main className="h-dvh bg-[#FFF8E8] flex flex-col items-center justify-between px-6 pt-12 pb-14">
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo_long_red.png" alt="playte" width={130} height={44} priority />
        {restaurantName && (
          <p className="text-[#9CA3AF] italic text-sm">{restaurantName}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-[#FE392D] text-4xl font-bold text-center">that&apos;s a wrap!</p>
        <p className="text-[#9CA3AF] text-base italic text-center">what&apos;s next?</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => router.push(wrappedUrl)}
          className="w-full bg-[#FE392D] text-white text-base font-bold py-4 rounded-2xl shadow-sm"
        >
          ↺ re-playte the results
        </button>
        <button
          onClick={() => router.push(playersUrl)}
          className="w-full bg-white border-2 border-[#FCCC75] text-[#FE392D] text-base font-bold py-4 rounded-2xl shadow-sm"
        >
          👥 individual rankings
        </button>
        <button
          onClick={handleSave}
          disabled={saved || saving}
          className={`w-full text-sm font-semibold py-3.5 rounded-2xl transition-colors ${
            saved
              ? "text-[#FE392D] bg-white border-2 border-[#FCCC75]"
              : "text-[#9CA3AF] bg-transparent border-2 border-transparent"
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
