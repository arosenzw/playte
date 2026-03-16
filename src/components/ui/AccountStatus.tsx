"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountStatus({ corner = false }: { corner?: boolean }) {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDisplayName(sessionStorage.getItem("userDisplayName"));
  }, []);

  if (corner) {
    if (!mounted) return null;
    const href = displayName ? "/account" : "/auth";
    return (
      <Link
        href={href}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-[#FCCC75]/40 text-[#646464] hover:bg-[#FCCC75]"
        aria-label={displayName ? "my account" : "sign in"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </Link>
    );
  }

  if (displayName) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[#9CA3AF] italic text-sm">signed in as {displayName}</span>
        <Link href="/account" className="text-[#FE392D] text-sm font-semibold">
          my history →
        </Link>
      </div>
    );
  }

  return (
    <Link href="/auth" className="text-[#9CA3AF] italic text-sm text-center">
      sign in / my account
    </Link>
  );
}
