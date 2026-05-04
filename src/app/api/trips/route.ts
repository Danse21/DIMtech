import { NextRequest, NextResponse } from "next/server";
import { searchTrips } from "@/lib/resrobot";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const originId = searchParams.get("originId");
  const destId = searchParams.get("destId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!originId || !destId || !date || !time) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const data = await searchTrips(originId, destId, date, time);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Trip search failed" }, { status: 500 });
  }
}
