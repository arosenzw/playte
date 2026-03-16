# playte — Open Questions: Resolved
_PRD v3.0 · Resolved 2026-03-13_

---

## Q1 — Join Code Format
**Decision:** 6-character alphanumeric, uppercase, vowels removed (e.g. `B4K9RT`).

- Removes accidental real words
- ~26M possible codes vs ~1M for 6-digit numeric
- Easy to read aloud at a table
- Stored as VARCHAR(10) — format change requires no migration

---

## Q2 — Restaurant Search API
**Decision:** Google Places API.

- Best global coverage and accuracy
- Cost manageable at MVP scale (autocomplete + place details = a few cents per session)
- Yelp and Foursquare have weaker international coverage and more restrictive terms around storing data (which playte requires for canonical restaurant records)

---

## Q3 — Share Image Card
**Decision:** Server-rendered static image via Vercel OG (`@vercel/og` / Satori).

- Instagram Stories is a primary share target — requires an image
- Vercel OG generates styled PNGs from a React-like template; no Puppeteer or headless browser
- Each Flavor Journey page gets its own OG image URL (e.g. `/api/og/insights?session=ABC123`)
- Works for Web Share API on iOS/Android (Instagram Stories) and doubles as OG meta image for link previews (iMessage, Twitter, etc.)
- Client-side canvas rejected: brittle on mobile Safari
- Animated/image card v2 upgrade remains on the future considerations list

---

## Q4 — Player Drops Mid-Ranking
**Decision:** Two-mechanism drop system.

1. **Automatic:** 10-minute timeout — a non-submitted player is dropped server-side after 10 minutes of inactivity
2. **Manual:** Host can force-drop a non-submitted player at any time once ranking has started

**Recovery:** Draft rankings are preserved via upsert during the ranking phase. If a player rejoins before being dropped, they can resume from their last saved draft.

Once dropped, rankings are discarded and cannot be recovered — the session will have advanced to results so rejoining is not possible.

---

## Q5 — Host Kick (Lobby)
**Decision:** Yes — host can remove a player from the lobby before ranking starts.

- Soft-delete on the `session_players` row while `session.status = lobby`
- Handles accidental joins (wrong session, code collision, accidental share)
- Low engineering cost
