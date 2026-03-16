"use client";

import NameEntryScreen from "@/components/ui/NameEntryScreen";

export default function PlayerNamePage() {
  const pending = typeof window !== "undefined" ? sessionStorage.getItem("pending_join_code") : null;
  const nextRoute = pending ? `/join/code?code=${encodeURIComponent(pending)}` : "/join/code";
  return <NameEntryScreen storageKey="player_name" nextRoute={nextRoute} />;
}
