"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

type Dish = { id: string; name: string; avgRank: number };
type InsightDish = { id: string; name: string; count: number };
type ResultsData = {
  restaurant: { name: string };
  rankedDishes: Dish[];
  players: { id: string; displayName: string; matchPercent: number }[];
  insights: {
    mostLoved: InsightDish | null;
    nachoType: InsightDish | null;
    hotCold: { id: string; name: string; highRank: number; lowRank: number } | null;
    bestBud: { displayName: string; matchPercent: number } | null;
  };
};
type Slot = { rank: number; dishes: Dish[] };

function groupIntoSlots(dishes: Dish[]): Slot[] {
  if (!dishes.length) return [];
  const slots: Slot[] = [];
  let rank = 1;
  let i = 0;
  while (i < dishes.length) {
    const avgRank = dishes[i].avgRank;
    const group: Dish[] = [];
    while (i + group.length < dishes.length && dishes[i + group.length].avgRank === avgRank)
      group.push(dishes[i + group.length]);
    slots.push({ rank, dishes: group });
    rank += 1;
    i += group.length;
  }
  return slots;
}

// ── Food confetti canvas (devicePixelRatio-aware) ────────────────────────────
const FOOD_EMOJIS = ["🍝", "🍋", "🌿", "🍅", "🍄"];
const EMOJI_SIZE = 28;

function makeEmojiCanvas(emoji: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = EMOJI_SIZE;
  c.height = EMOJI_SIZE;
  const ec = c.getContext("2d")!;
  ec.font = `${EMOJI_SIZE * 0.85}px serif`;
  ec.textAlign = "center";
  ec.textBaseline = "middle";
  ec.fillText(emoji, EMOJI_SIZE / 2, EMOJI_SIZE / 2);
  return c;
}

function runConfetti(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const emojiCanvases = FOOD_EMOJIS.map(makeEmojiCanvas);

  const particles = Array.from({ length: 60 }, () => {
    const size = 18 + Math.random() * 14;
    return {
      x: w * 0.15 + Math.random() * w * 0.7,
      y: h * 0.38,
      vx: (Math.random() - 0.5) * 9,
      vy: -(Math.random() * 12 + 3),
      img: emojiCanvases[Math.floor(Math.random() * emojiCanvases.length)],
      size,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.22,
      alpha: 1,
    };
  });

  let raf: number;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    let any = false;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      any = true;
      p.vy += 0.26;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > h * 0.82) p.alpha -= 0.025;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    if (any) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// ── Share overlay ─────────────────────────────────────────────────────────────
function ShareOverlay({
  visible, sessionId, screen, shareData, bgColor = "#FFF8E8",
}: {
  visible: boolean;
  sessionId: string;
  screen: string;
  shareData: unknown;
  bgColor?: string;
}) {
  const [sharing, setSharing] = useState(false);

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (sharing) return;
    setSharing(true);
    try {
      const res = await fetch(`/api/share/${sessionId}/${screen}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareData),
      });
      if (!res.ok) throw new Error("share failed");
      const blob = await res.blob();
      const file = new File([blob], "playte-results.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Playte results" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "playte-results.png"; a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // user cancelled or unsupported — silent fail
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4 pt-10"
      style={{
        background: `linear-gradient(to top, ${bgColor} 60%, ${bgColor}00 100%)`,
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <button
        onClick={handleShare}
        disabled={sharing}
        className="flex flex-col items-center gap-1 opacity-60 active:opacity-100 transition-opacity"
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(128,128,128,0.15)" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: bgColor === "#FFF8E8" ? "#555" : "rgba(255,255,255,0.9)" }}>
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </div>
        <span className="text-[10px] font-bold tracking-wide" style={{ color: bgColor === "#FFF8E8" ? "#888" : "rgba(255,255,255,0.7)" }}>
          {sharing ? "generating..." : "share this story"}
        </span>
      </button>
    </div>
  );
}

// ── Podium column config: left = 2nd, center = 1st, right = 3rd ─────────────
const POD_CONFIG = [
  { slotIdx: 1, num: "2", height: 78,  bg: "#DEDEDE", border: "#BDBDBD", numColor: "#888",    winner: false },
  { slotIdx: 0, num: "1", height: 115, bg: "#F5A623", border: "#C88A0A", numColor: "#1A1A1A", winner: true  },
  { slotIdx: 2, num: "3", height: 52,  bg: "#EDCFAA", border: "#C8A070", numColor: "#AA7840", winner: false },
];

// ── Slide 01: Group Rankings ──────────────────────────────────────────────────
const ANIM_CSS = `
  @keyframes dropBounce {
    from { transform: translateY(-50px); opacity: 0; }
    55%  { transform: translateY(8px);   opacity: 1; }
    75%  { transform: translateY(-4px);  }
    90%  { transform: translateY(2px);   }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes goldShake {
    0%   { transform: translateX(0); }
    8%   { transform: translateX(-4px); }
    17%  { transform: translateX(4px); }
    25%  { transform: translateX(-3.5px); }
    33%  { transform: translateX(3px); }
    42%  { transform: translateX(-2.5px); }
    50%  { transform: translateX(2px); }
    58%  { transform: translateX(-1.5px); }
    67%  { transform: translateX(1px); }
    75%  { transform: translateX(-0.5px); }
    100% { transform: translateX(0); }
  }
`;

function SlideGroupRankings({ data, sessionId }: { data: ResultsData; sessionId: string }) {
  const slots = groupIntoSlots(data.rankedDishes);
  const podiumSlots = slots.slice(0, 3);
  const listSlots = slots.slice(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // No bar-rise state — bars appear at full height from mount (matches mockup)
  const [titleIn,     setTitleIn]     = useState(false);
  const [bronzeIn,    setBronzeIn]    = useState(false);
  const [silverIn,    setSilverIn]    = useState(false);
  const [goldShaking, setGoldShaking] = useState(false);
  const [goldIn,      setGoldIn]      = useState(false);
  const [listIn,      setListIn]      = useState(false);

  useEffect(() => {
    // Exact timing from mockup TL object
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setTitleIn(true),   400),
      setTimeout(() => setBronzeIn(true),  1100),
      setTimeout(() => setSilverIn(true),  2200),
      setTimeout(() => {
        setGoldShaking(true);
        setTimeout(() => setGoldShaking(false), 420);
      }, 3500),
      setTimeout(() => setGoldIn(true),    4400),
      setTimeout(() => { if (canvasRef.current) runConfetti(canvasRef.current); }, 4700),
      setTimeout(() => setListIn(true),    5600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function labelVisible(slotIdx: number) {
    if (slotIdx === 0) return goldIn;
    if (slotIdx === 1) return silverIn;
    return bronzeIn;
  }

  const date = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div className="absolute inset-0 bg-[#FFF8E8] overflow-hidden flex flex-col">
      <style>{ANIM_CSS}</style>

      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }} />

      {/* Logo — absolute, out of flow */}
      <div className="absolute top-6 left-4" style={{ zIndex: 25 }}>
        <Image src="/logo_long_red.png" alt="playte" width={80} height={29} priority />
      </div>

      {/* ── All content in natural flex column flow ── */}

      {/* Restaurant + date */}
      <div className="flex flex-col items-center pt-16 px-6 flex-shrink-0">
        <p className="text-[#FE392D] font-bold text-[26px] leading-tight text-center">
          {data.restaurant.name}
        </p>
        <p className="text-[#9CA3AF] font-bold text-[10px] tracking-widest uppercase mt-1">{date}</p>
        <div className="w-10 h-[3px] bg-[#FCCC75] rounded-full mt-2" />
      </div>

      {/* "the results are in 🏆" */}
      <p
        className="text-center font-bold text-[15px] text-[#444] mt-6 flex-shrink-0"
        style={{ opacity: titleIn ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        the results are in 🏆
      </p>

      {/* Gap between title and podium */}
      <div style={{ minHeight: 16, maxHeight: 48, flex: "1 1 0" }} />

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 px-6 flex-shrink-0">
        {POD_CONFIG.map((pod, pi) => {
          const slot = podiumSlots[pod.slotIdx];
          const label = slot ? slot.dishes.map((d) => d.name).join(" / ") : "";
          const isTie = (slot?.dishes.length ?? 0) > 1;
          const isGold = pod.winner;
          const inView = labelVisible(pod.slotIdx);

          return (
            <div key={pi} className="flex flex-col items-center flex-1 min-w-0">

              {/* Label — always rendered at full size to prevent layout shift */}
              <div className="mb-4 w-full flex flex-col items-center gap-1 px-0.5" style={{ justifyContent: "flex-end" }}>
                {pod.winner ? (
                  <span
                    className="text-[10px] font-bold leading-tight text-center"
                    style={{
                      background: "#FE392D", color: "white",
                      padding: "3px 8px", borderRadius: 999,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      wordBreak: "break-word",
                      ...(inView
                        ? { animation: "dropBounce 0.65s linear forwards" }
                        : { opacity: 0, transform: "translateY(-50px)" }),
                    }}
                  >
                    {label}
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-bold text-[#888] leading-tight text-center block"
                    style={{
                      wordBreak: "break-word",
                      ...(inView
                        ? { animation: "dropBounce 0.5s linear forwards" }
                        : { opacity: 0, transform: "translateY(-50px)" }),
                    }}
                  >
                    {label}
                  </span>
                )}
                {isTie && (
                  <span
                    className="inline-flex items-center justify-center rounded-full bg-[#FE392D] text-white font-bold shadow-md"
                    style={{
                      width: 20, height: 20, fontSize: 7, letterSpacing: "0.05em",
                      opacity: inView ? 1 : 0,
                    }}
                  >
                    TIE
                  </span>
                )}
              </div>

              {/* Shake wrapper — only wraps the bar, translateX only, no layout impact */}
              <div
                style={{
                  width: "100%", flexShrink: 0,
                  animation: isGold && goldShaking ? "goldShake 0.4s linear forwards" : undefined,
                }}
              >
                  {/* Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: pod.height,
                      background: pod.bg,
                      border: `2.5px solid ${pod.border}`,
                      borderRadius: "10px 10px 0 0",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: "bold", color: pod.numColor, lineHeight: 1 }}>
                      {pod.num}
                    </span>
                  </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Base line */}
      <div className="h-[2px] bg-[#E5DFD5] mx-6 flex-shrink-0" />

      {/* Ranked list — flex-1 so it takes remaining space, overflow-hidden clips gracefully */}
      <div
        className="flex flex-col gap-2 px-5 pt-4 pb-16 flex-1 overflow-y-auto"
        style={{
          opacity: listIn ? 1 : 0,
          transform: listIn ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {listSlots.map((slot) => (
          <div key={slot.rank} className="flex items-center gap-3">
            <span className="text-[#FE392D] font-bold text-sm w-5 text-right flex-shrink-0">
              {slot.rank}
            </span>
            <div className="flex-1 min-w-0 bg-white border border-[#F0E8D0] rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-[#444] text-xs font-semibold truncate block">
                {slot.dishes.map((d) => d.name).join(" / ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Share overlay — fades in with list */}
      <ShareOverlay visible={listIn} sessionId={sessionId} screen="rankings" shareData={data} />
    </div>
  );
}

// ── Slide 02: Most Loved ──────────────────────────────────────────────────────
const SLIDE2_CSS = `
  @keyframes dropInBounce {
    from { opacity: 0; transform: translateY(-30px) scale(0.5); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slamIn {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function SlideMostLoved({ data, sessionId }: { data: ResultsData; sessionId: string }) {
  const mostLoved = data.insights?.mostLoved;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [emojiIn,  setEmojiIn]  = useState(false);
  const [pillIn,   setPillIn]   = useState(false);
  const [dishIn,   setDishIn]   = useState(false);
  const [subIn,    setSubIn]    = useState(false);
  const [badgeIn,  setBadgeIn]  = useState(false);
  const [shareIn,  setShareIn]  = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setEmojiIn(true),  300),
      setTimeout(() => setPillIn(true),   600),
      setTimeout(() => {
        setDishIn(true);
        if (canvasRef.current) runConfetti(canvasRef.current);
      }, 1000),
      setTimeout(() => setSubIn(true),    1350),
      setTimeout(() => setBadgeIn(true),  1450),
      setTimeout(() => setShareIn(true),  2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const date = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  if (!mostLoved) return null;

  return (
    <div className="absolute inset-0 bg-[#FE392D] overflow-hidden flex flex-col">
      <style>{SLIDE2_CSS}</style>

      {/* Food confetti canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }} />

      {/* Logo — white via invert */}
      <div className="absolute top-6 left-4" style={{ zIndex: 25 }}>
        <Image src="/logo_long_red.png" alt="playte" width={80} height={29} priority style={{ filter: "brightness(0) invert(1)" }} />
      </div>

      {/* Restaurant + date */}
      <div className="flex flex-col items-center pt-16 px-6 flex-shrink-0">
        <p className="text-white/90 font-bold text-[22px] leading-tight text-center">
          {data.restaurant.name}
        </p>
        <p className="text-white/50 font-bold text-[10px] tracking-widest uppercase mt-1">{date}</p>
        <div className="w-10 h-[3px] bg-[#F5A623] rounded-full mt-2" />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-7 pb-36">

        {/* 😍 emoji */}
        <div
          className="text-[96px] leading-none"
          style={emojiIn
            ? { animation: "dropInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
            : { opacity: 0, transform: "translateY(-30px) scale(0.5)" }}
        >
          😍
        </div>

        {/* "MOST LOVED" pill */}
        <div
          className="rounded-full px-7 py-2.5"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.35)",
            ...(pillIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[14px] tracking-[2px] uppercase">most loved</span>
        </div>

        {/* Dish name */}
        <div
          className="text-[#FFF8EE] font-bold leading-tight"
          style={{
            fontSize: "clamp(32px, 10vw, 54px)",
            ...(dishIn
              ? { animation: "slamIn 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }
              : { opacity: 0, transform: "scale(0.6)" }),
          }}
        >
          {mostLoved.name}
        </div>

        {/* Subtitle */}
        <div
          className="text-white/60 font-bold text-[17px] italic"
          style={subIn
            ? { animation: "fadeUp 0.35s ease forwards" }
            : { opacity: 0, transform: "translateY(14px)" }}
        >
          clean plate club
        </div>

        {/* Gold stat badge */}
        <div
          className="rounded-full px-8 py-3.5 flex items-center gap-1.5"
          style={{
            background: "#F5A623",
            ...(badgeIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[16px]">
            ★ ranked #1 by {mostLoved.count} player{mostLoved.count !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      {/* Share overlay */}
      <ShareOverlay
        visible={shareIn}
        sessionId={sessionId}
        screen="most-loved"
        shareData={{ restaurant: data.restaurant, mostLoved }}
        bgColor="#FE392D"
      />
    </div>
  );
}

// ── Slide 03: Nacho Type ─────────────────────────────────────────────────────
const SLIDE3_CSS = `
  @keyframes nachoCard {
    0%   { opacity: 0; transform: scale(0.4)              rotate(0deg);    }
    5%   { opacity: 1;                                                      }
    7%   {             transform: scaleX(1.1) scaleY(0.9) rotate(0deg);    }
    13%  {             transform: scaleX(0.95) scaleY(1.05) rotate(0deg);  }
    19%  {             transform: scale(1)               rotate(0deg);     }
    38%  {             transform: scale(1)               rotate(0deg);     }
    45%  {             transform: scale(1)               rotate(6deg);     }
    52%  {             transform: scale(1)               rotate(-8deg);    }
    60%  {             transform: scale(1)               rotate(5deg);     }
    67%  {             transform: scale(1)               rotate(-4deg);    }
    74%  {             transform: scale(1)               rotate(2.5deg);   }
    80%  {             transform: scale(1)               rotate(-2deg);    }
    86%  {             transform: scale(1)               rotate(1deg);     }
    91%  {             transform: scale(1)               rotate(-0.5deg);  }
    100% {             transform: scale(1)               rotate(0deg);     }
  }
`;

function SlideNachoType({ data, sessionId }: { data: ResultsData; sessionId: string }) {
  const nachoType = data.insights?.nachoType;

  const [emojiIn,  setEmojiIn]  = useState(false);
  const [pillIn,   setPillIn]   = useState(false);
  const [cardIn,   setCardIn]   = useState(false);
  const [subIn,    setSubIn]    = useState(false);
  const [badgeIn,  setBadgeIn]  = useState(false);
  const [shareIn,  setShareIn]  = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setEmojiIn(true), 300),
      setTimeout(() => setPillIn(true),  600),
      setTimeout(() => setCardIn(true),  1000),
      setTimeout(() => setSubIn(true),   3200),
      setTimeout(() => setBadgeIn(true), 3400),
      setTimeout(() => setShareIn(true), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const date = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  if (!nachoType) return null;

  return (
    <div className="absolute inset-0 bg-[#FFF8EE] overflow-hidden flex flex-col">
      <style>{SLIDE2_CSS}{SLIDE3_CSS}</style>

      {/* Logo */}
      <div className="absolute top-6 left-4" style={{ zIndex: 25 }}>
        <Image src="/logo_long_red.png" alt="playte" width={80} height={29} priority />
      </div>

      {/* Restaurant + date */}
      <div className="flex flex-col items-center pt-16 px-6 flex-shrink-0">
        <p className="text-[#FE392D] font-bold text-[22px] leading-tight text-center">
          {data.restaurant.name}
        </p>
        <p className="text-[#9CA3AF] font-bold text-[10px] tracking-widest uppercase mt-1">{date}</p>
        <div className="w-10 h-[3px] bg-[#FCCC75] rounded-full mt-2" />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-7 pb-36">

        {/* 🤨 emoji */}
        <div
          className="text-[96px] leading-none"
          style={emojiIn
            ? { animation: "dropInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
            : { opacity: 0, transform: "translateY(-30px) scale(0.5)" }}
        >
          🤨
        </div>

        {/* "NACHO TYPE" pill */}
        <div
          className="rounded-full px-7 py-2.5"
          style={{
            background: "#FE392D",
            ...(pillIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[14px] tracking-[2px] uppercase">nacho type</span>
        </div>

        {/* Jiggling dish card */}
        <div
          className="bg-white border-2 border-[#FE392D] rounded-2xl px-6 py-4 shadow-md w-full max-w-[260px]"
          style={cardIn
            ? { animation: "nachoCard 2.1s linear forwards" }
            : { opacity: 0, transform: "scale(0.4)" }}
        >
          <span className="text-[#FE392D] font-bold text-[clamp(13px,4.5vw,20px)] leading-tight">
            {nachoType.name}
          </span>
        </div>

        {/* Subtitle */}
        <div
          className="text-[#AAA] font-bold text-[17px] italic"
          style={subIn
            ? { animation: "fadeUp 0.35s ease forwards" }
            : { opacity: 0, transform: "translateY(14px)" }}
        >
          zero out of ten, respectfully
        </div>

        {/* Dark stat badge */}
        <div
          className="rounded-full px-8 py-3.5 flex items-center"
          style={{
            background: "#1A1A1A",
            ...(badgeIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[16px]">
            ranked last by {nachoType.count} player{nachoType.count !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      <ShareOverlay
        visible={shareIn}
        sessionId={sessionId}
        screen="nacho-type"
        shareData={{ restaurant: data.restaurant, nachoType }}
        bgColor="#FFF8EE"
      />
    </div>
  );
}

// ── Slide 04: Hot & Cold ─────────────────────────────────────────────────────
function runHotCold(bgCanvas: HTMLCanvasElement, boltCanvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const w = bgCanvas.offsetWidth;
  const h = bgCanvas.offsetHeight;
  for (const c of [bgCanvas, boltCanvas]) { c.width = w * dpr; c.height = h * dpr; }
  const bgCtx   = bgCanvas.getContext("2d")!;
  const boltCtx = boltCanvas.getContext("2d")!;
  bgCtx.scale(dpr, dpr);
  boltCtx.scale(dpr, dpr);

  const xs = w / 340; // scale bolt x-offsets to screen width
  const cx = w / 2;
  const BOLT: [number, number][] = [
    [0,    0      ], [18,  h*0.10], [-14, h*0.20],
    [22,   h*0.30 ], [-10, h*0.40], [20,  h*0.50],
    [-18,  h*0.60 ], [14,  h*0.70], [-12, h*0.80],
    [16,   h*0.90 ], [0,   h      ],
  ].map(([x, y]) => [x * xs, y] as [number, number]);

  function drawBgSplit(alpha: number) {
    bgCtx.clearRect(0, 0, w, h);
    if (alpha <= 0) return;
    bgCtx.fillStyle = "#FFF8EE";
    bgCtx.fillRect(0, 0, w, h);

    // Left half: corner → top of bolt → trace bolt → bottom of bolt → corner
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.moveTo(0, 0);
    bgCtx.lineTo(cx + BOLT[0][0], BOLT[0][1]);
    BOLT.slice(1).forEach(([x, y]) => bgCtx.lineTo(cx + x, y));
    bgCtx.lineTo(0, h);
    bgCtx.closePath();
    bgCtx.fillStyle = `rgba(232,55,42,${alpha * 0.18})`;
    bgCtx.fill();
    bgCtx.restore();

    // Right half: corner → top of bolt → trace bolt → bottom of bolt → corner
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.moveTo(w, 0);
    bgCtx.lineTo(cx + BOLT[0][0], BOLT[0][1]);
    BOLT.slice(1).forEach(([x, y]) => bgCtx.lineTo(cx + x, y));
    bgCtx.lineTo(w, h);
    bgCtx.closePath();
    bgCtx.fillStyle = `rgba(91,164,207,${alpha * 0.18})`;
    bgCtx.fill();
    bgCtx.restore();
  }

  function strokeBolt(ctx: CanvasRenderingContext2D, lw: number, color: string, alpha: number) {
    ctx.save();
    ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    BOLT.forEach(([x, y], i) => i === 0 ? ctx.moveTo(cx+x, y) : ctx.lineTo(cx+x, y));
    ctx.stroke(); ctx.restore();
  }

  function drawBolt(strikeAlpha: number, settledAlpha: number) {
    boltCtx.clearRect(0, 0, w, h);
    if (strikeAlpha > 0) {
      strokeBolt(boltCtx, 36, "#FFF9C4", strikeAlpha * 0.06);
      strokeBolt(boltCtx, 20, "#FFE066", strikeAlpha * 0.14);
      strokeBolt(boltCtx,  9, "#FFD700", strikeAlpha * 0.40);
      strokeBolt(boltCtx,  3, "#FFFFFF", strikeAlpha * 1.00);
      boltCtx.save();
      boltCtx.globalAlpha = strikeAlpha * 0.20;
      boltCtx.fillStyle = "#FFFFFF";
      boltCtx.fillRect(0, 0, w, h);
      boltCtx.restore();
    }
    if (settledAlpha > 0) {
      strokeBolt(boltCtx, 6,   "#FFD700",              settledAlpha * 0.25);
      strokeBolt(boltCtx, 1.5, "rgba(180,140,0,0.7)",  settledAlpha * 0.55);
    }
  }

  const T_STRIKE = 0.8, T_FLASH_END = 1.05, T_DONE = 4.0;
  let startTs: number | null = null;
  let raf: number;

  function frame(ts: number) {
    if (startTs === null) startTs = ts;
    const t = (ts - startTs) / 1000;
    let strikeAlpha = 0;
    if (t >= T_STRIKE && t < T_FLASH_END) {
      const p = (t - T_STRIKE) / (T_FLASH_END - T_STRIKE);
      strikeAlpha = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7;
    }
    const settledAlpha = t >= T_FLASH_END ? Math.min(1, (t - T_FLASH_END) / 0.3) : 0;
    drawBgSplit(settledAlpha);
    drawBolt(strikeAlpha, settledAlpha);
    if (t < T_DONE) raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

function SlideHotCold({ data, sessionId }: { data: ResultsData; sessionId: string }) {
  const hotCold = data.insights?.hotCold;
  const bgRef   = useRef<HTMLCanvasElement>(null);
  const boltRef = useRef<HTMLCanvasElement>(null);

  const [emojiIn,  setEmojiIn]  = useState(false);
  const [pillIn,   setPillIn]   = useState(false);
  const [dishIn,   setDishIn]   = useState(false);
  const [subIn,    setSubIn]    = useState(false);
  const [badgeIn,  setBadgeIn]  = useState(false);
  const [shareIn,  setShareIn]  = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setEmojiIn(true), 300),
      setTimeout(() => setPillIn(true),  600),
      setTimeout(() => setDishIn(true),  1000),
      setTimeout(() => {
        if (bgRef.current && boltRef.current)
          cleanup = runHotCold(bgRef.current, boltRef.current);
      }, 1000),
      setTimeout(() => setSubIn(true),   2400),
      setTimeout(() => setBadgeIn(true), 2600),
      setTimeout(() => setShareIn(true), 3000),
    ];
    return () => { timers.forEach(clearTimeout); cleanup?.(); };
  }, []);

  const date = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  if (!hotCold) return null;

  return (
    <div className="absolute inset-0 bg-[#FFF8EE] overflow-hidden flex flex-col">
      <style>{SLIDE2_CSS}</style>

      <canvas ref={bgRef}   className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
      <canvas ref={boltRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }} />

      <div className="absolute top-6 left-4" style={{ zIndex: 25 }}>
        <Image src="/logo_long_red.png" alt="playte" width={80} height={29} priority />
      </div>

      <div className="flex flex-col items-center pt-16 px-6 flex-shrink-0" style={{ position: "relative", zIndex: 10 }}>
        <p className="text-[#FE392D] font-bold text-[22px] leading-tight text-center">{data.restaurant.name}</p>
        <p className="text-[#9CA3AF] font-bold text-[10px] tracking-widest uppercase mt-1">{date}</p>
        <div className="w-10 h-[3px] bg-[#FCCC75] rounded-full mt-2" />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-7 pb-36" style={{ position: "relative", zIndex: 10 }}>

        <div
          className="text-[96px] leading-none"
          style={emojiIn
            ? { animation: "dropInBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }
            : { opacity: 0, transform: "translateY(-30px) scale(0.5)" }}
        >
          🌶️
        </div>

        <div
          className="rounded-full px-7 py-2.5"
          style={{
            background: "#FE392D",
            ...(pillIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[14px] tracking-[2px] uppercase">hot &amp; cold</span>
        </div>

        <div
          className="bg-white border-2 border-[#FE392D] rounded-full px-7 py-3 w-full max-w-[280px]"
          style={dishIn
            ? { animation: "fadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards" }
            : { opacity: 0, transform: "translateY(14px)" }}
        >
          <span className="text-[#FE392D] font-bold text-[clamp(14px,4.5vw,22px)] leading-tight">
            {hotCold.name}
          </span>
        </div>

        <div
          className="text-[#888] font-bold text-[17px] italic"
          style={subIn
            ? { animation: "fadeUp 0.35s ease forwards" }
            : { opacity: 0, transform: "translateY(14px)" }}
        >
          most controversial playte debate
        </div>

        <div
          className="rounded-full px-8 py-3.5 flex items-center"
          style={{
            background: "#FE392D",
            ...(badgeIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[16px]">
            as high as #{hotCold.highRank}, as low as #{hotCold.lowRank}
          </span>
        </div>

      </div>

      <ShareOverlay
        visible={shareIn}
        sessionId={sessionId}
        screen="hot-cold"
        shareData={{ restaurant: data.restaurant, hotCold }}
        bgColor="#FFF8EE"
      />
    </div>
  );
}

// ── Slide 05: Best Taste Buds ────────────────────────────────────────────────
const SLIDE5_CSS = `
  @keyframes slideInLeft {
    from { transform: translateX(-80px); opacity: 0; }
    85%  { transform: translateX(4px); opacity: 1; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(80px); opacity: 0; }
    85%  { transform: translateX(-4px); opacity: 1; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes heartPop {
    0%   { opacity: 0; transform: scale(0.3) translateY(0); }
    40%  { opacity: 1; transform: scale(1.2) translateY(-4px); }
    70%  { transform: scale(0.95) translateY(0); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

// CSS clip-path puzzle pieces that truly fit together.
//
// Left piece box:  (BW + TR) × PH — the tab protrudes past the right edge into this extra space.
// Right piece box: BW × PH — the notch is cut from the left edge into the body.
// Right piece sits at marginLeft: -TR so its body starts where the left piece body ends,
// and the tab fills the notch.  Right piece has z-index:1 so its body covers the tab
// everywhere except the void notch.
const BW = 110; // body width (shared by both pieces)
const PH = 88;  // piece height
const TR = 22;  // tab/notch radius
const TC = 44;  // tab/notch center Y (= PH / 2)

// Left piece: rectangle (0,0)→(BW,PH) plus right-side semicircle tab protruding to x = BW+TR
// Arc: CW from (BW, TC-TR) through (BW+TR, TC) to (BW, TC+TR) → sweep-flag = 1
const LEFT_CLIP  = `path('M 0 0 H ${BW} V ${TC - TR} A ${TR} ${TR} 0 0 1 ${BW} ${TC + TR} V ${PH} H 0 Z')`;

// Right piece: rectangle (0,0)→(BW,PH) minus left-side semicircle notch indented to x = TR
// Arc: CCW from (0, TC+TR) through (TR, TC) to (0, TC-TR) → sweep-flag = 0
const RIGHT_CLIP = `path('M 0 0 H ${BW} V ${PH} H 0 V ${TC + TR} A ${TR} ${TR} 0 0 0 0 ${TC - TR} V 0 Z')`;

function runHeartConfetti(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const COLORS = ["#FE392D", "#F5A623", "#FF8FAB", "#FFD700", "#FF6B6B", "#FFB3C6"];
  const cx = w / 2, cy = h * 0.46;

  const hearts = Array.from({ length: 48 }, () => ({
    x: cx + (Math.random() - 0.5) * 120,
    y: cy,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 11 + 5),
    size: 7 + Math.random() * 11,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.14,
    alpha: 1,
    delay: Math.random() * 0.35,
  }));

  function drawHeart(x: number, y: number, size: number, color: string, rot: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(size, size);
    ctx.beginPath();
    ctx.moveTo(0, -0.3);
    ctx.bezierCurveTo( 0.5, -0.9,  1.1, -0.3, 0,  0.6);
    ctx.bezierCurveTo(-1.1, -0.3, -0.5, -0.9, 0, -0.3);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  let startTs: number | null = null;
  let raf: number;

  function frame(ts: number) {
    if (startTs === null) startTs = ts;
    const elapsed = (ts - startTs) / 1000;
    ctx.clearRect(0, 0, w, h);
    let any = false;
    for (const p of hearts) {
      if (elapsed < p.delay) { any = true; continue; }
      p.vy += 0.24; p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      if (p.y > h * 0.82) p.alpha -= 0.04;
      if (p.alpha > 0) { any = true; drawHeart(p.x, p.y, p.size, p.color, p.rot, p.alpha); }
    }
    if (any) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

function SlideBestBuds({ data, sessionId, viewerId }: { data: ResultsData; sessionId: string; viewerId: string }) {
  const bestBud  = data.insights?.bestBud;
  const noMatch  = !bestBud || bestBud.matchPercent < 10;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [emojiIn,   setEmojiIn]   = useState(false);
  const [pillIn,    setPillIn]    = useState(false);
  const [wrapIn,    setWrapIn]    = useState(false);
  const [sliding,   setSliding]   = useState(false);
  const [subIn,     setSubIn]     = useState(false);
  const [badgeIn,   setBadgeIn]   = useState(false);
  const [shareIn,   setShareIn]   = useState(false);

  const viewerName = data.players?.find((p) => p.id === viewerId)?.displayName ?? "you";

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setEmojiIn(true),  300),
      setTimeout(() => setPillIn(true),   600),
      setTimeout(() => setWrapIn(true),   1000),
      setTimeout(() => setSliding(true),  1100),
      setTimeout(() => {
        if (!noMatch && canvasRef.current) runHeartConfetti(canvasRef.current);
      }, 1700),
      setTimeout(() => setSubIn(true),    2400),
      setTimeout(() => setBadgeIn(true),  2600),
      setTimeout(() => setShareIn(true),  3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [noMatch]);

  const date = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  const matchPct = bestBud?.matchPercent ?? 0;

  return (
    <div className="absolute inset-0 bg-[#FFF8EE] overflow-hidden flex flex-col">
      <style>{SLIDE2_CSS}{SLIDE5_CSS}</style>

      {/* Heart confetti canvas */}
      {!noMatch && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 12 }} />
      )}

      <div className="absolute top-6 left-4" style={{ zIndex: 25 }}>
        <Image src="/logo_long_red.png" alt="playte" width={80} height={29} priority />
      </div>

      <div className="flex flex-col items-center pt-16 px-6 flex-shrink-0">
        <p className="text-[#FE392D] font-bold text-[22px] leading-tight text-center">{data.restaurant.name}</p>
        <p className="text-[#9CA3AF] font-bold text-[10px] tracking-widest uppercase mt-1">{date}</p>
        <div className="w-10 h-[3px] bg-[#FCCC75] rounded-full mt-2" />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-7 pb-36">

        {/* emoji: 🫶 for match, 💔 for no match */}
        <div
          className="text-[96px] leading-none"
          style={emojiIn
            ? { animation: "dropInBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }
            : { opacity: 0, transform: "translateY(-30px) scale(0.5)" }}
        >
          {noMatch ? "💔" : "🫶"}
        </div>

        {/* "BEST (TASTE) BUDS" pill */}
        <div
          className="rounded-full px-7 py-2.5"
          style={{
            background: "#FE392D",
            ...(pillIn
              ? { animation: "fadeUp 0.35s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }),
          }}
        >
          <span className="text-white font-bold text-[14px] tracking-[2px] uppercase">best (taste) buds</span>
        </div>

        {noMatch ? (
          /* Fallback: no match */
          <div
            className="text-[#888] font-bold text-[22px] text-center leading-snug px-2"
            style={wrapIn
              ? { animation: "fadeUp 0.5s ease forwards" }
              : { opacity: 0, transform: "translateY(14px)" }}
          >
            you should try dining alone 🍽️
          </div>
        ) : (
          /* Puzzle pieces */
          <div className="flex items-center justify-center">
            {/* Left piece — body BW wide, tab protrudes TR to the right */}
            <div
              style={{
                width: BW + TR, height: PH,
                background: "#FE392D",
                clipPath: LEFT_CLIP,
                display: "flex", alignItems: "center", justifyContent: "center",
                paddingRight: TR,
                position: "relative", zIndex: 0,
                ...(sliding
                  ? { animation: "slideInLeft 0.65s linear forwards" }
                  : { transform: "translateX(-80px)", opacity: 0 }),
              }}
            >
              <span className="text-white font-bold text-[13px] leading-tight text-center" style={{ maxWidth: BW - 20 }}>
                {viewerName}
              </span>
            </div>

            {/* Right piece — body BW wide, notch cut from left; overlaps left by TR so tab fills notch */}
            <div
              style={{
                width: BW, height: PH,
                background: "#FCCC75",
                clipPath: RIGHT_CLIP,
                display: "flex", alignItems: "center", justifyContent: "center",
                paddingLeft: TR,
                marginLeft: -TR,
                position: "relative", zIndex: 1,
                ...(sliding
                  ? { animation: "slideInRight 0.65s linear forwards" }
                  : { transform: "translateX(80px)", opacity: 0 }),
              }}
            >
              <span className="text-white font-bold text-[13px] leading-tight text-center" style={{ maxWidth: BW - 20 }}>
                {bestBud!.displayName}
              </span>
            </div>
          </div>
        )}

        {/* Subtitle */}
        <div
          className="text-[#AAA] font-bold text-[17px] italic"
          style={subIn
            ? { animation: "fadeUp 0.35s ease forwards" }
            : { opacity: 0, transform: "translateY(14px)" }}
        >
          {noMatch ? "better luck next time" : "you should share next time"}
        </div>

        {/* Badge */}
        {!noMatch && (
          <div
            className="rounded-full px-8 py-3.5 flex items-center"
            style={{
              background: "#FE392D",
              ...(badgeIn
                ? { animation: "fadeUp 0.35s ease forwards" }
                : { opacity: 0, transform: "translateY(14px)" }),
            }}
          >
            <span className="text-white font-bold text-[16px]">{matchPct}% match</span>
          </div>
        )}

      </div>

      <ShareOverlay
        visible={shareIn}
        sessionId={sessionId}
        screen="best-buds"
        shareData={{ restaurant: data.restaurant, bestBud, viewerName }}
        bgColor="#FFF8EE"
      />
    </div>
  );
}

// ── Shell: progress bars + tap navigation ─────────────────────────────────────
const TOTAL_SLIDES = 5;

function WrappedInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [slide, setSlide] = useState(0);

  const viewerId = searchParams.get("viewerId") ?? (typeof window !== "undefined" ? sessionStorage.getItem("playerId") : "") ?? "";

  useEffect(() => {
    fetch(`/api/session/${id}/results${viewerId ? `?playerId=${viewerId}` : ""}`)
      .then((r) => r.json())
      .then(setData);
  }, [id, viewerId]);

  function advance() { setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1)); }
  function back()    { setSlide((s) => Math.max(s - 1, 0)); }

  const onTap = (e: React.MouseEvent) => {
    e.clientX < window.innerWidth / 2 ? back() : advance();
  };

  return (
    <main className="h-dvh bg-[#FFF8E8] relative overflow-hidden select-none" onClick={onTap}>
      {/* Story progress bars */}
      <div className="absolute top-3 left-3 right-3 flex gap-1.5" style={{ zIndex: 30 }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-black/10 overflow-hidden">
            {i < slide  && <div className="h-full w-full bg-black/30 rounded-full" />}
            {i === slide && <div className="h-full bg-black/30 rounded-full" style={{ width: "40%" }} />}
          </div>
        ))}
      </div>

      {!data ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-[#9CA3AF] italic text-sm">loading...</p>
        </div>
      ) : (
        <>
          {slide === 0 && <SlideGroupRankings key="s0" data={data} sessionId={id} />}
          {slide === 1 && <SlideMostLoved key="s1" data={data} sessionId={id} />}
          {slide === 2 && <SlideNachoType key="s2" data={data} sessionId={id} />}
          {slide === 3 && <SlideHotCold key="s3" data={data} sessionId={id} />}
          {slide === 4 && <SlideBestBuds key="s4" data={data} sessionId={id} viewerId={viewerId} />}
        </>
      )}
    </main>
  );
}

export default function WrappedPage() {
  return (
    <Suspense>
      <WrappedInner />
    </Suspense>
  );
}
