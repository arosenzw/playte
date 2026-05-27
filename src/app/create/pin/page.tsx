"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default function CreatePinPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [saved, setSaved] = useState(false);

  const [autosaveDone, setAutosaveDone] = useState(false);

  useEffect(() => {
    const sid = sessionStorage.getItem("sessionId");
    if (sid && sessionStorage.getItem(`saved_later_${sid}`) === "1") setSaved(true);
    setJoinCode(sessionStorage.getItem("joinCode"));
    setOrigin(window.location.origin);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // After returning from auth with autosave=1, auto-trigger save
  useEffect(() => {
    if (autosaveDone) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("autosave") !== "1") return;
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    setAutosaveDone(true);
    const sessionId = sessionStorage.getItem("sessionId");
    const playerId = sessionStorage.getItem("playerId");
    fetch("/api/auth/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, playerId, extend: true }),
    }).then((r) => { if (r.ok) { sessionStorage.setItem(`saved_later_${sessionId}`, "1"); setSaved(true); } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShare() {
    const url = `${origin}/join/code?code=${joinCode}`;
    const text = `join my playte game! use code ${joinCode} or tap the link: ${url}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(url);
      alert("link copied!");
    }
  }

  async function handleSaveForLater() {
    const userId = sessionStorage.getItem("userId");
    const sessionId = sessionStorage.getItem("sessionId");
    const playerId = sessionStorage.getItem("playerId");

    if (!userId) {
      sessionStorage.setItem("pending_save_session", "1");
      router.push(`/auth?redirect=${encodeURIComponent("/create/pin?autosave=1")}`);
      return;
    }

    const res = await fetch("/api/auth/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, playerId, extend: true }),
    });
    if (res.ok) {
      sessionStorage.setItem(`saved_later_${sessionId}`, "1");
      setSaved(true);
    }
  }

  return (
    <main className="fixed inset-0 bg-[#FFF8E8] flex flex-col items-center px-6 pt-8 pb-6">
      <Link href="/"><Image src="/logo.png" alt="playte" width={56} height={56} priority /></Link>

      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center w-full max-w-sm">
        <h1 className="text-[#FE392D] text-3xl font-bold">your table&apos;s pin</h1>
        <p className="text-[#6B7280] italic text-sm">share this with your table</p>
        <p className="text-[#FE392D] text-4xl font-bold tracking-wider mt-1">
          {joinCode ?? "------"}
        </p>
        {joinCode && (
          <div className="mt-1 p-2 bg-white rounded-2xl shadow-sm">
            <QRCodeSVG
              value={`${origin}/join/code?code=${joinCode}`}
              size={90}
              fgColor="#FE392D"
              bgColor="#FFFFFF"
            />
          </div>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-2">
        {joinCode && (
          <button
            onClick={handleShare}
            className="w-full bg-[#FCCC75] text-[#646464] text-sm font-semibold py-3 rounded-full"
          >
            invite via text
          </button>
        )}
        <button
          onClick={() => router.push("/create/dishes")}
          className="w-full bg-[#FE392D] text-white text-xl font-semibold py-4 rounded-full"
        >
          add dishes
        </button>
        <button
          onClick={handleSaveForLater}
          className={`w-full bg-white border-2 border-[#FCCC75] text-sm font-semibold py-2.5 rounded-full ${saved ? "text-[#FE392D]" : "text-[#646464]"}`}
        >
          {saved ? "saved ✓" : "save for later"}
        </button>
      </div>
    </main>
  );
}
