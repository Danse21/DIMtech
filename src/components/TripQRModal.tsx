"use client";

import { useI18n } from "@/context/i18n";
import type { Leg, Trip } from "@/types/resrobot";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

function normalizeLegs(trip: Trip): Leg[] {
  const legs = trip.LegList.Leg;
  return Array.isArray(legs) ? legs : [legs];
}

function formatTime(time: string, rtTime?: string) {
  return (rtTime ?? time).substring(0, 5);
}

interface TripQRModalProps {
  trip: Trip;
  onClose: () => void;
}

export function TripQRModal({ trip, onClose }: TripQRModalProps) {
  const { t } = useI18n();
  const legs = normalizeLegs(trip);
  const transitLegs = legs.filter((l) => l.type !== "WALK");
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  const tripSummary = {
    from: firstLeg.Origin.name,
    to: lastLeg.Destination.name,
    date: firstLeg.Origin.date,
    departure: formatTime(firstLeg.Origin.time, firstLeg.Origin.rtTime),
    arrival: formatTime(lastLeg.Destination.time, lastLeg.Destination.rtTime),
    legs: transitLegs.map((l) => ({
      line: l.name,
      from: l.Origin.name,
      to: l.Destination.name,
      dep: formatTime(l.Origin.time, l.Origin.rtTime),
      arr: formatTime(l.Destination.time, l.Destination.rtTime),
      platform: l.Origin.track,
      operator: l.Product?.[0]?.operator,
    })),
  };

  const base64 = btoa(
    unescape(encodeURIComponent(JSON.stringify(tripSummary))),
  );
  const host =
    window.location.hostname === "localhost"
      ? "http://172.20.10.9:3000"
      : window.location.origin;
  const qrData = `${host}/trip?data=${base64}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide mb-1">
                {tripSummary.date}
              </p>
              <h2 className="font-bold text-lg leading-tight">
                {firstLeg.Origin.name.split(",")[0]}
                <span className="mx-2 opacity-60">→</span>
                {lastLeg.Destination.name.split(",")[0]}
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">
                {tripSummary.departure} → {tripSummary.arrival}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 -mt-1 -mr-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-2xl shadow-inner border border-gray-100">
              <QRCodeSVG value={qrData} size={200} level="M" />
            </div>
          </div>

          <div className="space-y-2">
            {transitLegs.map((leg, i) => (
              <div key={i} className="flex gap-3 items-start text-sm">
                <span className="shrink-0 bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs mt-0.5">
                  {leg.number ?? leg.name.split(" ").pop()}
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-gray-900">
                    {leg.Origin.name.split(",")[0]}
                  </span>
                  <span className="text-gray-400 mx-1">→</span>
                  <span className="text-gray-600">
                    {leg.Destination.name.split(",")[0]}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {formatTime(leg.Origin.time, leg.Origin.rtTime)}
                    {leg.Origin.track && ` · ${t.platform} ${leg.Origin.track}`}
                    {leg.Product?.[0]?.operator &&
                      ` · ${leg.Product[0].operator}`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400">{t.qrHint}</p>
        </div>
      </div>
    </div>
  );
}
