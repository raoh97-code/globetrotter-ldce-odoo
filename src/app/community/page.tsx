"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  Eye,
  Search,
  Compass,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

interface PublicTrip {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string | null;
  shareToken?: string | null;
  isPublic: boolean;
  user: {
    firstName: string;
    lastName: string;
    photoUrl?: string | null;
  };
  stops: {
    id: string;
    city: {
      name: string;
      country: string;
      imageUrl?: string | null;
    };
    tripActivities: any[];
  }[];
}

export default function CommunityPage() {
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      const res = await fetch("/api/explore");
      if (res.ok) {
        const data = await res.json();
        setTrips(data.publicTrips || []);
      }
    } catch (err) {
      console.error("Error fetching community data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = trips.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const cityNames = t.stops?.map((s) => s.city?.name?.toLowerCase()).join(" ") || "";
    return (
      t.name.toLowerCase().includes(q) ||
      `${t.user.firstName} ${t.user.lastName}`.toLowerCase().includes(q) ||
      cityNames.includes(q)
    );
  });

  const handleCopyLink = (shareToken: string, tripId: string) => {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(tripId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading community trips...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-emerald-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Public Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight gradient-text">
            GlobeTrotter
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            Explore
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Globe className="w-3.5 h-3.5" />
                Community Hub
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Shared Travel Itineraries
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                Browse public itineraries shared by travelers worldwide. Get inspired, discover new destinations, and plan your own adventure.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips, travelers, cities..."
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            {filtered.length} public {filtered.length === 1 ? "trip" : "trips"} available
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Trips Found</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {searchQuery
                ? `No public trips match "${searchQuery}". Try a different search.`
                : "No public trips have been shared yet. Be the first!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trip) => {
              const cover =
                trip.coverPhotoUrl ||
                trip.stops?.[0]?.city?.imageUrl ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
              const cityNames =
                trip.stops?.map((s) => s.city?.name).filter(Boolean).join(" → ") || "No stops";
              const totalActivities = trip.stops?.reduce(
                (sum, s) => sum + (s.tripActivities?.length || 0),
                0
              );

              return (
                <div
                  key={trip.id}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/40 transition-all group shadow-xl"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-900">
                    <img
                      src={cover}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Globe className="w-3 h-3" />
                        Public
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-indigo-300 border border-slate-700/60">
                        {trip.stops?.length || 0} Stops
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                      {trip.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[9px] font-bold text-indigo-300">
                        {trip.user.firstName?.[0]}
                      </div>
                      <span>
                        {trip.user.firstName} {trip.user.lastName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                      {cityNames}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                      {totalActivities > 0 && (
                        <span className="text-indigo-400 font-semibold">{totalActivities} Activities</span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-800/80">
                      {trip.shareToken && (
                        <Link
                          href={`/share/${trip.shareToken}`}
                          className="flex-1 py-2 px-3 rounded-xl text-[11px] font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3 h-3" />
                          View Itinerary
                        </Link>
                      )}
                      {trip.shareToken && (
                        <button
                          onClick={() => handleCopyLink(trip.shareToken!, trip.id)}
                          className="py-2 px-3 rounded-xl text-[11px] font-semibold text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === trip.id ? (
                            <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy Link</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} GlobeTrotter — Community Hub</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">Join</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
