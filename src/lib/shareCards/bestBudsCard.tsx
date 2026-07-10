// Satori JSX — Best (Taste) Buds share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

const EMOJI_MATCH    = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1faf6.svg"; // 🫶
const EMOJI_NO_MATCH = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f494.svg"; // 💔

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
  const emojiUrl = noMatch ? EMOJI_NO_MATCH : EMOJI_MATCH;

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
        <img src={emojiUrl} width={160} height={160} alt="" />

        {/* "BEST (TASTE) BUDS" pill */}
        <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 56, paddingRight: 56, paddingTop: 20, paddingBottom: 20 })}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 32, color: "white", letterSpacing: 4 }}>BEST (TASTE) BUDS</span>
        </div>

        {noMatch ? (
          /* No match */
          <div style={flex({ flexDirection: "column", alignItems: "center", gap: 32 })}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: "#AAAAAA", textAlign: "center" }}>you should try dining alone</span>
          </div>
        ) : (
          /* Puzzle-style name blocks */
          <div style={flex({ flexDirection: "row" })}>
            {/* Left piece (viewer) — red, rounded left */}
            <div style={flex({
              background: "#FE392D",
              borderRadius: "32px 0 0 32px",
              paddingLeft: 64, paddingRight: 80,
              paddingTop: 48, paddingBottom: 48,
              alignItems: "center", justifyContent: "center",
              minWidth: 320,
            })}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: "white", textAlign: "center" }}>
                {data.viewerName}
              </span>
            </div>
            {/* Right piece (best bud) — gold, rounded right */}
            <div style={flex({
              background: "#FCCC75",
              borderRadius: "0 32px 32px 0",
              paddingLeft: 80, paddingRight: 64,
              paddingTop: 48, paddingBottom: 48,
              alignItems: "center", justifyContent: "center",
              minWidth: 320,
            })}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 52, color: "white", textAlign: "center" }}>
                {data.bestBud!.displayName}
              </span>
            </div>
          </div>
        )}

        {/* Subtitle */}
        <div style={flex({})}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "#AAAAAA", fontStyle: "italic" }}>
            {noMatch ? "better luck next time" : "you should share next time"}
          </span>
        </div>

        {/* Match badge (match only) */}
        {noMatch ? null : (
          <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 60, paddingRight: 60, paddingTop: 28, paddingBottom: 28 })}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "white" }}>
              {`${data.bestBud!.matchPercent}% match`}
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
