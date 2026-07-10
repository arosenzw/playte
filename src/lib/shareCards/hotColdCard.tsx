// Satori JSX — Hot & Cold share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path
// Background split is approximated with SVG polygon (Satori supports basic SVG)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

// Hot pepper emoji — 1F336
const EMOJI_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f336.svg";

export type HotColdCardData = {
  restaurant: { name: string };
  hotCold: { name: string; highRank: number; lowRank: number };
  date?: string;
};

export function hotColdCard(data: HotColdCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  // Zigzag bolt path matching the slide's lightning split, scaled to 1080×1920
  // Points: top→right-of-center, zag left, zag right, bottom→left-of-center
  const W = 1080, H = 1920, cx = W / 2;
  const boltPoints = [
    [cx + 60,  0],
    [cx + 120, 560],
    [cx - 60,  800],
    [cx + 80,  1080],
    [cx - 80,  1380],
    [cx + 60,  H],
  ] as [number, number][];

  const leftPoly  = `0,0 ${boltPoints.map(([x,y]) => `${x},${y}`).join(' ')} 0,${H}`;
  const rightPoly = `${W},0 ${boltPoints.map(([x,y]) => `${x},${y}`).join(' ')} ${W},${H}`;

  return (
    <div style={flex({ width: W, height: H, background: "#FFF8EE", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Split background via SVG */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: W, height: H }} viewBox={`0 0 ${W} ${H}`}>
        <polygon points={leftPoly}  fill="rgba(232,55,42,0.13)" />
        <polygon points={rightPoly} fill="rgba(91,164,207,0.13)" />
        {/* Gold bolt outline */}
        <polyline points={boltPoints.map(([x,y]) => `${x},${y}`).join(' ')} fill="none" stroke="#FCCC75" strokeWidth="6" />
      </svg>

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/logo_long_red.png`} width={200} height={72} style={{ position: "absolute", top: 52, left: 52 }} alt="" />

      {/* Restaurant + date */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 180 })}>
        <div style={flex({ fontSize: 64, fontWeight: 700, color: "#FE392D", lineHeight: 1.1, textAlign: "center", maxWidth: 900 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 26, fontWeight: 700, color: "#BBBBBB", letterSpacing: 6, marginTop: 16 })}>
          {date}
        </div>
        <div style={flex({ width: 100, height: 7, background: "#FCCC75", borderRadius: 4, marginTop: 24 })} />
      </div>

      {/* Center content */}
      <div style={flex({ flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 56, paddingBottom: 180 })}>

        {/* Emoji */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EMOJI_URL} width={160} height={160} alt="" />

        {/* "HOT & COLD" pill */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 56, paddingRight: 56, paddingTop: 20, paddingBottom: 20 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 32, color: "white", letterSpacing: 4 }}>HOT &amp; COLD</span>
        </div>

        {/* Dish name — white card with red border */}
        <div style={flex({ background: "white", borderRadius: 40, border: "4px solid #FE392D", paddingLeft: 80, paddingRight: 80, paddingTop: 48, paddingBottom: 48, maxWidth: 920 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 96, color: "#FE392D", textAlign: "center", lineHeight: 1.05 }}>
            {data.hotCold.name}
          </span>
        </div>

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "#AAAAAA", fontStyle: "italic" }}>most controversial playte debate</span>
        </div>

        {/* Red badge */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 60, paddingRight: 60, paddingTop: 28, paddingBottom: 28 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "white" }}>
            {`as high as #${data.hotCold.highRank}, as low as #${data.hotCold.lowRank}`}
          </span>
        </div>

      </div>

    </div>
  );
}
