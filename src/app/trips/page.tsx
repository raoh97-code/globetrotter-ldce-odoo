"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  ArrowRight,
  Compass,
  Clock,
  CheckCircle2,
  FileEdit,
  Sparkles,
  Eye,
  Globe,
  Lock,
} from "lucide-react";

interface City {
  name: string;
  country: string;
  imageUrl?: string | null;
}

interface TripStop {
  id: string;
  city: City;
}

interface Trip {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string | null;
  isPublic: boolean;
  shareToken?: string | null;
  stops: TripStop[];
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "ongoing" | "upcoming" | "completed" | "drafts">("all");

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = async () => {
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
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (tripId: string, currentlyPublic: boolean) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentlyPublic }),
      });
      if (res.ok) {
        setTrips((prev) =>
          prev.map((t) =>
            t.id === tripId ? { ...t, isPublic: !currentlyPublic } : t
          )
        );
      }
    } catch (err) {
      console.error("Error toggling trip visibility:", err);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Status categorization function
  const getTripStatus = (trip: Trip) => {
    if (trip.stops.length === 0) return "draft";

    const start = new Date(trip.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(trip.endDate);
    end.setHours(23, 59, 59, 999);

    if (start <= today && today <= end) {
      return "ongoing";
    } else if (start > today) {
      return "upcoming";
    } else {
      return "completed";
    }
  };

  // Filter lists
  const ongoingTrips = trips.filter((t) => getTripStatus(t) === "ongoing");
  const upcomingTrips = trips.filter((t) => getTripStatus(t) === "upcoming");
  const completedTrips = trips.filter((t) => getTripStatus(t) === "completed");
  const draftTrips = trips.filter((t) => getTripStatus(t) === "draft");

  const filteredTrips = trips.filter((t) => {
    if (activeTab === "all") return true;
    return getTripStatus(t) === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading trips list...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header & New Trip Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-indigo-500" />
              My Travel Itineraries
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Categorized view of ongoing, upcoming, completed, and draft trips.
            </p>
          </div>

          <Link
            href="/trips/new"
            className="px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Trip</span>
          </Link>
        </div>

        {/* Tab Navigation Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 max-w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>All Trips</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {trips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ongoing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "ongoing"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ongoing</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {ongoingTrips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>Upcoming</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {upcomingTrips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "completed"
                ? "bg-slate-700 text-white shadow-md shadow-slate-700/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {completedTrips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("drafts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "drafts"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>Drafts</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {draftTrips.length}
            </span>
          </button>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No {activeTab} trips found</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              You don&apos;t have any itineraries matching the selected category.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const status = getTripStatus(trip);
              const cover =
                trip.coverPhotoUrl ||
                trip.stops[0]?.city.imageUrl ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

              return (
                <div
                  key={trip.id}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-indigo-500/50 transition-all group shadow-xl"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-900">
                    <img
                      src={cover}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/40" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {status === "ongoing" && (
                        <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Ongoing
                        </span>
                      )}
                      {status === "upcoming" && (
                        <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Clock className="w-3 h-3" />
                          Upcoming
                        </span>
                      )}
                      {status === "completed" && (
                        <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-slate-400" />
                          Completed
                        </span>
                      )}
                      {status === "draft" && (
                        <span className="px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <FileEdit className="w-3 h-3" />
                          Draft (0 Stops)
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleVisibility(trip.id, trip.isPublic);
                        }}
                        title={trip.isPublic ? "Make Private" : "Make Public"}
                        className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md border cursor-pointer transition-all ${
                          trip.isPublic
                            ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/90"
                            : "bg-slate-950/90 border-slate-700/60 text-slate-400 hover:bg-slate-900/90"
                        }`}
                      >
                        {trip.isPublic ? (
                          <><Globe className="w-3 h-3" /> Public</>
                        ) : (
                          <><Lock className="w-3 h-3" /> Private</>
                        )}
                      </button>
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-indigo-300 border border-slate-700/60">
                        {trip.stops.length} {trip.stops.length === 1 ? "Stop" : "Stops"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {trip.description || "No description provided."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-5 pt-3 border-t border-slate-800/80">
                        <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} —{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          href={`/trips/${trip.id}/build`}
                          className="py-2 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold text-center transition-all flex items-center justify-center gap-1"
                        >
                          <span>Build</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/trips/${trip.id}/itinerary`}
                          className="py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-[11px] font-semibold text-center transition-all flex items-center justify-center gap-1 border border-slate-700/50"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Itinerary</span>
                        </Link>
                        <Link
                          href={`/trips/${trip.id}/calendar`}
                          className="py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-semibold text-center transition-all flex items-center justify-center gap-1 border border-emerald-500/30"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Calendar</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
