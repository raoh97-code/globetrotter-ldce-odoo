"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Map,
  Share2,
  MapPin,
  Calendar,
  Activity as ActivityIcon,
  TrendingUp,
  Globe,
  Plus,
  X,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  publicTrips: number;
  totalStops: number;
  totalActivities: number;
}

interface TopCity {
  id: string;
  name: string;
  country: string;
  costIndex: number;
  _count: {
    stops: number;
    activities: number;
  };
}

interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string | null;
  country?: string | null;
  createdAt: string;
  _count: {
    trips: number;
  };
}

interface RecentTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
  _count: {
    stops: number;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topCities, setTopCities] = useState<TopCity[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // All cities list for activity dropdown
  const [allCities, setAllCities] = useState<{ id: string; name: string; country: string }[]>([]);

  // Add City modal state
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityForm, setCityForm] = useState({ name: "", country: "", costIndex: "5", popularityScore: "50", imageUrl: "" });
  const [cityFormLoading, setCityFormLoading] = useState(false);
  const [cityFormMsg, setCityFormMsg] = useState<string | null>(null);

  // Add Activity modal state
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [actForm, setActForm] = useState({ cityId: "", name: "", category: "sightseeing", cost: "0", durationMinutes: "60", description: "" });
  const [actFormLoading, setActFormLoading] = useState(false);
  const [actFormMsg, setActFormMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [adminRes, userRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/auth/me"),
      ]);

      if (userRes.ok) {
        const uData = await userRes.json();
        if (!uData.user || uData.user.email?.toLowerCase() !== "admin@globetrotter.com") {
          window.location.href = "/dashboard";
          return;
        }
        setUser(uData.user);
      } else {
        window.location.href = "/login";
        return;
      }

      if (adminRes.ok) {
        const data = await adminRes.json();
        setStats(data.stats);
        setTopCities(data.topCities || []);
        setRecentUsers(data.recentUsers || []);
        setRecentTrips(data.recentTrips || []);
      }

      // Fetch all cities for activity dropdown
      try {
        const citiesRes = await fetch("/api/cities");
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setAllCities(citiesData.cities || []);
        }
      } catch {}  
    } catch (err) {
      console.error("Error loading admin stats:", err);
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading admin system analytics...</span>
        </div>
      </div>
    );
  }

  const publicRatio = stats && stats.totalTrips > 0 ? Math.round((stats.publicTrips / stats.totalTrips) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Header Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                System Administration & Analytics
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Platform Overview</h1>
              <p className="text-slate-400 text-sm mt-1">
                Real-time usage metrics, database telemetry, top destination rankings, and recent platform logs.
              </p>
            </div>
          </div>
        </div>

        {/* High-Level Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                Total Registered Users
              </span>
              <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                {stats?.totalUsers}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                Total Trips Planned
              </span>
              <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                {stats?.totalTrips}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Map className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                Public Shared Trips
              </span>
              <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                {stats?.publicTrips} <span className="text-xs font-normal text-slate-500">({publicRatio}%)</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Share2 className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                Stops & Activities
              </span>
              <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                {stats?.totalStops} / {stats?.totalActivities}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <ActivityIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Admin Management Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => { setShowCityModal(true); setCityFormMsg(null); }}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex items-center gap-4 group"
          >
            <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600/30 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-white block">Add New City</span>
              <span className="text-xs text-slate-400">Create a new destination city in the database</span>
            </div>
          </button>

          <button
            onClick={() => { setShowActivityModal(true); setActFormMsg(null); }}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center gap-4 group"
          >
            <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-600/30 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-white block">Add New Activity</span>
              <span className="text-xs text-slate-400">Create a new activity for any city</span>
            </div>
          </button>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Visited Destinations Table */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Top Visited Destinations
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Cost Index</th>
                    <th className="py-3 px-4 text-right">Stops Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {topCities.map((city) => (
                    <tr key={city.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{city.name}</td>
                      <td className="py-3 px-4 text-slate-400">{city.country}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-indigo-300">
                          {city.costIndex}/10
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-emerald-400">
                        {city._count.stops} stops
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Recent User Registrations
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Trips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-indigo-300">
                        {u._count.trips}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Trips Audit Log */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Recent Trips Audit Log
            </h2>

            <button
              onClick={async () => {
                const res = await fetch("/api/admin/make-all-public", { method: "POST" });
                if (res.ok) {
                  fetchAdminData();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Make All Trips Public</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trip Title</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4">Stops</th>
                  <th className="py-3 px-4 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentTrips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{t.name}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {t.user.firstName} {t.user.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300">{t._count.stops} Stops</td>
                    <td className="py-3 px-4 text-right">
                      {t.isPublic ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          PUBLIC
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                          PRIVATE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {renderCityModal()}
      {renderActivityModal()}
    </div>
  );

  // ─── Add City Modal ───
  function renderCityModal() {
    if (!showCityModal) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative">
          <button onClick={() => setShowCityModal(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Add New City
          </h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setCityFormLoading(true);
            setCityFormMsg(null);
            try {
              const res = await fetch("/api/admin/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cityForm),
              });
              const data = await res.json();
              if (res.ok) {
                setCityFormMsg(`✅ City "${data.city.name}" created successfully!`);
                setCityForm({ name: "", country: "", costIndex: "5", popularityScore: "50", imageUrl: "" });
                fetchAdminData();
              } else {
                setCityFormMsg(`❌ ${data.error}`);
              }
            } catch {
              setCityFormMsg("❌ Failed to create city.");
            } finally {
              setCityFormLoading(false);
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">City Name *</label>
                <input type="text" required value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Barcelona" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Country *</label>
                <input type="text" required value={cityForm.country} onChange={(e) => setCityForm({ ...cityForm, country: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Spain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Cost Index (1-10)</label>
                <input type="number" min="1" max="10" value={cityForm.costIndex} onChange={(e) => setCityForm({ ...cityForm, costIndex: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Popularity (0-100)</label>
                <input type="number" min="0" max="100" value={cityForm.popularityScore} onChange={(e) => setCityForm({ ...cityForm, popularityScore: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Image URL</label>
              <input type="url" value={cityForm.imageUrl} onChange={(e) => setCityForm({ ...cityForm, imageUrl: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="https://images.unsplash.com/..." />
            </div>
            {cityFormMsg && <p className={`text-sm ${cityFormMsg.startsWith("✅") ? "text-emerald-400" : "text-rose-400"}`}>{cityFormMsg}</p>}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setShowCityModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button type="submit" disabled={cityFormLoading} className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md cursor-pointer disabled:opacity-50">{cityFormLoading ? "Creating..." : "Create City"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─── Add Activity Modal ───
  function renderActivityModal() {
    if (!showActivityModal) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative">
          <button onClick={() => setShowActivityModal(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-emerald-400" />
            Add New Activity
          </h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setActFormLoading(true);
            setActFormMsg(null);
            try {
              const res = await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actForm),
              });
              const data = await res.json();
              if (res.ok) {
                setActFormMsg(`✅ Activity "${data.activity.name}" created successfully!`);
                setActForm({ cityId: "", name: "", category: "sightseeing", cost: "0", durationMinutes: "60", description: "" });
                fetchAdminData();
              } else {
                setActFormMsg(`❌ ${data.error}`);
              }
            } catch {
              setActFormMsg("❌ Failed to create activity.");
            } finally {
              setActFormLoading(false);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">City *</label>
              <select required value={actForm.cityId} onChange={(e) => setActForm({ ...actForm, cityId: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500">
                <option value="">-- Select a city --</option>
                {allCities.map((c) => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Activity Name *</label>
                <input type="text" required value={actForm.name} onChange={(e) => setActForm({ ...actForm, name: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Walking Tour" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Category *</label>
                <select required value={actForm.category} onChange={(e) => setActForm({ ...actForm, category: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500">
                  <option value="sightseeing">Sightseeing</option>
                  <option value="food">Food</option>
                  <option value="culture">Culture</option>
                  <option value="adventure">Adventure</option>
                  <option value="nature">Nature</option>
                  <option value="shopping">Shopping</option>
                  <option value="nightlife">Nightlife</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Cost ($)</label>
                <input type="number" min="0" value={actForm.cost} onChange={(e) => setActForm({ ...actForm, cost: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Duration (mins)</label>
                <input type="number" min="1" value={actForm.durationMinutes} onChange={(e) => setActForm({ ...actForm, durationMinutes: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Description</label>
              <textarea rows={3} value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Brief description of the activity..." />
            </div>
            {actFormMsg && <p className={`text-sm ${actFormMsg.startsWith("✅") ? "text-emerald-400" : "text-rose-400"}`}>{actFormMsg}</p>}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setShowActivityModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button type="submit" disabled={actFormLoading} className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md cursor-pointer disabled:opacity-50">{actFormLoading ? "Creating..." : "Create Activity"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
