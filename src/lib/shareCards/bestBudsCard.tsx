// Satori JSX — Best (Taste) Buds share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path
// Puzzle pieces drawn with SVG <path> elements (tab + notch geometry)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

const EMOJI_MATCH    = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1faf6.svg"; // 🫶
const EMOJI_NO_MATCH = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f494.svg"; // 💔

// Puzzle geometry (px, in SVG coordinate space)
// Left piece: body 0→BW, CW arc tab from (BW, TC-TR) to (BW, TC+TR) bulging right
// Right piece: body BW→W, CCW arc notch from (BW, TC+TR) to (BW, TC-TR) curving right (void matches tab)
const W  = 700;  // total SVG width
const PH = 280;  // piece height (~0.8× BW, matching slide proportions)
const BW = 350;  // body half-width
const TR = 54;   // tab/notch radius
const TC = 140;  // tab center Y
const T0 = TC - TR; // 86
const T1 = TC + TR; // 194

const LEFT_PATH  = `M 0 0 H ${BW} V ${T0} A ${TR} ${TR} 0 0 1 ${BW} ${T1} V ${PH} H 0 Z`;
const RIGHT_PATH = `M ${BW} 0 H ${W} V ${PH} H ${BW} V ${T1} A ${TR} ${TR} 0 0 0 ${BW} ${T0} V 0 Z`;

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
          /* SVG puzzle pieces with absolutely positioned name text */
          <div style={{ position: "relative", width: W, height: PH, display: "flex" }}>
            <svg
              width={W}
              height={PH}
              viewBox={`0 0 ${W} ${PH}`}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <path d={LEFT_PATH}  fill="#FE392D" />
              <path d={RIGHT_PATH} fill="#FCCC75" />
            </svg>
            {/* Left name (viewer) */}
            <div style={{
              position: "absolute", left: 0, top: 0, width: BW, height: PH,
              display: "flex", alignItems: "center", justifyContent: "center",
              paddingLeft: 40, paddingRight: 48,
            }}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "white", textAlign: "center" }}>
                {data.viewerName}
              </span>
            </div>
            {/* Right name (best bud) — offset past tab tip */}
            <div style={{
              position: "absolute", left: BW + TR, top: 0, width: W - BW - TR, height: PH,
              display: "flex", alignItems: "center", justifyContent: "center",
              paddingRight: 40,
            }}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "white", textAlign: "center" }}>
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
