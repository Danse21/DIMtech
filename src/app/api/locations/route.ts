import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/resrobot";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const stops = await searchLocations(q);
    return NextResponse.json(stops);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Location search failed" }, { status: 500 });
  }
}
