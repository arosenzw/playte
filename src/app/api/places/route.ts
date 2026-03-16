import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Places API not configured" }, { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("type", "restaurant");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  const data = await res.json();

const results = (data.results ?? []).slice(0, 5).map((place: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry?: { location?: { lat: number; lng: number } };
    types?: string[];
  }) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    lat: place.geometry?.location?.lat ?? null,
    lng: place.geometry?.location?.lng ?? null,
    cuisineType: place.types?.find((t: string) =>
      !["restaurant", "food", "point_of_interest", "establishment"].includes(t)
    ) ?? null,
  }));

  return NextResponse.json({ results });
}
