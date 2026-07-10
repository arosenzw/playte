// Satori JSX — Best (Taste) Buds share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

export type BestBudsCardData = {
  restaurant: { name: string };
  bestBud: { displayName: string; matchPercent: number } | null;
  viewerName: string;
  date?: string;
};

export function bestBudsCard(data: BestBudsCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();
  const noMatch = !data.bestBud || data.bestBud.matchPercent < 10;

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FFF8EE", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/logo_long.png`} width={180} height={65} style={{ position: "absolute", top: 52, left: 52 }} alt="" />

      {/* Header */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 140 })}>
        <div style={flex({ fontSize: 52, fontWeight: 700, color: "#FE392D", lineHeight: 1.1, textAlign: "center", maxWidth: 900 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 22, fontWeight: 700, color: "#BBBBBB", letterSpacing: 6, marginTop: 12 })}>
          {date}
        </div>
        <div style={flex({ width: 80, height: 6, background: "#FCCC75", borderRadius: 4, marginTop: 20 })} />
      </div>

      {/* Main content */}
      <div style={flex({ flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 52, paddingBottom: 200 })}>

        {/* Pill */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 48, paddingRight: 48, paddingTop: 16, paddingBottom: 16 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "white", letterSpacing: 4 }}>BEST (TASTE) BUDS</span>
        </div>

        {noMatch ? (
          /* No match fallback */
          <div style={flex({ flexDirection: "column", alignItems: "center", gap: 24 })}>
            <span style={{ fontFamily: "Poppins", fontSize: 120 }}>💔</span>
            <div style={flex({ background: "white", borderRadius: 32, paddingLeft: 56, paddingRight: 56, paddingTop: 36, paddingBottom: 36, border: "4px solid #F0E8D0" })}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: "#888", textAlign: "center" }}>you should try dining alone</span>
            </div>
          </div>
        ) : (
          /* Match — two colored name blocks */
          <div style={flex({ flexDirection: "column", alignItems: "center", gap: 36 })}>
            <span style={{ fontFamily: "Poppins", fontSize: 120 }}>🫶</span>
            <div style={flex({ gap: 0 })}>
              {/* Left block (viewer) */}
              <div style={flex({ background: "#FE392D", borderRadius: "24px 0 0 24px", paddingLeft: 48, paddingRight: 56, paddingTop: 32, paddingBottom: 32, alignItems: "center", justifyContent: "center", minWidth: 280 })}>
                <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "white", textAlign: "center" }}>{data.viewerName}</span>
              </div>
              {/* Right block (best bud) */}
              <div style={flex({ background: "#FCCC75", borderRadius: "0 24px 24px 0", paddingLeft: 56, paddingRight: 48, paddingTop: 32, paddingBottom: 32, alignItems: "center", justifyContent: "center", minWidth: 280 })}>
                <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "white", textAlign: "center" }}>{data.bestBud!.displayName}</span>
              </div>
            </div>
            {/* Match badge */}
            <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 56, paddingRight: 56, paddingTop: 24, paddingBottom: 24 })}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "white" }}>{`${data.bestBud!.matchPercent}% match`}</span>
            </div>
          </div>
        )}

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 30, color: "#888", fontStyle: "italic" }}>
            {noMatch ? "better luck next time" : "you should share next time"}
          </span>
        </div>

      </div>

      {/* Bottom strip */}
      <div style={flex({ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, background: "#FE392D", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 })}>
        <div style={flex({ fontSize: 48, fontWeight: 700, color: "white", letterSpacing: 3 })}>playte</div>
        <div style={flex({ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.7)" })}>rank your meals together</div>
      </div>

    </div>
  );
}
