"use client";

import { useEffect, useState, use } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  MapPin,
  Tag,
  ArrowLeft,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle,
  Plus,
  Share2,
  Copy,
  Check,
  Globe,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
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

const DAILY_OVER_BUDGET_THRESHOLD = 150; // $150 threshold per day

export default function ItineraryBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data.trip);
        setIsPublic(Boolean(data.trip?.isPublic));
        if (data.trip?.shareToken) {
          setShareUrl(`${window.location.origin}/share/${data.trip.shareToken}`);
        }
      }
    } catch (err) {
      console.error("Error fetching trip itinerary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async (targetPublicState: boolean) => {
    setSharing(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: targetPublicState }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsPublic(data.isPublic);
        if (data.shareUrl) {
          setShareUrl(data.shareUrl);
        }
      }
    } catch (err) {
      console.error("Error toggling share status:", err);
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading itinerary & budget analysis...</span>
        </div>
      </div>
    );
  }

  // Calculate totals and category breakdown
  let totalActivityCost = 0;
  let totalAllocatedSectionBudget = 0;
  const categoryTotals: Record<string, number> = {};

  trip?.stops.forEach((stop: TripStop) => {
    if (stop.sectionBudget) {
      totalAllocatedSectionBudget += Number(stop.sectionBudget);
    }

    stop.tripActivities.forEach((ta: TripActivity) => {
      const cost = ta.costOverride !== null ? Number(ta.costOverride) : Number(ta.activity.cost);
      totalActivityCost += cost;

      const cat = ta.activity.category.toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + cost;
    });
  });

  // Prepare Recharts data
  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
  }));

  const barChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    category: name.charAt(0).toUpperCase() + name.slice(1),
    amount: parseFloat(value.toFixed(2)),
  }));

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

        {/* Trip Header Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-10 relative overflow-hidden gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Master Itinerary & Budget
              </div>
              <h1 className="text-3xl font-extrabold text-white">{trip?.name}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {trip && new Date(trip.startDate).toLocaleDateString()} —{" "}
                {trip && new Date(trip.endDate).toLocaleDateString()} ({trip?.stops.length} Cities)
              </p>
            </div>

            {/* Total Budget Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-5 py-3 rounded-2xl glass-card border border-slate-700/80">
                <span className="text-xs text-slate-400 block uppercase tracking-wider">
                  Total Activities Cost
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ${totalActivityCost.toFixed(2)}
                </span>
              </div>

              <div className="px-5 py-3 rounded-2xl glass-card border border-slate-700/80">
                <span className="text-xs text-slate-400 block uppercase tracking-wider">
                  Section Budget Sum
                </span>
                <span className="text-2xl font-extrabold text-indigo-300 font-mono">
                  ${totalAllocatedSectionBudget.toFixed(2)}
                </span>
              </div>

              <Link
                href={`/trips/${tripId}/calendar`}
                className="px-4 py-3 rounded-2xl font-semibold text-xs text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar View</span>
              </Link>

              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-3 rounded-2xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Itinerary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Budget Breakdown & Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Category Pie Chart Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-400" />
                Category Expense Share
              </h3>
              <span className="text-xs text-slate-400 font-mono">Recharts Visualization</span>
            </div>

            {pieChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-slate-500">
                No activity costs recorded yet.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
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
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
              {pieChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name}: <strong>${item.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Bar Chart Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Spending by Category ($)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Recharts Bar Analysis</span>
            </div>

            {barChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-slate-500">
                No activity costs recorded yet.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                      formatter={(value: any) => [`$${value}`, "Total Spent"]}
                    />
                    <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="text-xs text-slate-400 text-center pt-4 border-t border-slate-800">
              Threshold alert limit: <strong>${DAILY_OVER_BUDGET_THRESHOLD}/day</strong>
            </div>
          </div>
        </div>

        {/* Day-Wise Itinerary Grouped by City Stop */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-indigo-400" />
          Day-by-Day Itinerary Schedule
        </h2>

        {trip?.stops.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">No City Stops Configured</h3>
            <p className="text-slate-400 text-sm mb-4">
              Return to the builder screen to add city stops and assign activities.
            </p>
            <Link
              href={`/trips/${tripId}/build`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <span>Go to Section Builder</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {trip?.stops.map((stop: TripStop, stopIndex: number) => {
              // Group tripActivities by dayNumber
              const activitiesByDay: Record<number, TripActivity[]> = {};
              stop.tripActivities.forEach((ta: TripActivity) => {
                activitiesByDay[ta.dayNumber] = activitiesByDay[ta.dayNumber] || [];
                activitiesByDay[ta.dayNumber].push(ta);
              });

              // Compute stop total activity cost
              const stopTotalCost = stop.tripActivities.reduce((acc: number, curr: TripActivity) => {
                return (
                  acc +
                  (curr.costOverride !== null
                    ? Number(curr.costOverride)
                    : Number(curr.activity.cost))
                );
              }, 0);

              return (
                <div
                  key={stop.id}
                  className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6"
                >
                  {/* City Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 font-mono">
                        #{stopIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {stop.city.name}, {stop.city.country}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {new Date(stop.startDate).toLocaleDateString()} —{" "}
                          {new Date(stop.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                          Section Activities Total
                        </span>
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          {formatCurrency(stopTotalCost, stop.city.country)}
                        </span>
                      </div>

                      <Link
                        href={`/trips/${tripId}/stops/${stop.id}/activities`}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Activities</span>
                      </Link>
                    </div>
                  </div>

                  {/* Day-Wise Breakdown */}
                  {Object.keys(activitiesByDay).length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 italic">
                      No activities added to this city section yet.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(activitiesByDay).map(([dayStr, dayActivities]) => {
                        const dayNum = parseInt(dayStr);
                        const dayTotalCost = dayActivities.reduce((sum, item) => {
                          return (
                            sum +
                            (item.costOverride !== null
                              ? Number(item.costOverride)
                              : Number(item.activity.cost))
                          );
                        }, 0);

                        const isOverBudget = dayTotalCost > DAILY_OVER_BUDGET_THRESHOLD;

                        return (
                          <div
                            key={dayNum}
                            className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-base">
                                  Day {dayNum} Schedule
                                </span>
                                {isOverBudget && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    OVER BUDGET (${dayTotalCost.toFixed(2)})
                                  </span>
                                )}
                              </div>

                              <span className="text-xs font-mono font-semibold text-slate-300">
                                Day Total: ${dayTotalCost.toFixed(2)}
                              </span>
                            </div>

                            {/* Activities in Day */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {dayActivities.map((actItem) => {
                                const cost =
                                  actItem.costOverride !== null
                                    ? Number(actItem.costOverride)
                                    : Number(actItem.activity.cost);

                                return (
                                  <div
                                    key={actItem.id}
                                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono mb-2">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {actItem.timeSlot}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                                          {actItem.activity.category}
                                        </span>
                                      </div>

                                      <h4 className="text-sm font-bold text-white mb-1">
                                        {actItem.activity.name}
                                      </h4>
                                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                                        {actItem.activity.description || "No description."}
                                      </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                                      <span className="text-slate-500">
                                        {actItem.activity.durationMinutes} mins
                                      </span>
                                      <span className="font-bold text-emerald-400 font-mono">
                                        {formatCurrency(cost, stop.city.country)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Share Itinerary Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Share Itinerary</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Public Access Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Public Visibility</span>
                <span className="text-xs text-slate-400">
                  {isPublic ? "Anyone with the link can view this trip." : "Only you can view this trip."}
                </span>
              </div>

              <button
                onClick={() => handleToggleShare(!isPublic)}
                disabled={sharing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isPublic ? "bg-indigo-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Copy Link Section */}
            {isPublic && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Public Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-indigo-300 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
