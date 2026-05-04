import type {
  LocationSearchResponse,
  NearbyStopsResponse,
  Stop,
  TripResponse,
} from "@/types/resrobot";

const BASE_URL = "https://api.resrobot.se/v2.1";

function getKey() {
  const key = process.env.RESROBOT_API_KEY;
  if (!key) throw new Error("RESROBOT_API_KEY is not set");
  return key;
}

export async function searchLocations(query: string): Promise<Stop[]> {
  const url = new URL(`${BASE_URL}/location.name`);
  url.searchParams.set("input", query);
  url.searchParams.set("accessId", getKey());
  url.searchParams.set("format", "json");
  url.searchParams.set("maxNo", "8");

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`ResRobot location search failed: ${res.status}`);

  const data: LocationSearchResponse = await res.json();
  return (data.stopLocationOrCoordLocation ?? [])
    .map((item) => item.StopLocation)
    .filter((s): s is Stop => !!s);
}

export async function getNearbyStops(lat: number, lon: number): Promise<Stop[]> {
  const url = new URL(`${BASE_URL}/location.nearbystops`);
  url.searchParams.set("originCoordLat", String(lat));
  url.searchParams.set("originCoordLong", String(lon));
  url.searchParams.set("accessId", getKey());
  url.searchParams.set("format", "json");
  url.searchParams.set("maxNo", "5");
  url.searchParams.set("r", "1000");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`ResRobot nearby stops failed: ${res.status}`);

  const data: NearbyStopsResponse = await res.json();
  return (data.stopLocationOrCoordLocation ?? [])
    .map((item) => item.StopLocation)
    .filter((s): s is Stop => !!s);
}

export async function searchTrips(
  originId: string,
  destId: string,
  date: string,
  time: string
): Promise<TripResponse> {
  const url = new URL(`${BASE_URL}/trip`);
  url.searchParams.set("originId", originId);
  url.searchParams.set("destId", destId);
  url.searchParams.set("date", date);
  url.searchParams.set("time", time);
  url.searchParams.set("accessId", getKey());
  url.searchParams.set("format", "json");
  url.searchParams.set("numTrips", "10");
  url.searchParams.set("passlist", "0");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`ResRobot trip search failed: ${res.status}`);

  return res.json();
}
