"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

type Dish = { id: string; name: string; avgRank: number };
type InsightDish = { id: string; name: string; count: number };
type ResultsData = {
  restaurant: { name: string };
  rankedDishes: Dish[];
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

// ── Shell: progress bars + tap navigation ─────────────────────────────────────
const TOTAL_SLIDES = 5;

function WrappedInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const playerId = searchParams.get("viewerId") ?? sessionStorage.getItem("playerId") ?? "";
    fetch(`/api/session/${id}/results${playerId ? `?playerId=${playerId}` : ""}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

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
          {slide === 2 && (
            <div className="absolute inset-0 bg-[#FFF8E8] flex items-center justify-center" style={{ zIndex: 2 }}>
              <p className="text-[#444] text-2xl font-bold">Slide 3 — Nacho Type</p>
            </div>
          )}
          {slide === 3 && (
            <div className="absolute inset-0 bg-[#FFF8E8] flex items-center justify-center" style={{ zIndex: 2 }}>
              <p className="text-[#444] text-2xl font-bold">Slide 4 — Hot & Cold</p>
            </div>
          )}
          {slide === 4 && (
            <div className="absolute inset-0 bg-[#FFF8E8] flex items-center justify-center" style={{ zIndex: 2 }}>
              <p className="text-[#444] text-2xl font-bold">Slide 5 — Best Buds</p>
            </div>
          )}
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
