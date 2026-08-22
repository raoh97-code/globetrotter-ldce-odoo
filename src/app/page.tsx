import Link from "next/link";
import { Compass, Map, DollarSign, ArrowRight, Sparkles, Globe, MapPin, Users, ChevronRight, Calendar, Eye } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function Home() {
  const user = await getSessionUser();

  // Fetch featured cities and public trips for guest display
  let featuredCities: any[] = [];
  let publicTrips: any[] = [];

  try {
    [featuredCities, publicTrips] = await Promise.all([
      prisma.city.findMany({
        include: { _count: { select: { activities: true } } },
        orderBy: { popularityScore: "desc" },
        take: 8,
      }),
      prisma.trip.findMany({
        where: { isPublic: true },
        include: {
          user: { select: { firstName: true, lastName: true } },
          stops: { include: { city: true }, orderBy: { orderIndex: "asc" }, take: 3 },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);
  } catch (err) {
    console.error("Error loading landing page data:", err);
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight gradient-text">
            GlobeTrotter
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/community"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            Community
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Collaborative Multi-City Travel Planner
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Discover the World, <br />
              <span className="gradient-text">Plan Your Adventure</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-normal leading-relaxed">
              Explore stunning destinations, browse community-shared itineraries, and build your perfect multi-city trip with real-time budget tracking.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={user ? "/trips/new" : "/register"}
                className="px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 cursor-pointer"
              >
                <span>{user ? "Plan a New Trip" : "Start Planning for Free"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/community"
                className="px-8 py-4 rounded-2xl font-bold text-base text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-3"
              >
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Browse Community Trips</span>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reorderable City Sections</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add multi-city stops, specify custom date ranges, and reorder itinerary sections seamlessly with database persistence.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Budget Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track expenses with interactive pie and bar charts. Get instant alerts when daily spending exceeds thresholds.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Community Discovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore public itineraries shared by travelers worldwide. Clone trips with one click to start your own adventure.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Popular Destinations Section ─── */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <MapPin className="w-7 h-7 text-indigo-400" />
                Popular Destinations
              </h2>
              <p className="text-slate-400 text-sm mt-1">Explore top-rated cities and their activities</p>
            </div>
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCities.map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.id}`}
                className="group glass-card rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all shadow-lg"
              >
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  {city.imageUrl ? (
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
                      <MapPin className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/30" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-indigo-300 border border-slate-700/60">
                    Cost: {city.costIndex}/10
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{city.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{city.country}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {city._count.activities} Activities
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Community Trips Section ─── */}
        {publicTrips.length > 0 && (
          <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                  <Globe className="w-7 h-7 text-emerald-400" />
                  Community Shared Trips
                </h2>
                <p className="text-slate-400 text-sm mt-1">See what other travelers are planning</p>
              </div>
              <Link
                href="/community"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicTrips.map((trip: any) => {
                const cover = trip.coverPhotoUrl || trip.stops?.[0]?.city?.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
                const cityNames = trip.stops?.map((s: any) => s.city?.name).filter(Boolean).join(" → ") || "No stops";

                return (
                  <div
                    key={trip.id}
                    className="glass-card rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/40 transition-all group shadow-lg"
                  >
                    <div className="h-40 relative overflow-hidden bg-slate-900">
                      <img src={cover} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/30" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Public
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{trip.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {trip.user?.firstName} {trip.user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {cityNames}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                      {trip.shareToken && (
                        <Link
                          href={`/share/${trip.shareToken}`}
                          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          View Itinerary
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} GlobeTrotter — Built with Next.js, Prisma ORM, and PostgreSQL.</span>
          <div className="flex items-center gap-4">
            <Link href="/community" className="hover:text-slate-300 transition-colors">Community</Link>
            <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
