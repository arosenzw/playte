// Satori JSX template for the Group Rankings share card (1080×1920 — Instagram Stories)
// Satori rules: only display:flex/none supported; no display:block; avoid && (use ternary with null)

type Dish = { id: string; name: string; avgRank: number };
type Slot = { rank: number; dishes: Dish[] };

function groupIntoSlots(dishes: Dish[]): Slot[] {
  if (!dishes.length) return [];
  const slots: Slot[] = [];
  let rank = 1;
  let i = 0;
  while (i < dishes.length) {
    const avg = dishes[i].avgRank;
    const group: Dish[] = [];
    while (i + group.length < dishes.length && dishes[i + group.length].avgRank === avg)
      group.push(dishes[i + group.length]);
    slots.push({ rank, dishes: group });
    rank += 1;
    i += group.length;
  }
  return slots;
}

export type RankingsCardData = {
  restaurant: { name: string };
  rankedDishes: Dish[];
  date?: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const POD_W = 255;
const GAP   = 24;
const POD_CONFIG = [
  { slotIdx: 1, num: "2", height: 210, bg: "#DEDEDE", border: "#BDBDBD", numColor: "#888",    winner: false },
  { slotIdx: 0, num: "1", height: 310, bg: "#F5A623", border: "#C88A0A", numColor: "#1A1A1A", winner: true  },
  { slotIdx: 2, num: "3", height: 145, bg: "#EDCFAA", border: "#C8A070", numColor: "#AA7840", winner: false },
];

const flex = (extra?: React.CSSProperties): React.CSSProperties => ({ display: "flex", ...extra });

export function rankingsCard(data: RankingsCardData) {
  const slots = groupIntoSlots(data.rankedDishes);
  const podiumSlots = slots.slice(0, 3);
  const listSlots   = slots.slice(3);

  const date = data.date ?? new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div style={flex({ width: 1080, height: 1920, background: "#FFF8E8", flexDirection: "column", alignItems: "center", fontFamily: "Poppins", position: "relative" })}>

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/logo_long_red.png`} width={200} height={72} style={{ position: "absolute", top: 52, left: 52 }} alt="" />

      {/* Restaurant + date */}
      <div style={flex({ flexDirection: "column", alignItems: "center", marginTop: 120 })}>
        <div style={flex({ fontSize: 68, fontWeight: 700, color: "#FE392D", lineHeight: 1.1, textAlign: "center", maxWidth: 900 })}>
          {data.restaurant.name}
        </div>
        <div style={flex({ fontSize: 24, fontWeight: 700, color: "#BBBBBB", letterSpacing: 6, marginTop: 12 })}>
          {date}
        </div>
        <div style={flex({ width: 100, height: 8, background: "#FCCC75", borderRadius: 4, marginTop: 20 })} />
      </div>

      {/* "the results are in" */}
      <div style={flex({ fontSize: 42, fontWeight: 700, color: "#444", marginTop: 56 })}>
        the results are in
      </div>

      {/* Podium */}
      <div style={flex({ alignItems: "flex-end", gap: GAP, marginTop: 72, paddingLeft: 40, paddingRight: 40 })}>
        {POD_CONFIG.map((pod) => {
          const slot  = podiumSlots[pod.slotIdx];
          const label = slot ? slot.dishes.map((d) => d.name).join(" / ") : "";
          const isTie = (slot?.dishes.length ?? 0) > 1;

          return (
            <div key={pod.num} style={flex({ flexDirection: "column", alignItems: "center", width: POD_W })}>

              {/* Label + optional TIE badge */}
              <div style={flex({ flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 16 })}>
                {pod.winner ? (
                  <div style={flex({ background: "#FE392D", color: "white", fontSize: 24, fontWeight: 700, padding: "8px 20px", borderRadius: 999, textAlign: "center", maxWidth: POD_W + 40 })}>
                    {label}
                  </div>
                ) : (
                  <div style={flex({ fontSize: 24, fontWeight: 700, color: "#888", textAlign: "center", maxWidth: POD_W })}>
                    {label}
                  </div>
                )}
                {isTie ? (
                  <div style={flex({ alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 999, background: "#FE392D", color: "white", fontSize: 14, fontWeight: 700 })}>
                    TIE
                  </div>
                ) : null}
              </div>

              {/* Bar */}
              <div style={flex({ alignItems: "center", justifyContent: "center", width: POD_W, height: pod.height, background: pod.bg, border: `6px solid ${pod.border}`, borderRadius: "24px 24px 0 0" })}>
                <div style={flex({ fontSize: 80, fontWeight: 700, color: pod.numColor })}>
                  {pod.num}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Base line */}
      <div style={flex({ width: 1000, height: 4, background: "#E5DFD5" })} />

      {/* Ranked list */}
      <div style={flex({ flexDirection: "column", gap: 20, width: 1000, marginTop: 44 })}>
        {listSlots.slice(0, 7).map((slot) => (
          <div key={slot.rank} style={flex({ alignItems: "center", gap: 24 })}>
            <div style={flex({ fontSize: 34, fontWeight: 700, color: "#FE392D", width: 50, justifyContent: "flex-end" })}>
              {slot.rank}
            </div>
            <div style={flex({ flex: 1, background: "white", border: "2px solid #F0E8D0", borderRadius: 24, padding: "14px 28px" })}>
              <div style={flex({ fontSize: 30, fontWeight: 600, color: "#444" })}>
                {slot.dishes.map((d) => d.name).join(" / ")}
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
