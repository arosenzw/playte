"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NameEntryScreen from "@/components/ui/NameEntryScreen";

export default function PlayerNamePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const displayName = sessionStorage.getItem("userDisplayName");
    const pending = sessionStorage.getItem("pending_join_code");
    const nextRoute = pending ? `/join/code?code=${encodeURIComponent(pending)}` : "/join/code";

    if (displayName) {
      sessionStorage.setItem("player_name", displayName);
      router.replace(nextRoute);
    } else {
      setReady(true);
    }
  }, [router]);

  const pending = typeof window !== "undefined" ? sessionStorage.getItem("pending_join_code") : null;
  const nextRoute = pending ? `/join/code?code=${encodeURIComponent(pending)}` : "/join/code";

  if (!ready) return null;
  return <NameEntryScreen storageKey="player_name" nextRoute={nextRoute} />;
}
