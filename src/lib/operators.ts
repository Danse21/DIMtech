export interface OperatorLink {
  label: string;
  webUrl: string;
  deepLink?: string;
}

const OPERATOR_MAP: Record<string, OperatorLink> = {
  SL: {
    label: "SL",
    webUrl: "https://sl.se/reseplaneraren",
    deepLink: "sl://",
  },
  "Storstockholms Lokaltrafik": {
    label: "SL",
    webUrl: "https://sl.se/reseplaneraren",
    deepLink: "sl://",
  },
  Västtrafik: {
    label: "Västtrafik",
    webUrl: "https://www.vasttrafik.se/reseplanering/reseplaneraren/",
    deepLink: "vasttrafik://",
  },
  Skånetrafiken: {
    label: "Skånetrafiken",
    webUrl: "https://www.skanetrafiken.se/planera-resa/",
  },
  SJ: {
    label: "SJ",
    webUrl: "https://www.sj.se/",
    deepLink: "sj://",
  },
  "MTR Express": {
    label: "MTR Express",
    webUrl: "https://www.mtrexpress.se/",
  },
  "Länstrafiken Norrbotten": {
    label: "Länstrafiken Norrbotten",
    webUrl: "https://www.ltnbd.se/",
  },
  UL: {
    label: "UL",
    webUrl: "https://www.ul.se/reseplanering/",
  },
  "Uppsala Lokaltrafik": {
    label: "UL",
    webUrl: "https://www.ul.se/reseplanering/",
  },
  Dalatrafik: {
    label: "Dalatrafik",
    webUrl: "https://www.dalatrafik.se/resa/",
  },
  Blekingetrafiken: {
    label: "Blekingetrafiken",
    webUrl: "https://blekingetrafiken.se/",
  },
  "X-trafik": {
    label: "X-trafik",
    webUrl: "https://www.x-trafik.se/",
  },
  Krösatågen: {
    label: "Krösatågen",
    webUrl: "https://www.krosatagen.se/",
  },
  Hallandstrafiken: {
    label: "Hallandstrafiken",
    webUrl: "https://www.hallandstrafiken.se/",
  },
};

export function getOperatorLink(operatorName?: string): OperatorLink | null {
  if (!operatorName) return null;
  for (const [key, link] of Object.entries(OPERATOR_MAP)) {
    if (operatorName.toLowerCase().includes(key.toLowerCase())) return link;
  }
  return null;
}

export function getAllOperatorLinks(operatorNames: string[]): OperatorLink[] {
  const seen = new Set<string>();
  const links: OperatorLink[] = [];
  for (const name of operatorNames) {
    const link = getOperatorLink(name);
    if (link && !seen.has(link.label)) {
      seen.add(link.label);
      links.push(link);
    }
  }
  return links;
}
