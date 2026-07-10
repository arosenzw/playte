// Satori JSX — Recap / Summary share card (1080×1920)
// Satori rules: display:flex/none only; no &&; no clip-path

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

const EMOJI_MOST_LOVED = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f60d.svg";
const EMOJI_NACHO      = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f928.svg";
const EMOJI_HOT_COLD   = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f336.svg";
const EMOJI_BUDS       = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1faf6.svg";
const EMOJI_NO_MATCH   = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f494.svg";

const POD_CFG = [
  { slotIdx: 1, num: "2", height: 200, bg: "#DEDEDE", border: "#BDBDBD", numColor: "#888"    },
  { slotIdx: 0, num: "1", height: 290, bg: "#F5A623", border: "#C88A0A", numColor: "#1A1A1A" },
  { slotIdx: 2, num: "3", height: 140, bg: "#EDCFAA", border: "#C8A070", numColor: "#AA7840" },
];

export type SummaryCardData = {
  restaurant: { name: string };
  top3: Array<{ name: string }>;
  mostLoved: { name: string } | null;
  nachoType: { name: string } | null;
  hotCold:   { name: string } | null;
  bestBud:   { displayName: string; matchPercent: number } | null;
  date?: string;
};

export function summaryCard(data: SummaryCardData) {
  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  const noMatch = !data.bestBud;

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FFF8EE", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/logo_long_red.png`} width={200} height={72} style={{ position: "absolute", top: 52, left: 52 }} alt="" />

      {/* Restaurant + date */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 180 })}>
        <div style={flex({ fontSize: 64, fontWeight: 700, color: "#FE392D", lineHeight: 1.1, textAlign: "center", maxWidth: 920 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 26, fontWeight: 700, color: "#BBBBBB", letterSpacing: 6, marginTop: 16 })}>
          {date}
        </div>
        <div style={flex({ width: 100, height: 7, background: "#FCCC75", borderRadius: 4, marginTop: 24 })} />
      </div>

      {/* Content */}
      <div style={flex({ flexDirection: "column", alignItems: "stretch", flex: 1, width: 1000, gap: 40, paddingTop: 48, paddingBottom: 160 })}>

        {/* ── Mini podium ── */}
        <div style={flex({ flexDirection: "column" })}>
          <div style={flex({ alignItems: "flex-end", gap: 20 })}>
            {POD_CFG.map((pod) => {
              const dish = data.top3[pod.slotIdx];
              const label = dish?.name ?? "";
              return (
                <div key={pod.num} style={flex({ flexDirection: "column", alignItems: "center", flex: 1 })}>
                  {/* Label */}
                  <div style={flex({ flexDirection: "column", alignItems: "center", marginBottom: 16, paddingLeft: 8, paddingRight: 8 })}>
                    {pod.num === "1" ? (
                      <div style={flex({ background: "#FE392D", borderRadius: 999, paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 8 })}>
                        <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "white", textAlign: "center" }}>{label}</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "#888", textAlign: "center" }}>{label}</span>
                    )}
                  </div>
                  {/* Bar */}
                  <div style={flex({ width: "100%", height: pod.height, background: pod.bg, border: `5px solid ${pod.border}`, borderRadius: "20px 20px 0 0", alignItems: "center", justifyContent: "center" })}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 72, color: pod.numColor }}>{pod.num}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Base line */}
          <div style={flex({ height: 6, background: "#E5DFD5" })} />
        </div>

        {/* ── Category winners ── */}
        <div style={flex({ flexDirection: "column", background: "white", borderRadius: 32, border: "3px solid #F0E8D0", paddingLeft: 48, paddingRight: 48, paddingTop: 36, paddingBottom: 36, gap: 32 })}>
          {[
            { emojiUrl: EMOJI_MOST_LOVED, label: "MOST LOVED", dish: data.mostLoved?.name },
            { emojiUrl: EMOJI_NACHO,      label: "NACHO TYPE", dish: data.nachoType?.name },
            { emojiUrl: EMOJI_HOT_COLD,   label: "HOT & COLD", dish: data.hotCold?.name   },
          ].map(({ emojiUrl, label, dish }) =>
            dish ? (
              <div key={label} style={flex({ alignItems: "center", gap: 32 })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={emojiUrl} width={56} height={56} alt="" />
                <div style={flex({ flexDirection: "column", flex: 1 })}>
                  <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "#AAAAAA", letterSpacing: 3 }}>{label}</span>
                  <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "#1A1A1A" }}>{dish}</span>
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* ── Best taste bud ── */}
        <div style={flex({ alignItems: "center", gap: 32, background: noMatch ? "#F5F5F5" : "#FEF3F2", borderRadius: 32, paddingLeft: 48, paddingRight: 48, paddingTop: 36, paddingBottom: 36 })}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={noMatch ? EMOJI_NO_MATCH : EMOJI_BUDS} width={64} height={64} alt="" />
          <div style={flex({ flexDirection: "column", flex: 1 })}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "#AAAAAA", letterSpacing: 3 }}>BEST TASTE BUDS</span>
            {noMatch ? (
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "#AAAAAA", fontStyle: "italic" }}>better luck next time</span>
            ) : (
              <div style={flex({ alignItems: "baseline", gap: 20 })}>
                <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "#FE392D" }}>{data.bestBud!.displayName}</span>
                <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 34, color: "#AAAAAA" }}>{data.bestBud!.matchPercent}% match</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
