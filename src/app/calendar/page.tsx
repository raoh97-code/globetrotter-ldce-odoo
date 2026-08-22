"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  ArrowRight,
  PlusCircle,
  X,
} from "lucide-react";

interface City {
  name: string;
  country: string;
}

interface TripStop {
  id: string;
  startDate: string;
  endDate: string;
  city: City;
}

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
}

const TRIP_COLOR_PALETTES = [
  { bg: "bg-indigo-600/30", border: "border-indigo-500/40", text: "text-indigo-300", badge: "bg-indigo-500" },
  { bg: "bg-emerald-600/30", border: "border-emerald-500/40", text: "text-emerald-300", badge: "bg-emerald-500" },
  { bg: "bg-amber-600/30", border: "border-amber-500/40", text: "text-amber-300", badge: "bg-amber-500" },
  { bg: "bg-purple-600/30", border: "border-purple-500/40", text: "text-purple-300", badge: "bg-purple-500" },
  { bg: "bg-cyan-600/30", border: "border-cyan-500/40", text: "text-cyan-300", badge: "bg-cyan-500" },
];

export default function GlobalCalendarPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [tripsRes, userRes] = await Promise.all([
        fetch("/api/trips"),
        fetch("/api/auth/me"),
      ]);

      if (tripsRes.ok) {
        const tData = await tripsRes.json();
        setTrips(tData.trips || []);
      }

      if (userRes.ok) {
        const uData = await userRes.json();
        setUser(uData.user);
      }
    } catch (err) {
      console.error("Error loading global calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading master calendar...</span>
        </div>
      </div>
    );
  }

  // Calendar Date Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  const isDateInRange = (targetDate: Date, startStr: string, endStr: string) => {
    const d = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    const s = new Date(new Date(startStr).getFullYear(), new Date(startStr).getMonth(), new Date(startStr).getDate()).getTime();
    const e = new Date(new Date(endStr).getFullYear(), new Date(endStr).getMonth(), new Date(endStr).getDate()).getTime();
    return d >= s && d <= e;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getTripsForDate = (targetDate: Date) => {
    return trips.map((t, idx) => ({ trip: t, palette: TRIP_COLOR_PALETTES[idx % TRIP_COLOR_PALETTES.length] }))
      .filter(({ trip }) => isDateInRange(targetDate, trip.startDate, trip.endDate));
  };

  const selectedDateTrips = selectedDate ? getTripsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 gradient-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                Master Travel Calendar
              </div>
              <h1 className="text-3xl font-extrabold text-white">All Trips Schedule</h1>
              <p className="text-sm text-slate-400 mt-1">
                Visual timeline overview across all your planned multi-city itineraries.
              </p>
            </div>

            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>

        {/* Master Calendar */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h2>
              <button
                onClick={todayMonth}
                className="px-3 py-1 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
              >
                Current Month
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const isToday = isSameDay(cell.date, new Date());
              const activeTrips = getTripsForDate(cell.date);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-[110px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    cell.isCurrentMonth ? "bg-slate-900/60" : "bg-slate-950/40 opacity-40"
                  } ${
                    isToday ? "border-indigo-500 shadow-md shadow-indigo-500/20" : "border-slate-800/80"
                  } hover:border-indigo-400 hover:bg-slate-900`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-lg px-2 py-0.5 ${
                        isToday
                          ? "bg-indigo-600 text-white font-mono"
                          : cell.isCurrentMonth
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>

                    {activeTrips.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1 mt-2">
                    {activeTrips.map(({ trip: t, palette }) => (
                      <div
                        key={t.id}
                        className={`p-1.5 rounded-xl ${palette.bg} border ${palette.border} ${palette.text} text-[10px] font-bold truncate`}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Date Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-semibold uppercase tracking-wider">
                  Selected Date
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDateTrips.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-3">
                <p className="text-sm">No trips scheduled for this date.</p>
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan a New Trip</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {selectedDateTrips.map(({ trip: t, palette }) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl ${palette.bg} border ${palette.border} flex items-center justify-between`}
                  >
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{t.name}</h4>
                      <p className="text-xs text-slate-300">
                        {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {t.stops.map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 font-medium"
                          >
                            {s.city.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/trips/${t.id}/calendar`}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      title="Open Trip Calendar"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
