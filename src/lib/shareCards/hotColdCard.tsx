// Satori JSX — Hot & Cold share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

export type HotColdCardData = {
  restaurant: { name: string };
  hotCold: { name: string; highRank: number; lowRank: number };
  date?: string;
};

export function hotColdCard(data: HotColdCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FFF8EE", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Background split — left half red tint, right half blue tint */}
      <div style={flex({ position: "absolute", top: 0, left: 0, width: 540, height: 1920, background: "rgba(232,55,42,0.08)" })} />
      <div style={flex({ position: "absolute", top: 0, right: 0, width: 540, height: 1920, background: "rgba(91,164,207,0.08)" })} />

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
      <div style={flex({ flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 48, paddingBottom: 200 })}>

        {/* Pill */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 48, paddingRight: 48, paddingTop: 16, paddingBottom: 16 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "white", letterSpacing: 4 }}>HOT &amp; COLD</span>
        </div>

        {/* Dish name */}
        <div style={flex({ background: "white", borderRadius: 32, paddingLeft: 56, paddingRight: 56, paddingTop: 36, paddingBottom: 36, maxWidth: 900, border: "4px solid #F0E8D0" })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 68, color: "#333", textAlign: "center", lineHeight: 1.1 }}>{data.hotCold.name}</span>
        </div>

        {/* High / Low rank split */}
        <div style={flex({ gap: 32 })}>
          <div style={flex({ flexDirection: "column", alignItems: "center", gap: 12, background: "rgba(232,55,42,0.12)", borderRadius: 24, paddingLeft: 56, paddingRight: 56, paddingTop: 32, paddingBottom: 32 })}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "#E8372A" }}>AS HIGH AS</span>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 80, color: "#E8372A" }}>{`#${data.hotCold.highRank}`}</span>
          </div>
          <div style={flex({ flexDirection: "column", alignItems: "center", gap: 12, background: "rgba(91,164,207,0.12)", borderRadius: 24, paddingLeft: 56, paddingRight: 56, paddingTop: 32, paddingBottom: 32 })}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "#5BA4CF" }}>AS LOW AS</span>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 80, color: "#5BA4CF" }}>{`#${data.hotCold.lowRank}`}</span>
          </div>
        </div>

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 30, color: "#888", fontStyle: "italic", textAlign: "center" }}>most controversial playte debate</span>
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
