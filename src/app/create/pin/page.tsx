"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export default function CreatePinPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setJoinCode(sessionStorage.getItem("joinCode"));
    setOrigin(window.location.origin);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleShare() {
    const url = `${origin}/join/code?code=${joinCode}`;
    const text = `join my playte game! use code ${joinCode} or tap the link: ${url}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(url);
      alert("link copied!");
    }
  }

  return (
    <main className="fixed inset-0 bg-[#FFF8E8] flex flex-col items-center px-6 pt-8 pb-6">
      <Image src="/logo.png" alt="playte" width={56} height={56} priority />

      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center w-full max-w-sm">
        <h1 className="text-[#FE392D] text-3xl font-bold">your table&apos;s pin</h1>
        <p className="text-[#6B7280] italic text-sm">share this with your table</p>
        <p className="text-[#FE392D] text-4xl font-bold tracking-wider mt-1">
          {joinCode ?? "------"}
        </p>
        {joinCode && (
          <div className="mt-1 p-2 bg-white rounded-2xl shadow-sm">
            <QRCodeSVG
              value={`${origin}/join/code?code=${joinCode}`}
              size={90}
              fgColor="#FE392D"
              bgColor="#FFFFFF"
            />
          </div>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-2">
        {joinCode && (
          <button
            onClick={handleShare}
            className="w-full bg-[#FCCC75] text-[#646464] text-sm font-semibold py-3 rounded-full"
          >
            invite via text
          </button>
        )}
        <button
          onClick={() => router.push("/create/dishes")}
          className="w-full bg-[#FE392D] text-white text-xl font-semibold py-4 rounded-full"
        >
          add dishes
        </button>
      </div>
    </main>
  );
}
