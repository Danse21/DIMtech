export interface OperatorLink {
  label: string;
  url: string;
}

export interface TripContext {
  originName: string;
  destName: string;
  originExtId?: string;
  destExtId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

type UrlBuilder = (ctx: TripContext) => string;

const FLIXBUS_CITIES: Record<string, string> = {
  stockholm: "40dfdbe7-8646-11e6-9066-549f350fcb0c",
  göteborg: "40e13cde-8646-11e6-9066-549f350fcb0c",
  gothenburg: "40e13cde-8646-11e6-9066-549f350fcb0c",
  malmö: "40dda2b5-8646-11e6-9066-549f350fcb0c",
  malmo: "40dda2b5-8646-11e6-9066-549f350fcb0c",
  jönköping: "40e14aeb-8646-11e6-9066-549f350fcb0c",
  linköping: "40e15439-8646-11e6-9066-549f350fcb0c",
  helsingborg: "40e147d6-8646-11e6-9066-549f350fcb0c",
  norrköping: "40e15c34-8646-11e6-9066-549f350fcb0c",
  örebro: "40e15d10-8646-11e6-9066-549f350fcb0c",
  karlstad: "40e14df1-8646-11e6-9066-549f350fcb0c",
  borås: "40e14119-8646-11e6-9066-549f350fcb0c",
  lund: "40e15aa9-8646-11e6-9066-549f350fcb0c",
  halmstad: "40e146c1-8646-11e6-9066-549f350fcb0c",
  kalmar: "40e162ea-8646-11e6-9066-549f350fcb0c",
  västerås: "40e16007-8646-11e6-9066-549f350fcb0c",
  uppsala: "40e15f4d-8646-11e6-9066-549f350fcb0c",
  växjö: "40e160bf-8646-11e6-9066-549f350fcb0c",
  umeå: "17b17a4c-4ff2-4e20-8e93-8166ba52bee3",
  gävle: "63ba862f-ddef-40d8-9c3c-33138d4b5ce9",
  sundsvall: "6d712460-497b-41bb-806f-855d11bcf8f3",
  södertälje: "40e15dd2-8646-11e6-9066-549f350fcb0c",
  uddevalla: "40e1695a-8646-11e6-9066-549f350fcb0c",
  "arlanda": "a7b1fa68-4337-40e7-b5b9-0cc8ba0deb05",
  "landvetter": "5c46d73a-6b63-48b3-9b87-589e50c2e87f",
};

function flixbusCity(name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [key, id] of Object.entries(FLIXBUS_CITIES)) {
    if (lower.includes(key)) return id;
  }
  return undefined;
}

interface OperatorDef {
  label: string;
  buildUrl: UrlBuilder;
}

function stopName(name: string) {
  return name.split(",")[0].trim();
}

const OPERATOR_DEFS: Record<string, OperatorDef> = {
  SJ: {
    label: "SJ",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.sj.se/sv/boka-resa/valj-resa.html#/resor/${from}/${to}/${date}/${time}/false/false/false/false`;
    },
  },
  "VR Snabbtåg": {
    label: "VR Snabbtåg",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.vr.fi/sv/biljetter?from=${from}&to=${to}&date=${date}&time=${time}`;
    },
  },
  Flixbus: {
    label: "Flixbus",
    buildUrl: ({ originName, destName, date }) => {
      const [y, m, d] = date.split("-");
      const flixDate = `${d}.${m}.${y}`;
      const fromId = flixbusCity(originName);
      const toId = flixbusCity(destName);
      const fromName = stopName(originName);
      const toName = stopName(destName);
      if (fromId && toId) {
        const params = new URLSearchParams({
          departureCity: fromId,
          arrivalCity: toId,
          route: `${fromName}-${toName}`,
          rideDate: flixDate,
          adult: "1",
          _locale: "sv",
          departureCountryCode: "SE",
          arrivalCountryCode: "SE",
        });
        return `https://shop.flixbus.se/search?${params.toString()}`;
      }
      return `https://shop.flixbus.se/search?route=${encodeURIComponent(`${fromName}-${toName}`)}&rideDate=${flixDate}&adult=1&_locale=sv`;
    },
  },
  Västtrafik: {
    label: "Västtrafik",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.vasttrafik.se/reseplanering/reseplaneraren/?from=${from}&to=${to}&date=${date}&time=${time}`;
    },
  },
  "Storstockholms Lokaltrafik": {
    label: "SL",
    buildUrl: ({ originName, destName }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://sl.se/reseplaneraren?from=${from}&to=${to}`;
    },
  },
  SL: {
    label: "SL",
    buildUrl: ({ originName, destName }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://sl.se/reseplaneraren?from=${from}&to=${to}`;
    },
  },
  Skånetrafiken: {
    label: "Skånetrafiken",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.skanetrafiken.se/planera-resa/?from=${from}&to=${to}&date=${date}&time=${time}`;
    },
  },
  "MTR Express": {
    label: "MTR Express",
    buildUrl: ({ originName, destName }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.mtrexpress.se/biljetter?from=${from}&to=${to}`;
    },
  },
  Vy: {
    label: "Vy",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.vy.se/biljetter/sok?from=${from}&to=${to}&date=${date}&time=${time}`;
    },
  },
  "Vy Bus4You": {
    label: "Vy Bus4You",
    buildUrl: ({ originName, destName, date, time }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.vy.se/biljetter/sok?from=${from}&to=${to}&date=${date}&time=${time}`;
    },
  },
  UL: {
    label: "UL",
    buildUrl: ({ originName, destName }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.ul.se/reseplanering/?from=${from}&to=${to}`;
    },
  },
  "Uppsala Lokaltrafik": {
    label: "UL",
    buildUrl: ({ originName, destName }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.ul.se/reseplanering/?from=${from}&to=${to}`;
    },
  },
  Dalatrafik: {
    label: "Dalatrafik",
    buildUrl: () => "https://www.dalatrafik.se/resa/",
  },
  Blekingetrafiken: {
    label: "Blekingetrafiken",
    buildUrl: () => "https://blekingetrafiken.se/",
  },
  "X-trafik": {
    label: "X-trafik",
    buildUrl: () => "https://www.x-trafik.se/",
  },
  Krösatågen: {
    label: "Krösatågen",
    buildUrl: () => "https://www.krosatagen.se/",
  },
  Hallandstrafiken: {
    label: "Hallandstrafiken",
    buildUrl: () => "https://www.hallandstrafiken.se/res-med-oss/sok-resa/reseplaneraren",
  },
  "Länstrafiken Norrbotten": {
    label: "Länstrafiken Norrbotten",
    buildUrl: () => "https://www.ltnbd.se/",
  },
  Öresundståg: {
    label: "Öresundståg",
    buildUrl: ({ originName, destName, originExtId, destExtId, date, time }) => {
      const searchData = {
        ticketType: "tickets",
        travelMode: "one-way",
        from: {
          id: `urn:x_swe:stn:${originExtId ?? ""}`,
          name: stopName(originName),
          countryCodeUIC: 74,
        },
        to: {
          id: `urn:x_swe:stn:${destExtId ?? ""}`,
          name: stopName(destName),
          countryCodeUIC: 74,
        },
        dateModel: date,
        outboundTime: time,
        inboundTime: "",
        promoCodes: [],
        corporateCodes: [],
        interrail: false,
        passengerDetails: {
          ADULT: [{}],
          CHILD_YOUTH: [],
          STUDENT: [],
          RETIRED: [],
          SENIOR: [],
        },
      };
      return `https://boka.oresundstag.se/sv-SE/buy/journey?searchData=${encodeURIComponent(JSON.stringify(searchData))}`;
    },
  },
  Snälltåget: {
    label: "Snälltåget",
    buildUrl: ({ originName, destName, date }) => {
      const from = encodeURIComponent(stopName(originName));
      const to = encodeURIComponent(stopName(destName));
      return `https://www.snalltaget.se/boka?from=${from}&to=${to}&date=${date}`;
    },
  },
  Mälartåg: {
    label: "Mälartåg",
    buildUrl: () => "https://www.malartag.se/",
  },
  "Länstrafiken Västerbotten": {
    label: "Länstrafiken Västerbotten",
    buildUrl: () => "https://www.tabussen.nu/",
  },
};

function findDef(operatorName: string): OperatorDef | null {
  for (const [key, def] of Object.entries(OPERATOR_DEFS)) {
    if (operatorName.toLowerCase().includes(key.toLowerCase())) return def;
  }
  return null;
}

export interface LegLink {
  label: string;
  url: string;
  legOrigin: string;
  legDest: string;
}

export function getLegLinks(
  operatorName: string,
  ctx: TripContext
): LegLink | null {
  const def = findDef(operatorName);
  if (!def) return null;
  return {
    label: def.label,
    url: def.buildUrl(ctx),
    legOrigin: ctx.originName,
    legDest: ctx.destName,
  };
}
