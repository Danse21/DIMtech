"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/context/i18n";

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

function TripTicket() {
  const params = useSearchParams();
  const { t } = useI18n();
  const raw = params.get("data");

  if (!raw) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">{t.invalidTicketLink}</p>
      </div>
    );
  }

  let trip: TripData;
  try {
    trip = JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-red-500">{t.couldNotReadTicketData}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 pb-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">{t.validTicket}</p>
            <p className="text-green-100 text-sm">{t.validTicketSubtitle}</p>
          </div>
        </div>

        <div className="bg-blue-600 px-6 py-5 text-white">
          <p className="text-blue-200 text-xs uppercase tracking-wide mb-1">{trip.date}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xl">{trip.from.split(",")[0]}</p>
              <p className="text-blue-200 text-sm">{trip.departure}</p>
            </div>
            <svg className="w-6 h-6 text-blue-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="text-right">
              <p className="font-bold text-xl">{trip.to.split(",")[0]}</p>
              <p className="text-blue-200 text-sm">{trip.arrival}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center px-4">
          <div className="w-5 h-5 rounded-full bg-blue-700 -ml-7 shrink-0" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2" />
          <div className="w-5 h-5 rounded-full bg-blue-700 -mr-7 shrink-0" />
        </div>

        <div className="px-6 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.legs}</p>
          {trip.legs.map((leg, i) => (
            <div key={i} className="flex gap-3 items-start text-sm">
              <span className="shrink-0 bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs mt-0.5">
                {leg.line.split(" ").pop()}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-gray-900">{leg.from.split(",")[0]}</span>
                <span className="text-gray-400 mx-1">→</span>
                <span className="text-gray-600">{leg.to.split(",")[0]}</span>
                <div className="text-xs text-gray-400 mt-0.5">
                  {leg.dep}
                  {leg.platform && ` · ${t.platform} ${leg.platform}`}
                  {leg.operator && ` · ${leg.operator}`}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5">
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-gray-400">
              {t.ticketHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense>
      <TripTicket />
    </Suspense>
  );
}
