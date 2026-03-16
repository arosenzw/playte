"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const MEDAL: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "#FFD700", border: "#C8A000", text: "#7A5000" },
  2: { bg: "#D8D8D8", border: "#A0A0A0", text: "#505050" },
  3: { bg: "#E8A870", border: "#B87040", text: "#6B3A1F" },
};

const CONFIG: Record<number, { plates: number; flex: string }> = {
  1: { plates: 8, flex: "0 0 36%" },
  2: { plates: 5, flex: "0 0 27%" },
  3: { plates: 3, flex: "0 0 27%" },
};

// Reveal order: 3rd → 2nd → 1st
const REVEAL_DELAYS: Record<number, number> = { 3: 200, 2: 700, 1: 1200 };

const SPACING = 5;

function PlateStack({ count, widthPx }: { count: number; widthPx: number }) {
  const plateH = Math.round(widthPx * (300 / 450));
  const totalH = plateH + (count - 1) * SPACING;

  return (
    <div className="relative w-full" style={{ height: totalH }}>
      {Array.from({ length: count }, (_, i) => (
        <img
          key={i}
          src="/plate.png"
          alt=""
          className="absolute w-full"
          style={{ top: i * SPACING, zIndex: count - i, height: plateH, objectFit: "fill" }}
        />
      ))}
    </div>
  );
}

function PodiumColumn({
  place,
  name,
  widthPx,
  visible,
}: {
  place: 1 | 2 | 3;
  name: string;
  widthPx: number;
  visible: boolean;
}) {
  const { plates, flex } = CONFIG[place];
  const isFirst = place === 1;
  const medal = MEDAL[place];
  const medalSize = isFirst ? 40 : 32;

  return (
    <div className="flex flex-col items-center" style={{ flex }}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div
          className="rounded-full flex items-center justify-center font-bold shadow-md mx-auto"
          style={{
            width: medalSize,
            height: medalSize,
            backgroundColor: medal.bg,
            border: `3px solid ${medal.border}`,
            color: medal.text,
            fontSize: isFirst ? 20 : 16,
          }}
        >
          {place}
        </div>
        <p
          className={`text-[#4B4B4B] text-center leading-tight mt-1 mb-1 px-1 line-clamp-2 ${
            isFirst ? "text-sm font-semibold" : "text-xs"
          }`}
        >
          {name}
        </p>
      </div>
      <div style={{ marginTop: -18 }} className="w-full">
        <PlateStack count={plates} widthPx={widthPx} />
      </div>
    </div>
  );
}

const W1  = 132;
const W23 = 99;

export function Podium({ dishes, startDelay = 0 }: { dishes: { id: string; name: string }[]; startDelay?: number }) {
  const [visible, setVisible] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });

  useEffect(() => {
    ([3, 2, 1] as const).forEach((place) => {
      setTimeout(() => {
        setVisible((prev) => ({ ...prev, [place]: true }));
        if (place === 1) {
          setTimeout(() => {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.4 },
              colors: ["#FFD700", "#FFC200", "#FFE066", "#FFFACD", "#FFA500"],
            });
          }, 300);
        }
      }, startDelay + REVEAL_DELAYS[place]);
    });
  }, [startDelay]);

  const [second, first, third] = [dishes[1], dishes[0], dishes[2]];

  return (
    <div className="flex items-end justify-center gap-2 w-full px-2">
      {second && <PodiumColumn place={2} name={second.name} widthPx={W23} visible={visible[2]} />}
      {first  && <PodiumColumn place={1} name={first.name}  widthPx={W1}  visible={visible[1]} />}
      {third  && <PodiumColumn place={3} name={third.name}  widthPx={W23} visible={visible[3]} />}
    </div>
  );
}
