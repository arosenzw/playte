"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Podium } from "@/components/ui/Podium";
import { PodiumShareCard } from "@/components/ui/ShareCards/PodiumShareCard";
import { pregenerateBlob, shareBlob } from "@/lib/shareImage";
import AccountStatus from "@/components/ui/AccountStatus";

type Dish = { id: string; name: string; avgRank: number };
type ResultsData = { restaurant: { name: string }; rankedDishes: Dish[] };

export default function ResultsDishesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [restaurantName, setRestaurantName] = useState(() => typeof window !== "undefined" ? sessionStorage.getItem(`restaurant_${id}`) ?? "" : "");
  const [listVisible, setListVisible] = useState(false);
  const [podiumDelay, setPodiumDelay] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const [plateSrc, setPlateSrc] = useState("/plate.png");
  const [saved, setSaved] = useState(() => typeof window !== "undefined" && sessionStorage.getItem(`saved_${id}`) === "1");
  const cardRef = useRef<HTMLDivElement>(null!);
  const cachedBlob = useRef<Blob | null>(null);

  useEffect(() => {
    fetch("/plate.png")
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setPlateSrc(reader.result as string);
        reader.readAsDataURL(blob);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/session/${id}/results`)
      .then((r) => r.json())
      .then((d: ResultsData) => {
        setData(d);
        sessionStorage.setItem(`restaurant_${id}`, d.restaurant.name);
        setRestaurantName(d.restaurant.name);
      });
  }, [id]);

  const top3 = data?.rankedDishes.slice(0, 3) ?? [];
  const rest = data?.rankedDishes.slice(3) ?? [];

  useEffect(() => {
    if (!data) return;
    const count = data.rankedDishes.slice(3).length;
    setTimeout(() => setListVisible(true), 400);
    setPodiumDelay(count > 0 ? 900 : 400);
    setTimeout(async () => {
      if (cardRef.current) cachedBlob.current = await pregenerateBlob(cardRef.current);
    }, 1500);
  }, [data]);

  async function handleShare() {
    if (!cachedBlob.current) return;
    setSharing(true);
    try {
      await shareBlob(cachedBlob.current, "playte-results.png");
    } finally {
      setSharing(false);
    }
  }

  async function handleSave() {
    const playerId = sessionStorage.getItem("playerId");
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const res = await fetch("/api/auth/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, playerId }),
    });
    if (res.ok) { sessionStorage.setItem(`saved_${id}`, "1"); setSaved(true); }
  }

  useEffect(() => {
    if (searchParams.get("autosave") === "1") {
      const userId = sessionStorage.getItem("userId");
      if (userId && !saved) handleSave();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col relative">
      <AccountStatus corner />
      {data && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", pointerEvents: "none" }}>
          <PodiumShareCard restaurantName={restaurantName} dishes={data.rankedDishes} cardRef={cardRef} plateSrc={plateSrc} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-6 pb-4">
        <Link href="/"><Image src="/logo.png" alt="playte" width={56} height={56} priority /></Link>
        <p className="text-[#9CA3AF] italic text-sm mt-1 min-h-[1.25rem]">{restaurantName}</p>
        <h1 className="text-[#FE392D] text-2xl font-bold mt-0 mb-4">the results are in.</h1>

        {top3.length >= 1 && podiumDelay !== null && (
          <div className="w-full max-w-sm">
            <Podium dishes={top3} startDelay={podiumDelay} />
          </div>
        )}

        <div className="w-full max-w-sm flex flex-col gap-2 mt-6">
          {rest.map((dish, i) => (
            <div
              key={dish.id}
              className="flex items-center gap-3"
              style={{
                opacity: listVisible ? 1 : 0,
                transform: listVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
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

      <div className="flex-shrink-0 px-6 pb-6 pt-3 flex flex-col gap-2 bg-[#FFF8E8] w-full items-center">
        <div className="w-full max-w-sm flex flex-col gap-2">
          <button
            onClick={handleShare}
            disabled={sharing || !data}
            className="w-full bg-[#FE392D] text-white text-sm font-semibold py-2.5 rounded-full disabled:opacity-60"
          >
            {sharing ? "generating..." : "share results"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/session/${id}/results/flavor`)}
              className="flex-1 bg-[#F88888] text-white text-sm font-semibold py-2.5 rounded-full"
            >
              flavor journey
            </button>
            <button
              onClick={() => router.push(`/session/${id}/results/players`)}
              className="flex-1 bg-[#F88888] text-white text-sm font-semibold py-2.5 rounded-full"
            >
              individual rankings
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`w-full bg-white border-2 border-[#FCCC75] text-sm font-semibold py-2.5 rounded-full ${saved ? "text-[#FE392D]" : "text-[#646464]"}`}
          >
            {saved ? "saved ✓" : "save to account"}
          </button>
        </div>
      </div>
    </main>
  );
}
