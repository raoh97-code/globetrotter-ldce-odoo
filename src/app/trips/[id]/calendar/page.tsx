"use client";

import { useEffect, useState, use } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  X,
  Plus,
  Compass,
  BarChart3,
  ListTodo,
  AlertTriangle,
} from "lucide-react";

interface TripActivity {
  id: string;
  dayNumber: number;
  timeSlot: string;
  costOverride?: number | null;
  activity: {
    id: string;
    name: string;
    category: string;
    cost: number;
    durationMinutes: number;
    description?: string;
  };
}

interface TripStop {
  id: string;
  orderIndex: number;
  startDate: string;
  endDate: string;
  sectionBudget?: number | null;
  city: {
    id: string;
    name: string;
    country: string;
    costIndex: number;
  };
  tripActivities: TripActivity[];
}

interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
}

const CITY_ACCENT_COLORS = [
  { bg: "bg-indigo-600/30", text: "text-indigo-300", border: "border-indigo-500/40", hex: "#6366f1" },
  { bg: "bg-emerald-600/30", text: "text-emerald-300", border: "border-emerald-500/40", hex: "#10b981" },
  { bg: "bg-amber-600/30", text: "text-amber-300", border: "border-amber-500/40", hex: "#f59e0b" },
  { bg: "bg-purple-600/30", text: "text-purple-300", border: "border-purple-500/40", hex: "#8b5cf6" },
  { bg: "bg-cyan-600/30", text: "text-cyan-300", border: "border-cyan-500/40", hex: "#06b6d4" },
  { bg: "bg-rose-600/30", text: "text-rose-300", border: "border-rose-500/40", hex: "#f43f5e" },
];

export default function TripCalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data.trip);
        if (data.trip?.startDate) {
          setCurrentDate(new Date(data.trip.startDate));
        }
      }
    } catch (err) {
      console.error("Error loading trip calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading trip calendar view...</span>
        </div>
      </div>
    );
  }

  // Calendar Date Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create grid cells (including trailing days from prev month)
  const prevMonthDays = new Date(year, month, 0).getDate();
  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  // Prev month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill 35 or 42 grid cells
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

  // Helper to check if a date falls in a range (inclusive)
  const isDateInRange = (dateStr: Date, startStr: string, endStr: string) => {
    const d = new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate()).getTime();
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

  // Find stop and activities for selected modal date
  const getDayDetails = (targetDate: Date) => {
    if (!trip) return { activeStop: null, activities: [], dayTotalCost: 0, dayNumberInStop: 1 };

    let activeStop: TripStop | null = null;
    let stopIndex = -1;

    for (let i = 0; i < trip.stops.length; i++) {
      if (isDateInRange(targetDate, trip.stops[i].startDate, trip.stops[i].endDate)) {
        activeStop = trip.stops[i];
        stopIndex = i;
        break;
      }
    }

    if (!activeStop) return { activeStop: null, activities: [], dayTotalCost: 0, dayNumberInStop: 1 };

    // Calculate day offset inside stop
    const sTime = new Date(activeStop.startDate).getTime();
    const tTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    const diffDays = Math.floor((tTime - sTime) / (1000 * 60 * 60 * 24)) + 1;
    const dayNumberInStop = Math.max(1, diffDays);

    const activities = activeStop.tripActivities.filter((ta) => ta.dayNumber === dayNumberInStop);
    const dayTotalCost = activities.reduce((sum, item) => {
      return (
        sum +
        (item.costOverride !== null ? Number(item.costOverride) : Number(item.activity.cost))
      );
    }, 0);

    return { activeStop, activities, dayTotalCost, dayNumberInStop, stopIndex };
  };

  const selectedDayDetails = selectedDate ? getDayDetails(selectedDate) : null;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/trips/${tripId}/build`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Section Builder</span>
        </Link>

        {/* Header & Sub-Navigation */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                Interactive Trip Calendar
              </div>
              <h1 className="text-3xl font-extrabold text-white">{trip?.name}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {trip && new Date(trip.startDate).toLocaleDateString()} —{" "}
                {trip && new Date(trip.endDate).toLocaleDateString()} ({trip?.stops.length} Cities)
              </p>
            </div>

            {/* Sub-Navigation Buttons */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <Link
                href={`/trips/${tripId}/build`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <ListTodo className="w-4 h-4" />
                <span>Builder</span>
              </Link>

              <Link
                href={`/trips/${tripId}/itinerary`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Itinerary & Budget</span>
              </Link>

              <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 shadow-md shadow-indigo-600/30">
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar View</span>
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800">
          {/* Controls Bar */}
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

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">City Stops Legend:</span>
            {trip?.stops.map((stop, idx) => {
              const style = CITY_ACCENT_COLORS[idx % CITY_ACCENT_COLORS.length];
              return (
                <div key={stop.id} className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <span className={`w-3 h-3 rounded-full ${style.bg} border ${style.border}`} />
                  <span>{stop.city.name} ({new Date(stop.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} - {new Date(stop.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})})</span>
                </div>
              );
            })}
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

          {/* 7-Column Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const isToday = isSameDay(cell.date, new Date());
              const isTripActive = trip && isDateInRange(cell.date, trip.startDate, trip.endDate);

              // Find active city stop for this day cell
              let matchingStop: TripStop | null = null;
              let matchingStopIndex = -1;
              if (trip) {
                for (let s = 0; s < trip.stops.length; s++) {
                  if (isDateInRange(cell.date, trip.stops[s].startDate, trip.stops[s].endDate)) {
                    matchingStop = trip.stops[s];
                    matchingStopIndex = s;
                    break;
                  }
                }
              }

              const stopColor = matchingStopIndex >= 0 ? CITY_ACCENT_COLORS[matchingStopIndex % CITY_ACCENT_COLORS.length] : null;

              // Find activities count for this day
              let activityCount = 0;
              if (matchingStop) {
                const sTime = new Date(matchingStop.startDate).getTime();
                const cellTime = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate()).getTime();
                const dayNumInStop = Math.max(1, Math.floor((cellTime - sTime) / (1000 * 60 * 60 * 24)) + 1);
                activityCount = matchingStop.tripActivities.filter((ta) => ta.dayNumber === dayNumInStop).length;
              }

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-[100px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    cell.isCurrentMonth ? "bg-slate-900/60" : "bg-slate-950/40 opacity-40"
                  } ${
                    isToday ? "border-indigo-500 shadow-md shadow-indigo-500/20" : "border-slate-800/80"
                  } ${
                    isTripActive ? "hover:border-indigo-400 hover:bg-slate-900" : "hover:border-slate-700"
                  }`}
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

                    {activityCount > 0 && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {activityCount} {activityCount === 1 ? "act" : "acts"}
                      </span>
                    )}
                  </div>

                  {/* City Stop Tag */}
                  {matchingStop && stopColor && (
                    <div className={`mt-2 p-1.5 rounded-xl ${stopColor.bg} border ${stopColor.border} ${stopColor.text} text-[11px] font-bold truncate flex items-center gap-1`}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{matchingStop.city.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Interactive Day Inspection Modal */}
      {selectedDate && selectedDayDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-semibold uppercase tracking-wider">
                  Day Inspection View
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

            {selectedDayDetails.activeStop ? (
              <div className="space-y-6">
                {/* Active City Card */}
                <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <div>
                      <span className="text-xs text-slate-400 block">Active Stop City</span>
                      <span className="text-base font-bold text-white">
                        {selectedDayDetails.activeStop.city.name},{" "}
                        {selectedDayDetails.activeStop.city.country}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-indigo-300 font-semibold">
                    Day #{selectedDayDetails.dayNumberInStop} in Stop
                  </span>
                </div>

                {/* Day Expenditure & Threshold */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Daily Expense</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ${selectedDayDetails.dayTotalCost.toFixed(2)}
                    </span>
                  </div>

                  {selectedDayDetails.dayTotalCost > 150 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Over $150 Limit
                    </div>
                  )}
                </div>

                {/* Activities List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
                    <span>Scheduled Activities ({selectedDayDetails.activities.length})</span>
                    <Link
                      href={`/trips/${tripId}/stops/${selectedDayDetails.activeStop.id}/activities`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Manage Activities</span>
                    </Link>
                  </h4>

                  {selectedDayDetails.activities.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 italic">
                      No activities scheduled for this date yet.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {selectedDayDetails.activities.map((act) => {
                        const cost =
                          act.costOverride !== null
                            ? Number(act.costOverride)
                            : Number(act.activity.cost);

                        return (
                          <div
                            key={act.id}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 text-indigo-400 font-mono mb-1">
                                <Clock className="w-3 h-3" />
                                <span>{act.timeSlot}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400">{act.activity.category}</span>
                              </div>
                              <h5 className="font-bold text-white">{act.activity.name}</h5>
                            </div>

                            <span className="font-bold text-emerald-400 font-mono">
                              ${cost.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-3">
                <p className="text-sm">No city stop scheduled for this date.</p>
                <Link
                  href={`/trips/${tripId}/build`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add City Stop to Trip</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
