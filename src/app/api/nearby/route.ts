import { NextRequest, NextResponse } from "next/server";
import { getNearbyStops } from "@/lib/resrobot";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") ?? "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const stops = await getNearbyStops(lat, lon);
    return NextResponse.json(stops);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Nearby stops lookup failed" }, { status: 500 });
  }
}
