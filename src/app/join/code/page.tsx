"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function JoinCodeForm() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("code") ?? "";
  const [code, setCode] = useState(prefill.toUpperCase());
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefill) {
      handleJoin();
    } else {
      inputRef.current?.focus();
    }
  }, []);

  async function handleJoin() {
    if (!code.trim() || joining) return;
    setError("");
    setJoining(true);

    const playerName = sessionStorage.getItem("player_name");
    if (!playerName) {
      sessionStorage.setItem("pending_join_code", code.trim());
      router.push("/join/name");
      return;
    }

    try {
      const res = await fetch("/api/session/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), playerName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setJoining(false);
        return;
      }

      sessionStorage.setItem("playerId", data.playerId);
      sessionStorage.setItem("guestToken", data.guestToken);
      router.push(`/session/${data.sessionId}/waiting`);
    } catch {
      setError("Something went wrong");
      setJoining(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleJoin();
  }

  const canJoin = code.trim().length > 0;

  return (
    <main className="min-h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-6">
        <h1 className="text-[#FE392D] text-3xl font-bold text-center">
          join a game
        </h1>

        <div className="w-full flex flex-col items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="enter pin"
            maxLength={10}
            autoCapitalize="characters"
            className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-semibold text-center py-4 px-6 rounded-2xl outline-none tracking-widest uppercase"
          />
          {error && <p className="text-[#FE392D] text-sm">{error}</p>}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={handleJoin}
          disabled={!canJoin || joining}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            canJoin ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          {joining ? "joining..." : "join"}
        </button>
      </div>
    </main>
  );
}

export default function JoinCodePage() {
  return (
    <Suspense>
      <JoinCodeForm />
    </Suspense>
  );
}
