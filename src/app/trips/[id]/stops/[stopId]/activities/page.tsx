"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Compass,
  Search,
  Filter,
  Plus,
  Check,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  ArrowLeft,
  MapPin,
  Trash2,
  Sparkles,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

interface Activity {
  id: string;
  cityId: string;
  name: string;
  category: string;
  cost: number;
  durationMinutes: number;
  description?: string;
  imageUrl?: string;
}

interface TripActivity {
  id: string;
  tripStopId: string;
  activityId: string;
  dayNumber: number;
  timeSlot: string;
  costOverride?: number | null;
  activity: Activity;
}

export default function StopActivitiesPage({
  params,
}: {
  params: Promise<{ id: string; stopId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: tripId, stopId } = resolvedParams;
  const router = useRouter();

  const [stop, setStop] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignedActivities, setAssignedActivities] = useState<TripActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [maxCostFilter, setMaxCostFilter] = useState<string>("");

  // Modal / Selection State
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Morning");
  const [costOverride, setCostOverride] = useState("");
  const [adding, setAdding] = useState(false);

  const CATEGORIES = [
    "sightseeing",
    "food",
    "culture",
    "adventure",
    "nightlife",
    "shopping",
    "nature",
  ];

  const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];

  useEffect(() => {
    fetchStopDetails();
  }, [tripId, stopId]);

  useEffect(() => {
    if (stop?.cityId) {
      fetchActivities(stop.cityId);
    }
  }, [stop?.cityId, search, categoryFilter, maxCostFilter]);

  const fetchStopDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        const currentStop = data.trip.stops.find((s: any) => s.id === stopId);
        if (currentStop) {
          setStop(currentStop);
          setAssignedActivities(currentStop.tripActivities || []);
        }
      }
    } catch (err) {
      console.error("Error fetching stop details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (cityId: string) => {
    try {
      const params = new URLSearchParams({ cityId });
      if (search) params.append("query", search);
      if (categoryFilter) params.append("category", categoryFilter);
      if (maxCostFilter) params.append("maxCost", maxCostFilter);

      const res = await fetch(`/api/activities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    setAdding(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity.id,
          dayNumber: selectedDay,
          timeSlot: selectedTimeSlot,
          costOverride: costOverride ? parseFloat(costOverride) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add activity.");

      setAssignedActivities([...assignedActivities, data.tripActivity]);
      setSelectedActivity(null);
      setCostOverride("");
    } catch (err) {
      console.error("Error adding activity:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveActivity = async (tripActivityId: string) => {
    try {
      const res = await fetch(
        `/api/trips/${tripId}/stops/${stopId}/activities?tripActivityId=${tripActivityId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setAssignedActivities(assignedActivities.filter((a) => a.id !== tripActivityId));
      }
    } catch (err) {
      console.error("Error removing activity:", err);
    }
  };

  // Calculate total days for this stop section
  let stopDaysCount = 1;
  if (stop?.startDate && stop?.endDate) {
    const start = new Date(stop.startDate).getTime();
    const end = new Date(stop.endDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;
    stopDaysCount = Math.max(1, diff);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading activity search...</span>
        </div>
      </div>
    );
  }

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

        {/* Section Header */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 relative overflow-hidden gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {stop?.city?.name}, {stop?.city?.country}
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Activities for {stop?.city?.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {stop && new Date(stop.startDate).toLocaleDateString()} —{" "}
                {stop && new Date(stop.endDate).toLocaleDateString()} ({stopDaysCount} Days)
              </p>
            </div>

            <Link
              href={`/trips/${tripId}/itinerary`}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
            >
              <span>View Full Itinerary</span>
            </Link>
          </div>
        </div>

        {/* Assigned Activities Panel */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Assigned Section Activities ({assignedActivities.length})
          </h2>

          {assignedActivities.length === 0 ? (
            <p className="text-sm text-slate-400">
              No activities added to this city stop yet. Use the search below to explore & add activities!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedActivities.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
                      <span>Day {item.dayNumber}</span>
                      <span>•</span>
                      <span>{item.timeSlot}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.activity.name}</h4>
                    <span className="text-xs text-emerald-400 font-mono">
                      {formatCurrency(
                        item.costOverride !== null ? Number(item.costOverride) : Number(item.activity.cost),
                        stop?.city?.country
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveActivity(item.id)}
                    title="Remove Activity"
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities by name..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Cost Filter */}
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500 font-mono">
                ₹
              </span>
              <input
                type="number"
                value={maxCostFilter}
                onChange={(e) => setMaxCostFilter(e.target.value)}
                placeholder="Max cost (₹ INR)"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div
              key={act.id}
              className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    {act.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {act.durationMinutes} mins
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {act.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {act.description || "No detailed description."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mb-4">
                  <span className="text-slate-400 text-xs">Standard Cost</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    {formatCurrency(act.cost, stop?.city?.country)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedActivity(act)}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Section</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Activity Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">Add to Itinerary</h3>
              <p className="text-xs text-indigo-400 mb-4 font-semibold">{selectedActivity.name}</p>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Day *
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {Array.from({ length: stopDaysCount }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Time Slot *
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Cost Override (₹ INR) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costOverride}
                    onChange={(e) => setCostOverride(e.target.value)}
                    placeholder={`Default: ${formatCurrency(selectedActivity.cost)}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedActivity(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={adding}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {adding ? "Adding..." : "Confirm & Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
