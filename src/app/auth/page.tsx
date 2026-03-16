"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    email.trim().length > 0 &&
    password.length > 0 &&
    (mode === "signin" || displayName.trim().length > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { displayName: displayName.trim() } },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        const userId = data.user?.id;
        const userEmail = data.user?.email ?? email.trim();

        if (!userId) {
          setError("Something went wrong. Please try again.");
          return;
        }

        await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, email: userEmail, displayName: displayName.trim() }),
        });

        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("userDisplayName", displayName.trim());

        const dest = redirect.includes("?")
          ? `${redirect}&autosave=1`
          : `${redirect}?autosave=1`;
        router.push(dest);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        const user = data.user;
        if (!user) {
          setError("Something went wrong. Please try again.");
          return;
        }

        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userEmail", user.email ?? email.trim());

        // Try metadata first (set during signup), fall back to DB lookup
        let resolvedName = (user.user_metadata?.displayName as string) ?? "";
        if (!resolvedName) {
          const meRes = await fetch("/api/auth/signup");
          if (meRes.ok) {
            const me = await meRes.json();
            resolvedName = me.displayName ?? "";
          }
        }
        sessionStorage.setItem("userDisplayName", resolvedName || (user.email ?? ""));

        const dest = redirect.includes("?")
          ? `${redirect}&autosave=1`
          : `${redirect}?autosave=1`;
        router.push(dest);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      <h1 className="text-[#FE392D] text-3xl font-bold mt-6 mb-1">
        {mode === "signin" ? "welcome back." : "join the table."}
      </h1>
      <p className="text-[#9CA3AF] italic text-sm text-center mb-8">
        {mode === "signin"
          ? "sign in to save your results"
          : "create an account to save your results"}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        {mode === "signup" && (
          <input
            type="text"
            placeholder="display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-medium py-4 px-6 rounded-2xl outline-none"
          />
        )}
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-medium py-4 px-6 rounded-2xl outline-none"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-medium py-4 px-6 rounded-2xl outline-none"
        />

        {error && <p className="text-[#FE392D] text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full mt-2 transition-colors ${
            !isValid || loading ? "bg-[#F88888]" : "bg-[#FE392D]"
          }`}
        >
          {loading ? "one sec..." : mode === "signin" ? "sign in" : "sign up"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
        }}
        className="text-[#9CA3AF] italic text-sm text-center mt-6"
      >
        {mode === "signin"
          ? "don't have an account? sign up"
          : "already have an account? sign in"}
      </button>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
