"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface TripLeg {
  line: string;
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
  departure: string;
  arrival: string;
  legs: TripLeg[];
}

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
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

  const ticketUrl = `http://172.20.10.9:3000/trip?data=${raw}`;

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

        {/* Summary card — matches main page TripCard header */}
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-gray-900">{trip.departure}</div>
              <div className="text-xs text-gray-500">{trip.from.split(",")[0]}</div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex gap-1 flex-wrap justify-center">
                {trip.legs.map((leg, i) => (
                  <span key={i} className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {leg.line.split(" ").pop()}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-400">{trip.date}</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-gray-900">{trip.arrival}</div>
              <div className="text-xs text-gray-500">{trip.to.split(",")[0]}</div>
            </div>
          </div>
        </div>

        {/* Legs detail card */}
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Journey details</p>
          {trip.legs.map((leg, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {leg.line.split(" ").pop()}
                </span>
                {i < trip.legs.length - 1 && <div className="w-0.5 h-6 bg-gray-200" />}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{leg.line}</span>
                  <span className="text-gray-500 tabular-nums text-xs">{leg.dep} → {leg.arr}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{leg.from.split(",")[0]}
                  {leg.platform && <span className="text-gray-400"> · Platform {leg.platform}</span>}
                </div>
                {leg.operator && (
                  <div className="text-xs text-gray-400 mt-0.5">{leg.operator}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">→ {leg.to.split(",")[0]} at {leg.arr}</div>
              </div>
            </div>
          ))}
        </div>

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
