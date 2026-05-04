"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  TripDisplayCard,
  getTripCategoryStyle,
  type TripDisplayLeg,
  type TripLineBadge,
} from "@/components/TripDisplayCard";
import { useI18n } from "@/context/i18n";

interface TripLeg {
  line: string;
  category?: string;
  type?: string;
  number?: string;
  from: string;
  to: string;
  dep: string;
  arr: string;
  platform?: string;
  operator?: string;
}

interface TripData {
  from: string;
  to: string;
  date: string;
  duration?: string;
  price?: number;
  departure: string;
  arrival: string;
  legs: TripLeg[];
}

function formatDuration(iso?: string) {
  if (!iso) return undefined;
  const h = iso.match(/(\d+)H/)?.[1] ?? "0";
  const m = iso.match(/(\d+)M/)?.[1] ?? "0";
  const hours = parseInt(h);
  const mins = parseInt(m);
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();
  const raw = params.get("data");
  const [confirmed, setConfirmed] = useState(false);

  if (!raw) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">Invalid booking link.</p>
      </div>
    );
  }

  let trip: TripData;
  try {
    trip = JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-red-500">Could not read trip data.</p>
      </div>
    );
  }

  const ticketUrl = `/trip?data=${encodeURIComponent(raw)}`;
  const badges: TripLineBadge[] = trip.legs.map((leg) => {
    const cat = getTripCategoryStyle(leg.category ?? "MET");
    return {
      label: leg.number ?? leg.line.split(" ").pop() ?? "?",
      bg: cat.bg,
      text: cat.text,
    };
  });
  const displayLegs: TripDisplayLeg[] = trip.legs.map((leg) => {
    const cat = getTripCategoryStyle(leg.category ?? "MET");
    return {
      badge: leg.number ?? leg.line.split(" ").pop() ?? "?",
      badgeBg: cat.bg,
      badgeText: cat.text,
      name: leg.line,
      direction: `${t.towards} ${leg.to.split(",")[0]}`,
      fromName: leg.from,
      toName: leg.to,
      dep: leg.dep,
      arr: leg.arr,
      platform: leg.platform,
      platformLabel: t.platform,
      operator: leg.operator,
    };
  });

  if (confirmed) {
    return (
      <div className="flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Booking Confirmed</p>
              <p className="text-green-100 text-sm">Bokning bekräftad</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Scan to view your ticket</p>
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-inner border border-gray-100">
                  <QRCodeSVG value={ticketUrl} size={200} level="M" includeMargin={false} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">From</span>
                <span className="font-medium text-gray-900">{trip.from.split(",")[0]}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">To</span>
                <span className="font-medium text-gray-900">{trip.to.split(",")[0]}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{trip.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900">{trip.departure} → {trip.arrival}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back to search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center pb-8">
      <div className="w-full max-w-2xl space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-200 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <TripDisplayCard
          depTime={trip.departure}
          arrTime={trip.arrival}
          fromName={trip.from.split(",")[0]}
          toName={trip.to.split(",")[0]}
          badges={badges}
          centerMeta={formatDuration(trip.duration) ?? trip.date}
          rightTop={
            typeof trip.price === "number" ? (
              <>
                <span className="text-xs text-green-500 italic">{t.approx}</span> {trip.price} kr
              </>
            ) : null
          }
          legs={displayLegs}
          legsTitle={t.legs}
          expanded
        />

        {/* Confirm button */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookingContent />
    </Suspense>
  );
}
