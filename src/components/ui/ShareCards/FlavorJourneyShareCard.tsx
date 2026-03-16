"use client";

type Insights = {
  mostLoved: { name: string; count: number } | null;
  nachoType: { name: string; count: number } | null;
  hotCold: { name: string; highRank: number; lowRank: number } | null;
  bestBud: { displayName: string; matchPercent: number } | null;
};

export function FlavorJourneyShareCard({
  restaurantName,
  insights,
  cardRef,
}: {
  restaurantName: string;
  insights: Insights;
  cardRef: React.RefObject<HTMLDivElement>;
}) {
  const rows = [
    insights.mostLoved  && { emoji: "😍", label: "most loved",        value: insights.mostLoved.name },
    insights.nachoType  && { emoji: "🥴", label: "nacho type",         value: insights.nachoType.name },
    insights.hotCold    && { emoji: "😐", label: "hot & cold",         value: insights.hotCold.name },
    insights.bestBud    && { emoji: "👯", label: "best (taste) buds",  value: insights.bestBud.displayName },
  ].filter(Boolean) as { emoji: string; label: string; value: string }[];

  return (
    <div
      ref={cardRef}
      style={{
        width: 360,
        background: "#FFF8E8",
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px 28px",
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
        gap: 0,
      }}
    >
      {/* Header */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo_long_red.png" alt="playte" style={{ width: 120, objectFit: "contain", marginBottom: 4 }} />
      <p style={{ color: "#9CA3AF", fontSize: 12, fontStyle: "italic", margin: "0 0 4px" }}>{restaurantName}</p>
      <p style={{ color: "#FE392D", fontWeight: 700, fontSize: 22, margin: "0 0 20px" }}>Flavor Journey</p>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(({ emoji, label, value }) => (
          <div
            key={label}
            style={{
              background: "#FFFCF5",
              borderRadius: 16,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ color: "#9CA3AF", fontSize: 11, margin: 0 }}>{label}</p>
              <p style={{ color: "#FE392D", fontWeight: 600, fontSize: 15, margin: 0 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: "#C8C8C8", fontSize: 10, textAlign: "center", marginTop: 20 }}>made with playte</p>
    </div>
  );
}
