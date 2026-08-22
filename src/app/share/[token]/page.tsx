"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  MapPin,
  Clock,
  Globe,
  Share2,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    name: string;
    country: string;
    costIndex: number;
  };
  tripActivities: TripActivity[];
}

interface PublicTrip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string;
  user: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
  };
  stops: TripStop[];
}

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: "#6366f1",
  food: "#f59e0b",
  culture: "#ec4899",
  adventure: "#10b981",
  nightlife: "#8b5cf6",
  shopping: "#06b6d4",
  nature: "#84cc16",
  transport: "#64748b",
  other: "#94a3b8",
};

export default function PublicSharedItineraryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [trip, setTrip] = useState<PublicTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchSharedTrip();
  }, [token]);

  const fetchSharedTrip = async () => {
    try {
      const res = await fetch(`/api/share/${token}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data.trip);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Error fetching shared trip:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading public shared itinerary...</span>
        </div>
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Itinerary Not Found</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          This shared travel itinerary may be set to private or the link has expired.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
        >
          Explore GlobeTrotter Home
        </Link>
      </div>
    );
  }

  // Cost calculation & category data for pie chart
  let totalActivityCost = 0;
  const categoryTotals: Record<string, number> = {};

  trip.stops.forEach((stop) => {
    stop.tripActivities.forEach((ta) => {
      const cost = ta.costOverride !== null ? Number(ta.costOverride) : Number(ta.activity.cost);
      totalActivityCost += cost;
      const cat = ta.activity.category.toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + cost;
    });
  });

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
  }));

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Top Brand Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#0b0f17]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">
              GlobeTrotter
            </span>
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan Your Own Trip</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Summary Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 relative overflow-hidden gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Share2 className="w-3.5 h-3.5" />
                Shared Travel Itinerary
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{trip.name}</h1>
              <p className="text-sm text-slate-400 mt-2 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  Created by <strong>{trip.user.firstName} {trip.user.lastName}</strong>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-3 rounded-2xl glass-card border border-slate-700/80">
                <span className="text-xs text-slate-400 block uppercase tracking-wider">
                  Total Activities Budget
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ${totalActivityCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Expense Overview */}
        {pieChartData.length > 0 && (
          <div className="glass-card rounded-3xl p-6 border border-slate-800 mb-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-indigo-400" />
              Activities Expense Breakdown
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value: any) => [`$${value}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
              {pieChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}: <strong>${item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-Day Itinerary */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-indigo-400" />
          Multi-City Schedule ({trip.stops.length} Cities)
        </h2>

        <div className="space-y-8">
          {trip.stops.map((stop, stopIdx) => {
            const activitiesByDay: Record<number, TripActivity[]> = {};
            stop.tripActivities.forEach((ta) => {
              activitiesByDay[ta.dayNumber] = activitiesByDay[ta.dayNumber] || [];
              activitiesByDay[ta.dayNumber].push(ta);
            });

            return (
              <div key={stop.id} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 font-mono text-sm">
                      #{stopIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{stop.city.name}, {stop.city.country}</h3>
                      <span className="text-xs text-slate-400">
                        {new Date(stop.startDate).toLocaleDateString()} — {new Date(stop.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    Cost Index: {stop.city.costIndex}/10
                  </span>
                </div>

                {Object.keys(activitiesByDay).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No scheduled activities recorded for this section.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(activitiesByDay).map(([dayStr, dayActivities]) => (
                      <div key={dayStr} className="glass-card rounded-2xl p-4 border border-slate-800/80 space-y-3">
                        <span className="text-xs font-bold text-indigo-300 block border-b border-slate-800/80 pb-2">
                          Day {dayStr} Schedule
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {dayActivities.map((act) => {
                            const cost = act.costOverride !== null ? Number(act.costOverride) : Number(act.activity.cost);
                            return (
                              <div key={act.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between text-xs">
                                <div>
                                  <div className="flex items-center justify-between text-indigo-400 font-mono mb-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.timeSlot}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px]">{act.activity.category}</span>
                                  </div>
                                  <h4 className="font-bold text-white mb-1">{act.activity.name}</h4>
                                  <p className="text-slate-400 text-[11px] line-clamp-2">{act.activity.description}</p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                  <span className="text-slate-500">{act.activity.durationMinutes} mins</span>
                                  <span className="font-bold text-emerald-400 font-mono">${cost.toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer Banner */}
        <div className="mt-12 p-8 rounded-3xl glass-panel border border-indigo-500/30 text-center space-y-4 gradient-glow">
          <h3 className="text-2xl font-extrabold text-white">Inspired by this trip?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Design your custom multi-city itinerary, track section budgets, and explore activity schedules with GlobeTrotter.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
          >
            <span>Build Your Itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
