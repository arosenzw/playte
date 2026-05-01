"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MIN_DISHES = 4;
const MAX_DISHES = 20;

export default function DishEntryPage() {
  const [input, setInput] = useState("");
  const [dishes, setDishes] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function addDish() {
    const trimmed = input.trim();
    if (!trimmed || dishes.length >= MAX_DISHES) return;
    setDishes((prev) => [...prev, trimmed]);
    setInput("");
    inputRef.current?.focus();
  }

  function removeDish(index: number) {
    setDishes((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addDish();
    }
  }

  async function handleNext() {
    if (dishes.length < MIN_DISHES || creating) return;
    setCreating(true);

    const sessionId = sessionStorage.getItem("sessionId");
    const playerId = sessionStorage.getItem("playerId");
    const guestToken = sessionStorage.getItem("guestToken");
    const joinCode = sessionStorage.getItem("joinCode");

    try {
      const res = await fetch(`/api/session/${sessionId}/dishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishes, playerId, guestToken }),
      });

      if (!res.ok) throw new Error("Failed to add dishes");

      router.push(`/session/${sessionId}/lobby?code=${joinCode}`);
    } catch (err) {
      console.error("Failed to add dishes:", err);
      setCreating(false);
    }
  }

  const canProceed = dishes.length >= MIN_DISHES && !creating;

  return (
    <main className="min-h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      {/* Logo */}
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      {/* Form */}
      <div className="flex-1 flex flex-col items-center w-full max-w-sm gap-4 mt-8">
        <div className="w-full text-center">
          <h1 className="text-[#FE392D] text-3xl font-bold">
            what did you order?
          </h1>
          <p className="text-[#6B7280] text-sm italic mt-1">
            don&apos;t forget to include bread,<br />beverages, and desserts
          </p>
        </div>

        <div className="w-full">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="enter items"
              maxLength={150}
              className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-semibold text-center py-4 pl-6 pr-14 rounded-2xl outline-none uppercase"
            />
            <button
              onClick={addDish}
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/50 text-[#6B7280] text-2xl font-bold flex items-center justify-center disabled:opacity-30"
              aria-label="Add dish"
            >
              +
            </button>
          </div>
          <p className="text-center text-[#9CA3AF] text-xs italic mt-1">
            min {MIN_DISHES} items
          </p>
        </div>

        {/* Dish tags */}
        {dishes.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 mt-2">
            {dishes.map((dish, i) => (
              <span
                key={i}
                className="flex items-center gap-1 border-2 border-[#FCCC75] rounded-full px-3 py-1 text-[#4B4B4B] text-sm font-medium bg-transparent"
              >
                {dish}
                <button
                  onClick={() => removeDish(i)}
                  className="text-[#9CA3AF] hover:text-[#4B4B4B] ml-1 leading-none"
                  aria-label={`Remove ${dish}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="w-full max-w-sm mt-6">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            canProceed ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          {creating ? "creating..." : "next"}
        </button>
      </div>
    </main>
  );
}
