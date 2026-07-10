// Satori JSX — Most Loved share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path; no CSS filter

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

// Twemoji via jsDelivr for reliable emoji rendering in Satori
const EMOJI_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f60d.svg";

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

      {/* Logo — white wordmark (no filter in Satori, use text) */}
      <div style={flex({ position: "absolute", top: 56, left: 56 })}>
        <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: "rgba(255,255,255,0.9)", letterSpacing: -1 }}>playte</span>
      </div>

      {/* Restaurant + date */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 180 })}>
        <div style={flex({ fontSize: 64, fontWeight: 700, color: "white", lineHeight: 1.1, textAlign: "center", maxWidth: 900 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 6, marginTop: 16 })}>
          {date}
        </div>
        <div style={flex({ width: 100, height: 7, background: "#F5A623", borderRadius: 4, marginTop: 24 })} />
      </div>

      {/* Center content */}
      <div style={flex({ flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 56, paddingBottom: 180 })}>

        {/* Emoji */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EMOJI_URL} width={160} height={160} alt="" />

        {/* "MOST LOVED" pill */}
        <div style={flex({ background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 999, paddingLeft: 56, paddingRight: 56, paddingTop: 20, paddingBottom: 20 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 32, color: "white", letterSpacing: 4 }}>MOST LOVED</span>
        </div>

        {/* Dish name — large white text, no box */}
        <div style={flex({ maxWidth: 960, justifyContent: "center" })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 120, color: "rgba(255,248,238,0.95)", textAlign: "center", lineHeight: 1.05 }}>
            {data.mostLoved.name}
          </span>
        </div>

        {/* Subtitle — italic gold */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "#F5A623", fontStyle: "italic" }}>clean plate club</span>
        </div>

        {/* Gold badge */}
        <div style={flex({ background: "#F5A623", borderRadius: 999, paddingLeft: 60, paddingRight: 60, paddingTop: 28, paddingBottom: 28 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "white" }}>
            {`★ ranked #1 by ${data.mostLoved.count} player${data.mostLoved.count !== 1 ? "s" : ""}`}
          </span>
        </div>

      </div>

    </div>
  );
}
