import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Calendar,
  Compass,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileEdit,
  ArrowRight,
  User as UserIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch recent trips
  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
    include: {
      stops: {
        include: {
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTripStatus = (trip: typeof trips[0]) => {
    if (trip.stops.length === 0) return "draft";

    const start = new Date(trip.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(trip.endDate);
    end.setHours(23, 59, 59, 999);

    if (start <= today && today <= end) return "ongoing";
    if (start > today) return "upcoming";
    return "completed";
  };

  const ongoingCount = trips.filter((t) => getTripStatus(t) === "ongoing").length;
  const upcomingCount = trips.filter((t) => getTripStatus(t) === "upcoming").length;
  const completedCount = trips.filter((t) => getTripStatus(t) === "completed").length;
  const draftCount = trips.filter((t) => getTripStatus(t) === "draft").length;

  const recentTrips = trips.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-6 md:p-10 glass-panel border border-slate-800 overflow-hidden mb-8 gradient-glow">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authenticated Explorer
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Welcome back, <span className="gradient-text">{user.firstName}</span>!
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              Ready to plan your next multi-city journey? Review your active itineraries or create a new trip.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/trips/new"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Trip</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Categorization Overview Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/trips"
            className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ongoing
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">{ongoingCount}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            href="/trips"
            className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Upcoming
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">{upcomingCount}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>

          <Link
            href="/trips"
            className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Completed
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">{completedCount}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/trips"
            className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                Drafts
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">{draftCount}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* User Info & Trips Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-400" />
                Explorer Profile
              </h2>
              <Link href="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Edit →
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-500 text-xs block">Full Name</span>
                <span className="font-semibold text-white">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-500 text-xs block">Email</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>

              {(user.city || user.country) && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 text-xs block">Home Base</span>
                  <span className="font-semibold text-white">
                    {[user.city, user.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Trips List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Recent Trips</h2>
              <Link
                href="/trips"
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            {recentTrips.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-slate-800/80">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No Trips Created Yet</h3>
                <p className="text-slate-400 text-sm mb-6">
                  You haven&apos;t planned any trips. Create your first itinerary to start building sections & activities.
                </p>
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Planning</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTrips.map((trip) => {
                  const status = getTripStatus(trip);

                  return (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}/build`}
                      className="block p-5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {trip.name}
                          </h3>

                          {status === "ongoing" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Ongoing
                            </span>
                          )}
                          {status === "upcoming" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                              Upcoming
                            </span>
                          )}
                          {status === "completed" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                              Completed
                            </span>
                          )}
                          {status === "draft" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                              Draft
                            </span>
                          )}
                        </div>

                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
                          {trip.stops.length} {trip.stops.length === 1 ? "Stop" : "Stops"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 line-clamp-1 mb-3">
                        {trip.description || "No description provided."}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(trip.startDate).toLocaleDateString()} -{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
