"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NameEntryScreen from "@/components/ui/NameEntryScreen";

export default function HostNamePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const displayName = sessionStorage.getItem("userDisplayName");
    if (displayName) {
      sessionStorage.setItem("host_name", displayName);
      router.replace("/create/restaurant");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;
  return <NameEntryScreen storageKey="host_name" nextRoute="/create/restaurant" />;
}
