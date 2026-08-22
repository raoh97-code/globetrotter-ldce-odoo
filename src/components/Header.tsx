"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, LogOut, PlusCircle, Map, User, Calendar, Globe, ShieldCheck, Sparkles, Navigation } from "lucide-react";

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#0b0f17]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            GlobeTrotter
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            href="/trips"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Map className="w-4 h-4 text-indigo-400" />
            <span>My Trips</span>
          </Link>

          <Link
            href="/calendar"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Calendar</span>
          </Link>

          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Explore</span>
          </Link>

          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>Map</span>
          </Link>

          <Link
            href="/ai-suggestions"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Suggestions</span>
          </Link>

          {user && user.email?.toLowerCase() === "admin@globetrotter.com" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            href="/trips/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan Trip</span>
          </Link>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white group transition-all"
                title="View Profile & Settings"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-xs group-hover:scale-105 group-hover:border-indigo-400 transition-all">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <span className="hidden sm:inline font-medium text-white group-hover:text-indigo-300 transition-colors">
                  {user.firstName}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
