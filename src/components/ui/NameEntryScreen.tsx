"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NameEntryScreenProps {
  storageKey: string;
  nextRoute: string;
}

export default function NameEntryScreen({ storageKey, nextRoute }: NameEntryScreenProps) {
  const [name, setName] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleNext() {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem(storageKey, trimmed);
    router.push(nextRoute);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleNext();
  }

  const hasName = name.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      {/* Logo */}
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-6">
        <h1 className="text-[#FE392D] text-3xl font-bold text-center">
          what&apos;s your name?
        </h1>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="enter name"
          maxLength={50}
          className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-medium text-center py-4 px-6 rounded-2xl outline-none uppercase"
        />
      </div>

      {/* Next button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleNext}
          disabled={!hasName}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            hasName ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          next
        </button>
      </div>
    </main>
  );
}
