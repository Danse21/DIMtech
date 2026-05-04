"use client";

import { useState } from "react";
import type { Trip, Leg } from "@/types/resrobot";
import { useI18n } from "@/context/i18n";
import { getLegLinks, type TripContext } from "@/lib/operators";
import { TripQRModal } from "./TripQRModal";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string; }> = {
  MET: { bg: "bg-blue-600", text: "text-white", label: "T" },
  BUS: { bg: "bg-green-600", text: "text-white", label: "Bus" },
  TRN: { bg: "bg-red-600", text: "text-white", label: "Train" },
  REG: { bg: "bg-orange-500", text: "text-white", label: "Regional" },
  UNK: { bg: "bg-gray-500", text: "text-white", label: "?" },
  WAK: { bg: "bg-gray-300", text: "text-gray-700", label: "Walk" },
};

function getCategory(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.UNK;
}

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

interface TripCardProps {
  trip: Trip;
  rank: number;
}

export function TripCard({ trip, rank }: TripCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const legs = normalizeLegs(trip);
  const transitLegs = legs.filter((l) => l.type !== "WALK");
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  const depTime = formatTime(firstLeg.Origin.time, firstLeg.Origin.rtTime);
  const arrTime = formatTime(lastLeg.Destination.time, lastLeg.Destination.rtTime);
  const numChanges = transitLegs.length - 1;


  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-gray-900">{depTime}</div>
              <div className="text-xs text-gray-500">{firstLeg.Origin.name.split(",")[0]}</div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div className="flex items-center gap-1 w-full justify-center flex-wrap">
                {transitLegs.map((leg, i) => {
                  const cat = getCategory(leg.category);
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${cat.bg} ${cat.text}`}
                    >
                      {leg.number ?? leg.name.split(" ").pop()}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-gray-400">{formatDuration(trip.duration)}</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-gray-900">{arrTime}</div>
              <div className="text-xs text-gray-500">{lastLeg.Destination.name.split(",")[0]}</div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-green-600">
              <span className="text-xs text-darker-green-400 italic">
                {t.approx}
              </span>{" "}
              {(trip as any).price} kr
            </div>

            <div className="text-sm text-gray-500">
              {numChanges === 0
                ? t.direct
                : `${numChanges} ${numChanges === 1 ? t.transfer : t.transfers}`}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 mt-1 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t.legs}</h3>
          <div className="space-y-2">
            {legs.map((leg, i) => {
              const isWalk = leg.type === "WALK";
              const cat = isWalk ? CATEGORY_COLORS.WAK : getCategory(leg.category);
              const operatorName = leg.Product?.[0]?.operator;
              const legCtx: TripContext = {
                originName: leg.Origin.name,
                destName: leg.Destination.name,
                originExtId: leg.Origin.extId,
                destExtId: leg.Destination.extId,
                date: leg.Origin.date,
                time: leg.Origin.time.substring(0, 5),
              };
              const legLink = !isWalk && operatorName
                ? getLegLinks(operatorName, legCtx)
                : null;

              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${cat.bg} ${cat.text}`}>
                      {isWalk ? "🚶" : (leg.number ?? "?")}
                    </span>
                    {i < legs.length - 1 && <div className="w-0.5 h-4 bg-gray-200" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        {isWalk ? t.walk : leg.name}
                        {!isWalk && leg.Destination.name && (
                          <span className="font-normal text-gray-500"> {t.towards} {leg.Destination.name.split(",")[0]}</span>
                        )}
                      </span>
                      <span className="text-gray-500 tabular-nums">
                        {formatTime(leg.Origin.time, leg.Origin.rtTime)} → {formatTime(leg.Destination.time, leg.Destination.rtTime)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {leg.Origin.name}
                      {leg.Origin.track && ` · ${t.platform} ${leg.Origin.track}`}
                    </div>
                    {legLink && (
                      <a
                        href={legLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {t.buyTicket} · {legLink.label}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowQR(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              {t.bookTrip}
            </button>
          </div>
        </div>
      )}

      {showQR && <TripQRModal trip={trip} onClose={() => setShowQR(false)} />}
    </div>
  );
}
