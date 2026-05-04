"use client";

import {
  TRIP_CATEGORY_COLORS,
  TripDisplayCard,
  getTripCategoryStyle,
  type TripDisplayLeg,
  type TripLineBadge,
} from "@/components/TripDisplayCard";
import { useI18n } from "@/context/i18n";
import { getLegLinks, type TripContext } from "@/lib/operators";
import type { Leg, Trip } from "@/types/resrobot";
import { useRouter } from "next/navigation";
import { useState } from "react";

function normalizeLegs(trip: Trip): Leg[] {
  const legs = trip.LegList.Leg;
  return Array.isArray(legs) ? legs : [legs];
}

function formatTime(time: string, rtTime?: string) {
  const t = rtTime ?? time;
  return t.substring(0, 5);
}

function parseDurationMins(iso?: string): number {
  if (!iso) return 0;
  const h = iso.match(/(\d+)H/)?.[1] ?? "0";
  const m = iso.match(/(\d+)M/)?.[1] ?? "0";
  return parseInt(h) * 60 + parseInt(m);
}

function formatDuration(iso?: string) {
  const total = parseDurationMins(iso);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function encodeTripData(data: unknown) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const legs = normalizeLegs(trip);
  const transitLegs = legs.filter((l) => l.type !== "WALK");
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  const depTime = formatTime(firstLeg.Origin.time, firstLeg.Origin.rtTime);
  const arrTime = formatTime(
    lastLeg.Destination.time,
    lastLeg.Destination.rtTime,
  );
  const numChanges = Math.max(0, transitLegs.length - 1);
  const badges: TripLineBadge[] = transitLegs.map((leg) => {
    const cat = getTripCategoryStyle(leg.category);
    return {
      label: leg.number ?? leg.name.split(" ").pop() ?? "?",
      bg: cat.bg,
      text: cat.text,
    };
  });
  const displayLegs: TripDisplayLeg[] = legs.map((leg) => {
    const isWalk = leg.type === "WALK";
    const cat = isWalk
      ? TRIP_CATEGORY_COLORS.WAK
      : getTripCategoryStyle(leg.category);
    const operatorName = leg.Product?.[0]?.operator;
    const legCtx: TripContext = {
      originName: leg.Origin.name,
      destName: leg.Destination.name,
      originExtId: leg.Origin.extId,
      destExtId: leg.Destination.extId,
      date: leg.Origin.date,
      time: leg.Origin.time.substring(0, 5),
    };
    const legLink =
      !isWalk && operatorName ? getLegLinks(operatorName, legCtx) : null;

    return {
      badge: isWalk ? "" : (leg.number ?? "?"),
      badgeBg: cat.bg,
      badgeText: cat.text,
      name: isWalk ? t.walk : leg.name,
      direction:
        !isWalk && leg.Destination.name
          ? `${t.towards} ${leg.Destination.name.split(",")[0]}`
          : undefined,
      fromName: leg.Origin.name,
      toName: leg.Destination.name,
      dep: formatTime(leg.Origin.time, leg.Origin.rtTime),
      arr: formatTime(leg.Destination.time, leg.Destination.rtTime),
      platform: leg.Origin.track,
      platformLabel: t.platform,
      arrivalLabel: t.at,
      isWalk,
      buyLink: legLink ? { label: legLink.label, url: legLink.url } : undefined,
      buyLabel: t.buyTicket,
    };
  });

  const rightTop =
    typeof trip.price === "number" ? (
      <>
        <span className="text-xs text-green-500 italic">{t.approx}</span>{" "}
        {trip.price} kr
      </>
    ) : null;

  return (
    <TripDisplayCard
      depTime={depTime}
      arrTime={arrTime}
      fromName={firstLeg.Origin.name.split(",")[0]}
      toName={lastLeg.Destination.name.split(",")[0]}
      badges={badges}
      centerMeta={formatDuration(trip.duration)}
      rightTop={rightTop}
      rightBottom={
        numChanges === 0
          ? t.direct
          : `${numChanges} ${numChanges === 1 ? t.transfer : t.transfers}`
      }
      legs={displayLegs}
      legsTitle={t.legs}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
      footer={
        <button
          type="button"
          onClick={() => {
            const data = {
              from: firstLeg.Origin.name,
              to: lastLeg.Destination.name,
              date: firstLeg.Origin.date,
              duration: trip.duration,
              price: trip.price,
              departure: depTime,
              arrival: arrTime,
              legs: transitLegs.map((l) => ({
                line: l.name,
                category: l.category,
                type: l.type,
                number: l.number,
                from: l.Origin.name,
                to: l.Destination.name,
                dep: formatTime(l.Origin.time, l.Origin.rtTime),
                arr: formatTime(l.Destination.time, l.Destination.rtTime),
                platform: l.Origin.track,
                operator: l.Product?.[0]?.operator,
              })),
            };
            router.push(
              `/book?data=${encodeURIComponent(encodeTripData(data))}`,
            );
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          {t.bookTrip}
        </button>
      }
    />
  );
}
