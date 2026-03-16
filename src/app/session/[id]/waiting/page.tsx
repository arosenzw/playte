"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function WaitingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  // Fetch session info and poll for status change
  useEffect(() => {
    function checkStatus() {
      fetch(`/api/session/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.restaurant?.name) setRestaurantName(data.restaurant.name);
          if (data.status === "ranking") {
            router.replace(`/session/${id}/rank`);
          }
        });
    }

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [id, router]);

  // Realtime: watch for session status → ranking
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`waiting:${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.new?.status === "ranking") {
            router.replace(`/session/${id}/rank`);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, router]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-[#FE392D] text-4xl font-bold">you&apos;re in!</h1>

        {restaurantName && (
          <p className="text-[#6B7280] text-lg italic">{restaurantName}</p>
        )}

        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="w-16 h-16 rounded-full bg-[#FCCC75] flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
          <p className="text-[#6B7280] text-base">
            waiting for host to start{dots}
          </p>
        </div>
      </div>
    </main>
  );
}
