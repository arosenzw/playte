"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type SessionSummary = {
  sessionId: string;
  restaurantName: string;
  date: string;
  playerCount: number;
  topDish: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SessionSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push("/auth?redirect=/account");
      return;
    }

    fetch("/api/account/history")
      .then((r) => {
        if (r.status === 401) {
          router.push("/auth?redirect=/account");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setHistory(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userDisplayName");
    router.push("/");
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col relative">
      <div className="flex-shrink-0 flex flex-col items-center pt-8 pb-2 px-6">
        <Image src="/logo.png" alt="playte" width={70} height={70} priority />
        <h1 className="text-[#FE392D] text-2xl font-bold mt-3">my history</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        {loading ? (
          <p className="text-[#9CA3AF] italic text-sm text-center mt-8">
            loading...
          </p>
        ) : !history || history.length === 0 ? (
          <p className="text-[#9CA3AF] italic text-sm text-center mt-8">
            no saved sessions yet. play a game and save your results!
          </p>
        ) : (
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {history.map((item) => (
              <button
                key={item.sessionId}
                onClick={() => router.push(`/session/${item.sessionId}/results`)}
                className="bg-[#FFFCF5] rounded-2xl px-4 py-4 shadow-sm border-2 border-[#FCCC75] text-left w-full"
              >
                <p className="text-[#FE392D] text-lg font-semibold leading-tight">
                  {item.restaurantName}
                </p>
                <p className="text-[#9CA3AF] italic text-xs mt-0.5">
                  {item.date}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[#646464] text-sm">
                    {item.topDish ? `👑 ${item.topDish}` : "no ranking yet"}
                  </p>
                  <p className="text-[#9CA3AF] text-xs">{item.playerCount} players</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pb-8 flex justify-center">
        <button
          onClick={handleSignOut}
          className="text-[#9CA3AF] italic text-sm text-center"
        >
          sign out
        </button>
      </div>
    </main>
  );
}
