"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  cuisineType: string | null;
}

export default function RestaurantSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  }

  function handleSelect(place: PlaceResult) {
    setSelected(place);
    setQuery(place.name);
    setResults([]);
  }

  function handleNext() {
    if (!query.trim()) return;

    // Use selected place data or fall back to manual entry
    const restaurant = selected ?? {
      placeId: null,
      name: query.trim(),
      address: null,
      lat: null,
      lng: null,
      cuisineType: null,
    };

    sessionStorage.setItem("restaurant", JSON.stringify(restaurant));
    router.push("/create/dishes");
  }

  const canProceed = query.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#FFF8E8] flex flex-col items-center px-6 pt-16 pb-10">
      {/* Logo */}
      <Image src="/logo.png" alt="playte" width={80} height={80} priority />

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-6">
        <h1 className="text-[#FE392D] text-3xl font-bold text-center">
          where are you dining?
        </h1>

        <div className="w-full relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="enter location"
            className="w-full bg-[#FCCC75] text-[#6B7280] placeholder-[#C8A050] text-xl font-medium text-center py-4 px-6 rounded-2xl outline-none"
          />

          {/* Suggestions dropdown */}
          {results.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg overflow-hidden z-10">
              {results.map((place) => (
                <li key={place.placeId}>
                  <button
                    onClick={() => handleSelect(place)}
                    className="w-full text-left px-4 py-3 hover:bg-[#FFF8E8] border-b border-gray-100 last:border-0"
                  >
                    <p className="text-[#1a1a1a] font-semibold text-sm">{place.name}</p>
                    <p className="text-[#9CA3AF] text-xs">{place.address}</p>
                  </button>
                </li>
              ))}
              {/* Manual entry fallback */}
              <li>
                <button
                  onClick={() => { setSelected(null); setResults([]); }}
                  className="w-full text-left px-4 py-3 text-[#9CA3AF] text-xs italic"
                >
                  Can&apos;t find it? Continue with &quot;{query}&quot;
                </button>
              </li>
            </ul>
          )}

          {loading && (
            <p className="text-center text-[#9CA3AF] text-sm mt-2">searching...</p>
          )}
        </div>
      </div>

      {/* Next button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            canProceed ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          next
        </button>
      </div>
    </main>
  );
}
