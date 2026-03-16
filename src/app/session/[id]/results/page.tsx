"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Podium } from "@/components/ui/Podium";
import { PodiumShareCard } from "@/components/ui/ShareCards/PodiumShareCard";
import { pregenerateBlob, shareBlob } from "@/lib/shareImage";

type Dish = { id: string; name: string; avgRank: number };
type ResultsData = { restaurant: { name: string }; rankedDishes: Dish[] };

export default function ResultsDishesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [restaurantName, setRestaurantName] = useState(() => typeof window !== "undefined" ? sessionStorage.getItem(`restaurant_${id}`) ?? "" : "");
  const [listVisible, setListVisible] = useState(false);
  const [podiumDelay, setPodiumDelay] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const [plateSrc, setPlateSrc] = useState("/plate.png");
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

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col">
      {data && (
        <div style={{ position: "fixed", top: 0, left: "-9999px", pointerEvents: "none" }}>
          <PodiumShareCard restaurantName={restaurantName} dishes={data.rankedDishes} cardRef={cardRef} plateSrc={plateSrc} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4">
        <Image src="/logo.png" alt="playte" width={70} height={70} priority />
        <p className="text-[#9CA3AF] italic text-sm mt-2 min-h-[1.25rem]">{restaurantName}</p>
        <h1 className="text-[#FE392D] text-3xl font-bold mt-1 mb-6">the results are in.</h1>

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

      <div className="flex-shrink-0 px-6 pb-8 pt-4 flex flex-col gap-2 bg-[#FFF8E8] w-full items-center">
        <div className="w-full max-w-sm flex flex-col gap-2">
          <button
            onClick={handleShare}
            disabled={sharing || !data}
            className="w-full bg-[#FE392D] text-white text-base font-semibold py-3 rounded-full disabled:opacity-60"
          >
            {sharing ? "generating..." : "share results"}
          </button>
          <button
            onClick={() => router.push(`/session/${id}/results/flavor`)}
            className="w-full bg-[#F88888] text-white text-base font-semibold py-3 rounded-full"
          >
            flavor journey
          </button>
          <button
            onClick={() => router.push(`/session/${id}/results/players`)}
            className="w-full bg-[#F88888] text-white text-base font-semibold py-3 rounded-full"
          >
            individual rankings
          </button>
        </div>
      </div>
    </main>
  );
}
