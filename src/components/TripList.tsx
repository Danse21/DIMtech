"use client";

import { useState, useMemo } from "react";
import type { Trip } from "@/types/resrobot";
import { TripCard } from "./TripCard";
import { useI18n } from "@/context/i18n";

type SortKey = "departure" | "duration" | "transfers";

interface TripListProps {
  trips: Trip[];
}

function getDepMinutes(trip: Trip): number {
  const legs = Array.isArray(trip.LegList.Leg) ? trip.LegList.Leg : [trip.LegList.Leg];
  const first = legs[0];
  const t = first.Origin.rtTime ?? first.Origin.time;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getTransfers(trip: Trip): number {
  const legs = Array.isArray(trip.LegList.Leg) ? trip.LegList.Leg : [trip.LegList.Leg];
  return Math.max(0, legs.filter((l) => l.type !== "WALK").length - 1);
}

export function TripList({ trips }: TripListProps) {
  const { t } = useI18n();
  const [sort, setSort] = useState<SortKey>("departure");

  const sorted = useMemo(() => {
    return [...trips].sort((a, b) => {
      if (sort === "departure") return getDepMinutes(a) - getDepMinutes(b);
      if (sort === "duration") return parseInt(a.dur) - parseInt(b.dur);
      return getTransfers(a) - getTransfers(b);
    });
  }, [trips, sort]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "departure", label: t.sortDeparture },
    { key: "duration", label: t.sortDuration },
    { key: "transfers", label: t.sortTransfers },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{t.sortBy}:</span>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === opt.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((trip, i) => (
          <TripCard key={i} trip={trip} rank={i} />
        ))}
      </div>
    </div>
  );
}
