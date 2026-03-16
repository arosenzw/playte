import Link from "next/link";
import Image from "next/image";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#FFF8E8] flex flex-col items-center justify-between px-6 py-16">
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
    </main>
  );
}
