"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Search,
  Globe,
  MapPin,
  Calendar,
  Share2,
  Copy,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";

interface City {
  id: string;
  name: string;
  state?: string | null;
  country: string;
  costIndex: number;
  popularityScore: number;
  imageUrl?: string | null;
  _count: {
    stops: number;
    activities: number;
  };
}

interface TripStop {
  id: string;
  city: City;
}

interface PublicTrip {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  shareToken?: string | null;
  coverPhotoUrl?: string | null;
  user: {
    firstName: string;
    lastName: string;
    photoUrl?: string | null;
  };
  stops: TripStop[];
}

export default function ExplorePage() {
  const router = useRouter();

  const [publicTrips, setPublicTrips] = useState<PublicTrip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cloningId, setCloningId] = useState<string | null>(null);

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      const [exploreRes, userRes] = await Promise.all([
        fetch("/api/explore"),
        fetch("/api/auth/me"),
      ]);

      if (exploreRes.ok) {
        const data = await exploreRes.json();
        setPublicTrips(data.publicTrips || []);
        setCities(data.cities || []);
      }

      if (userRes.ok) {
        const uData = await userRes.json();
        setUser(uData.user);
      }
    } catch (err) {
      console.error("Error fetching explore data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTrip = async (tripId: string) => {
    if (!user) {
      router.push("/login?callbackUrl=/explore");
      return;
    }

    setCloningId(tripId);
    try {
      const res = await fetch(`/api/trips/${tripId}/clone`, {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok && data.clonedTripId) {
        router.push(`/trips/${data.clonedTripId}/build`);
      }
    } catch (err) {
      console.error("Error cloning trip:", err);
    } finally {
      setCloningId(null);
    }
  };

  const filteredTrips = publicTrips.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesName = t.name.toLowerCase().includes(q);
    const matchesUser = `${t.user.firstName} ${t.user.lastName}`.toLowerCase().includes(q);
    const matchesCity = t.stops.some((s) => s.city.name.toLowerCase().includes(q) || s.city.country.toLowerCase().includes(q));
    return matchesName || matchesUser || matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading community & destination catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Header Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Community Exploration Hub
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Discover & Clone <span className="gradient-text">Public Itineraries</span>
            </h1>

            <p className="text-slate-400 text-base">
              Explore itineraries created by travelers around the globe. Clone any public itinerary to customize city stops, activities, and budget allocations.
            </p>

            {/* Search Input */}
            <div className="relative max-w-lg pt-2">
              <Search className="absolute left-4 top-5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by trip title, traveler name, or city..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Top Destination Cities Carousel / Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-indigo-400" />
                Popular Destination Catalog
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore curated travel destinations with cost indexes and scheduled activities count.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.map((c) => (
              <Link
                key={c.id}
                href={`/cities/${c.id}`}
                className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="h-24 rounded-xl overflow-hidden mb-3 bg-slate-900 relative">
                    <img
                      src={c.imageUrl || "https://images.unsplash.com/photo-1477959858617-67f30ac4ce71?w=400"}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-indigo-300 border border-slate-700">
                      ₹ INR
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                    {c.name}
                  </h3>
                  <span className="text-xs text-slate-400 block font-medium">
                    {c.state ? `${c.state}, ${c.country}` : c.country}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span className="text-indigo-300 font-semibold">{c._count.activities} Activities</span>
                  <span>{c._count.stops} Trips</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Public Itineraries Gallery */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-indigo-400" />
                Community Shared Trips ({filteredTrips.length})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Browse public itineraries and click &quot;Clone Itinerary&quot; to copy them into your personal account.
              </p>
            </div>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
              <p className="text-slate-400 text-sm">No public trips match your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((t) => {
                const cover =
                  t.coverPhotoUrl ||
                  t.stops[0]?.city.imageUrl ||
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

                return (
                  <div
                    key={t.id}
                    className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-indigo-500/50 transition-all group shadow-xl"
                  >
                    <div className="h-44 relative overflow-hidden bg-slate-900">
                      <img
                        src={cover}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/40" />

                      {/* Creator Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-white">
                        <div className="w-5 h-5 rounded-full bg-indigo-600/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                          {t.user.firstName[0]}
                        </div>
                        <span>{t.user.firstName} {t.user.lastName}</span>
                      </div>

                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-indigo-300 border border-slate-700/60">
                        {t.stops.length} {t.stops.length === 1 ? "Stop" : "Stops"}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                          {t.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                          {t.description || "No description provided."}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-5 pt-3 border-t border-slate-800/80">
                          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>
                            {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {t.shareToken ? (
                            <Link
                              href={`/share/${t.shareToken}`}
                              className="py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 border border-slate-700/50"
                            >
                              <span>View Public</span>
                            </Link>
                          ) : (
                            <div className="py-2.5 px-3 rounded-xl bg-slate-900/60 text-slate-500 text-xs font-semibold text-center">
                              Public
                            </div>
                          )}

                          <button
                            onClick={() => handleCloneTrip(t.id)}
                            disabled={cloningId === t.id}
                            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                          >
                            {cloningId === t.id ? (
                              <span>Cloning...</span>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Clone Trip</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
