"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AccountStatus from "@/components/ui/AccountStatus";

export default function Landing() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <main className="min-h-dvh bg-[#FFF8E8] flex flex-col items-center justify-between px-6 py-16 relative">
      {/* Top-right: how to playte + account icon */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setShowAbout(true)}
          className="text-xs text-[#9CA3AF] font-medium hover:text-[#FE392D] transition-colors"
        >
          how to playte
        </button>
        <AccountStatus inline />
      </div>

      {/* Logo */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span className="text-[#F0B84B] text-4xl font-semibold tracking-wide">
          let&apos;s
        </span>
        <Image
          src="/logo_long_red.png"
          alt="playte"
          width={340}
          height={120}
          priority
          className="w-full max-w-[340px]"
        />
      </div>

      {/* CTAs */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1">
          <Link
            href="/create/name"
            className="w-full bg-[#FE392D] text-white text-2xl font-semibold text-center py-5 rounded-full"
          >
            start a game
          </Link>
          <span className="text-[#9CA3AF] text-sm">add dishes • invite friends</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Link
            href="/join/name"
            className="w-full bg-[#F88888] text-white text-2xl font-semibold text-center py-5 rounded-full"
          >
            join a game
          </Link>
          <span className="text-[#9CA3AF] text-sm">enter your table&apos;s pin</span>
        </div>
      </div>

      {/* About overlay */}
      {showAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          onClick={() => setShowAbout(false)}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-[#FFF8E8]/60 backdrop-blur-sm" />

          {/* Card */}
          <div
            className="relative w-full max-w-sm bg-white/70 backdrop-blur-md rounded-3xl px-6 py-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[#FE392D] text-xl font-bold leading-tight">What is Playte?</h2>
            <p className="text-[#646464] text-sm mt-2 leading-relaxed">
              This game is designed for plate sharers, not those who order their own dish.
            </p>
            <p className="text-[#646464] text-sm mt-1 leading-relaxed">
              Playte turns your dinner into a game. Rank what you ordered, compare with your table, and find out who actually has taste.
            </p>

            <h2 className="text-[#FE392D] text-xl font-bold leading-tight mt-5">How to Play</h2>
            <ol className="mt-2 flex flex-col gap-1.5">
              {[
                "After your meal, host inputs your dishes.",
                "Invite your table.",
                "Rank, reveal, & argue about it.",
                "Save to your account.",
                "Play again next time.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#646464]">
                  <span className="text-[#FE392D] font-bold flex-shrink-0 w-4">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full bg-[#FE392D] text-white text-sm font-semibold py-3 rounded-full"
            >
              let&apos;s eat
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
