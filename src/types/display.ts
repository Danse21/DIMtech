export interface LineBadge {
  label: string;
  bg: string;   // tailwind bg class
  text: string; // tailwind text class
}

export interface DisplayLeg {
  badge: string;
  badgeBg: string;
  badgeText: string;
  name: string;
  fromName: string;
  toName: string;
  dep: string;
  arr: string;
  platform?: string;
  operator?: string;
  buyLink?: { url: string; label: string };
  isWalk?: boolean;
}
