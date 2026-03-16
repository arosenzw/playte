"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoadingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [submittedCount, setSubmittedCount] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    function checkStatus() {
      fetch(`/api/session/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setSubmittedCount(data.submittedCount ?? 0);
          setPlayerCount(data.playerCount ?? 0);
          if (data.status === "results") {
            router.replace(`/session/${id}/results`);
          }
        });
    }

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [id, router]);

  // Realtime: watch for session status → results
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`loading:${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.new?.status === "results") {
            router.replace(`/session/${id}/results`);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, router]);

  return (
    <main className="h-screen bg-[#FE392D] flex flex-col px-8 pt-10 pb-10">
      <div className="flex justify-center">
        <Image src="/logo_long.png" alt="playte" width={200} height={66} priority />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
        <p className="text-[#FFF8E8] text-4xl leading-snug" style={{ fontFamily: "var(--font-orienta)" }}>
          mixing up<br />your flavors...
        </p>
        <img src="/loading.gif" alt="" className="w-56 h-56 object-contain" />
      </div>

      <p className="text-[#FFF8E8] opacity-70 text-base text-center">
        {submittedCount} {submittedCount === 1 ? "ranking" : "rankings"} submitted
        {playerCount > 0 ? ` of ${playerCount}` : ""}
      </p>
    </main>
  );
}
