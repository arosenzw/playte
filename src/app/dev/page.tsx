"use client";

/**
 * Dev shortcut page — reads query params from seed-dev.ts output,
 * sets sessionStorage, then lets you jump to any page in the app.
 *
 * Only useful locally. Not linked from anywhere in the app.
 * Usage: /dev?session=xxx&player=yyy&token=zzz&code=ABC&host=true&page=rank
 */

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGES = [
  { key: "rank",           label: "Rank page",            path: (id: string) => `/session/${id}/rank` },
  { key: "wrapped",        label: "⭐ Wrapped (new)",      path: (id: string) => `/session/${id}/wrapped` },
  { key: "results",        label: "Group results",         path: (id: string) => `/session/${id}/results` },
  { key: "flavor",         label: "Flavor journey",        path: (id: string) => `/session/${id}/results/flavor` },
  { key: "players",        label: "Player list",           path: (id: string) => `/session/${id}/results/players` },
  { key: "lobby",          label: "Lobby",                 path: (id: string) => `/session/${id}/lobby` },
  { key: "waiting",        label: "Waiting room",          path: (id: string) => `/session/${id}/waiting` },
];

export default function DevPage() {
  return (
    <Suspense>
      <DevPageInner />
    </Suspense>
  );
}

function DevPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const session = searchParams.get("session");
    const player  = searchParams.get("player");
    const token   = searchParams.get("token");
    const code    = searchParams.get("code");
    const host    = searchParams.get("host") === "true";

    if (!session || !player || !token) {
      setReady(true);
      return;
    }

    // Populate sessionStorage exactly as the real app does
    sessionStorage.setItem("sessionId",  session);
    sessionStorage.setItem("playerId",   player);
    sessionStorage.setItem("guestToken", token);
    if (code)  sessionStorage.setItem("joinCode", code);
    if (host)  sessionStorage.setItem("isHost",   "true");

    setSessionId(session);
    setReady(true);

    // Auto-redirect if a target page was specified
    const page = searchParams.get("page");
    if (page) {
      const target = PAGES.find((p) => p.key === page);
      if (target) router.replace(`${target.path(session)}?viewerId=${player}`);
    }
  }, []);

  if (!ready) return null;

  const missing = !sessionId;

  return (
    <main className="min-h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10 gap-6">
      <h1 className="text-[#FE392D] text-2xl font-bold">dev shortcuts</h1>

      {missing ? (
        <div className="w-full max-w-sm text-center text-[#9CA3AF] text-sm italic">
          <p>No session loaded.</p>
          <p className="mt-2">Run <code className="bg-[#FCCC75]/40 px-1 rounded">npm run dev:seed</code> and open the URL it prints.</p>
        </div>
      ) : (
        <>
          <p className="text-[#9CA3AF] text-xs italic">
            session: <span className="font-mono">{sessionId.slice(0, 8)}…</span>
          </p>
          <div className="w-full max-w-sm flex flex-col gap-3">
            {PAGES.map((p) => (
              <button
                key={p.key}
                onClick={() => router.push(`${p.path(sessionId)}?viewerId=${searchParams.get("player") ?? ""}`)}
                className="w-full bg-white border-2 border-[#FCCC75] text-[#646464] text-base font-semibold py-3 rounded-full"
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
