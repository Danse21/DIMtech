export interface Stop {
  extId: string;
  name: string;
  lon: number;
  lat: number;
}

export interface LocationSearchResponse {
  stopLocationOrCoordLocation?: Array<{
    StopLocation?: Stop;
  }>;
}

export interface NearbyStopsResponse {
  stopLocationOrCoordLocation?: Array<{
    StopLocation?: Stop;
  }>;
}

export interface LegOriginDest {
  name: string;
  extId?: string;
  time: string;
  date: string;
  rtTime?: string;
  rtDate?: string;
  track?: string;
}

export interface Leg {
  idx: string;
  name: string;
  number?: string;
  category: string;
  type: string;
  bgColor?: string;
  fgColor?: string;
  Origin: LegOriginDest;
  Destination: LegOriginDest;
  Product?: Array<{
    name: string;
    num: string;
    catIn?: string;
    catOut?: string;
    catOutL?: string;
    operatorCode?: string;
    operator?: string;
    operatorUrl?: string;
  }>;
}

export interface Trip {
  duration?: string; // ISO 8601 e.g. "PT6H39M"
  chg?: string;
  price?: number;
  LegList: {
    Leg: Leg | Leg[];
  };
}

export interface TripResponse {
  Trip?: Trip[];
}
