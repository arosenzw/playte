// Satori JSX — Most Loved share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

export type MostLovedCardData = {
  restaurant: { name: string };
  mostLoved: { name: string; count: number };
  date?: string;
};

export function mostLovedCard(data: MostLovedCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FE392D", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/logo_long.png`} width={180} height={65} style={{ position: "absolute", top: 52, left: 52, opacity: 0.15 }} alt="" />

      {/* Playte wordmark top (white) */}
      <div style={flex({ position: "absolute", top: 60, left: 52 })}>
        <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "white", letterSpacing: 2 }}>playte</span>
      </div>

      {/* Header */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 140 })}>
        <div style={flex({ fontSize: 52, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.1, textAlign: "center", maxWidth: 900 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 6, marginTop: 12 })}>
          {date}
        </div>
        <div style={flex({ width: 80, height: 6, background: "#FCCC75", borderRadius: 4, marginTop: 20 })} />
      </div>

      {/* Main content */}
      <div style={flex({ flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 48, paddingBottom: 200 })}>

        {/* Pill */}
        <div style={flex({ background: "rgba(255,255,255,0.2)", borderRadius: 999, paddingLeft: 48, paddingRight: 48, paddingTop: 16, paddingBottom: 16 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "white", letterSpacing: 4 }}>MOST LOVED</span>
        </div>

        {/* Dish name */}
        <div style={flex({ background: "white", borderRadius: 32, paddingLeft: 56, paddingRight: 56, paddingTop: 36, paddingBottom: 36, maxWidth: 900 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 72, color: "#FE392D", textAlign: "center", lineHeight: 1.1 }}>{data.mostLoved.name}</span>
        </div>

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>clean plate club</span>
        </div>

        {/* Badge */}
        <div style={flex({ background: "#FCCC75", borderRadius: 999, paddingLeft: 48, paddingRight: 48, paddingTop: 20, paddingBottom: 20 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 30, color: "#1A1A1A" }}>
            {`★ ranked #1 by ${data.mostLoved.count} player${data.mostLoved.count !== 1 ? "s" : ""}`}
          </span>
        </div>

      </div>

      {/* Bottom strip */}
      <div style={flex({ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, background: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 })}>
        <div style={flex({ fontSize: 48, fontWeight: 700, color: "white", letterSpacing: 3 })}>playte</div>
        <div style={flex({ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.6)" })}>rank your meals together</div>
      </div>

    </div>
  );
}
