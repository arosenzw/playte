"use client";

const MEDAL: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "#FFD700", border: "#C8A000", text: "#7A5000" },
  2: { bg: "#D8D8D8", border: "#A0A0A0", text: "#505050" },
  3: { bg: "#E8A870", border: "#B87040", text: "#6B3A1F" },
};

const SPACING = 5;
const PLATE_COUNTS: Record<number, number> = { 1: 8, 2: 5, 3: 3 };

function PlateStack({ count, widthPx, plateSrc }: { count: number; widthPx: number; plateSrc: string }) {
  const plateH = Math.round(widthPx * (300 / 450));
  const totalH = plateH + (count - 1) * SPACING;
  return (
    <div style={{ position: "relative", width: "100%", height: totalH }}>
      {Array.from({ length: count }, (_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={plateSrc}
          alt=""
          style={{ position: "absolute", width: "100%", top: i * SPACING, zIndex: count - i, height: plateH, objectFit: "fill" }}
        />
      ))}
    </div>
  );
}

function MedalBadge({ place }: { place: 1 | 2 | 3 }) {
  const m = MEDAL[place];
  const size = place === 1 ? 44 : 34;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: m.bg, border: `3px solid ${m.border}`, color: m.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: place === 1 ? 22 : 16,
    }}>
      {place}
    </div>
  );
}

export function PodiumShareCard({
  restaurantName,
  handle,
  dishes,
  cardRef,
  plateSrc = "/plate.png",
}: {
  restaurantName: string;
  handle?: string;
  dishes: { id: string; name: string }[];
  cardRef: React.RefObject<HTMLDivElement>;
  plateSrc?: string;
}) {
  const top3 = dishes.slice(0, 3);
  const [second, first, third] = [top3[1], top3[0], top3[2]];

  return (
    <div
      ref={cardRef}
      style={{
        width: 360,
        height: 480,
        background: "#FFF8E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 28px 28px",
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
        gap: 8,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo_long_red.png" alt="playte" style={{ width: 130, objectFit: "contain" }} />
      <p style={{ color: "#9CA3AF", fontSize: 12, fontStyle: "italic", margin: 0 }}>{restaurantName}</p>

      {handle ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FE392D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" style={{ width: 20, height: 20 }} />
          </div>
          <p style={{ color: "#FE392D", fontWeight: 700, fontSize: 18, margin: 0 }}>@{handle}</p>
        </div>
      ) : (
        <p style={{ color: "#FE392D", fontWeight: 700, fontSize: 20, margin: "4px 0 0" }}>the results are in.</p>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, width: "100%", marginTop: 16, flex: 1 }}>
        {[
          { dish: second, place: 2, width: 100 },
          { dish: first,  place: 1, width: 130 },
          { dish: third,  place: 3, width: 100 },
        ].map(({ dish, place, width }) => dish ? (
          <div key={place} style={{ display: "flex", flexDirection: "column", alignItems: "center", width }}>
            <MedalBadge place={place as 1 | 2 | 3} />
            <p style={{ color: "#4B4B4B", fontSize: place === 1 ? 13 : 11, fontWeight: place === 1 ? 600 : 400, textAlign: "center", margin: "6px 0 -18px", lineHeight: 1.3 }}>
              {dish.name}
            </p>
            <PlateStack count={PLATE_COUNTS[place]} widthPx={width} plateSrc={plateSrc} />
          </div>
        ) : null)}
      </div>

      <p style={{ color: "#9CA3AF", fontSize: 10, marginTop: 12 }}>made with playte</p>
    </div>
  );
}
