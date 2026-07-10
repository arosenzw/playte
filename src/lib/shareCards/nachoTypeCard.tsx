// Satori JSX — Nacho Type share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

const EMOJI_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f928.svg";

export type NachoTypeCardData = {
  restaurant: { name: string };
  nachoType: { name: string; count: number };
  date?: string;
};

export function nachoTypeCard(data: NachoTypeCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FFF8EE", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

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

        {/* "NACHO TYPE" pill */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 56, paddingRight: 56, paddingTop: 20, paddingBottom: 20 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 32, color: "white", letterSpacing: 4 }}>NACHO TYPE</span>
        </div>

        {/* Dish name — white card with red border */}
        <div style={flex({ background: "white", borderRadius: 40, border: "4px solid #FE392D", paddingLeft: 80, paddingRight: 80, paddingTop: 48, paddingBottom: 48, maxWidth: 920 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 96, color: "#FE392D", textAlign: "center", lineHeight: 1.05 }}>
            {data.nachoType.name}
          </span>
        </div>

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "#AAAAAA", fontStyle: "italic" }}>zero out of ten, respectfully</span>
        </div>

        {/* Dark badge */}
        <div style={flex({ background: "#1A1A1A", borderRadius: 999, paddingLeft: 60, paddingRight: 60, paddingTop: 28, paddingBottom: 28 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "white" }}>
            {`ranked last by ${data.nachoType.count} player${data.nachoType.count !== 1 ? "s" : ""}`}
          </span>
        </div>

      </div>

    </div>
  );
}
