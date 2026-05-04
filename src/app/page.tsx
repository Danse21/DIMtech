"use client";

import { useState } from "react";
import type { Stop } from "@/types/resrobot";
import type { TripResponse } from "@/types/resrobot";
import { StopInput } from "@/components/StopInput";
import { TripList } from "@/components/TripList";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/context/i18n";

function getNowDateTime() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "-");
  const time = now.toTimeString().slice(0, 5);
  return { date, time };
}

export default function Home() {

  function calculateAveragePrice(trips: any[]) {
    const prices = trips.map(() => Math.floor(Math.random() * 300) + 100);

    const sum = prices.reduce((a, b) => a + b, 0);
    return Math.round(sum / prices.length);
  }
  const { t } = useI18n();
  const [origin, setOrigin] = useState<Stop | null>(null);
  const [dest, setDest] = useState<Stop | null>(null);
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [trips, setTrips] = useState<TripResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUseLocation() {
    if (!navigator.geolocation) {
      setError(t.locationError);
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/nearby?lat=${coords.latitude}&lon=${coords.longitude}`);
          const stops: Stop[] = await res.json();
          if (stops.length > 0) {
            setOrigin(stops[0]);
          } else {
            setError(t.nearbyError);
          }
        } catch {
          setError(t.nearbyError);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError(t.locationError);
        setLocating(false);
      }
    );
  }

  function swapLocations() {
    const tmp = origin;
    setOrigin(dest);
    setDest(tmp);
    setTrips(null);
  }

  async function handleSearch() {
    if (!origin || !dest) {
      setError("välj en station från listan först.");
      return;
    }
    setSearching(true);
    setError(null);
    setTrips(null);

    const { date, time } = getNowDateTime();
    try {
      const res = await fetch(
        `/api/trips?originId=${origin.extId}&destId=${dest.extId}&date=${date}&time=${time}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data: TripResponse = await res.json();

      // 👇 kolla först att Trip finns
      if (data.Trip && Array.isArray(data.Trip)) {
        data.Trip = data.Trip.map((trip: any) => ({
          ...trip,
          price: Math.floor(Math.random() * 100) + 50
        }));
      }

      setTrips(data);

      if (!data.Trip?.length) setError(t.noTrips);

      if (!data.Trip?.length) setError(t.noTrips);
    } catch {
      setError(t.noTrips);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <header className="px-4 py-4 flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-semibold text-sm tracking-wide">DIMtech</span>
        </div>
        <LanguageToggle />
      </header>

      <main className="px-4 pb-8 max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-blue-200">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
          <div className="relative">
            <StopInput
              label={t.from}
              placeholder={t.fromPlaceholder}
              value={origin}
              onChange={setOrigin}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="4" strokeWidth={2} />
                </svg>
              }
            />
            <button
              onClick={handleUseLocation}
              disabled={locating}
              className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locating ? t.locating : t.useLocation}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <button
              onClick={swapLocations}
              title={t.swapLocations}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <StopInput
            label={t.to}
            placeholder={t.toPlaceholder}
            value={dest}
            onChange={setDest}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            }
          />

          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            {searching ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.searching}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t.search}
              </>
            )}
          </button>

          {error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}
        </div>

        {trips?.Trip && trips.Trip.length > 0 && (
          <div className="mt-6">

            <TripList trips={trips.Trip} />
          </div>
        )}
      </main>
      <footer className="mt-12 py-6 text-center text-sm text-blue-200">
        <div className="max-w-2xl mx-auto space-y-2">
          <p>© 2026 DIMtech</p>
          <p>Built for Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
