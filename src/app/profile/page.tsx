"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Compass,
  CheckCircle2,
  AlertCircle,
  Save,
  Camera,
  Map,
  Sparkles,
} from "lucide-react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  photoUrl?: string | null;
  createdAt: string;
}

interface UserStats {
  totalTrips: number;
  citiesVisited: number;
  totalTravelDays: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalTrips: 0, citiesVisited: 0, totalTravelDays: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStats(data.stats || { totalTrips: 0, citiesVisited: 0, totalTravelDays: 0 });

        // Initialize form
        if (data.user) {
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setPhone(data.user.phone || "");
          setCity(data.user.city || "");
          setCountry(data.user.country || "");
          setPhotoUrl(data.user.photoUrl || "");
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          city,
          country,
          photoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setUser(data.user);
      setSuccessMessage("Your profile information has been updated successfully!");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header user={user ? { firstName: user.firstName, lastName: user.lastName, email: user.email } : null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Circle */}
            <div className="relative group">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/30 shadow-xl"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              {(!photoUrl || photoUrl.trim() === "") && (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-indigo-500/30 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl">
                  {firstName[0]}
                  {lastName[0]}
                </div>
              )}
            </div>

            {/* Profile Info Summary */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-white">
                  {firstName} {lastName}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  Explorer
                </span>
              </div>

              <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-4 flex-wrap mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  {user?.email}
                </span>

                {(city || country) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {[city, country].filter(Boolean).join(", ")}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2026'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Travel Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Trips Created
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {stats.totalTrips}
              </span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Cities Visited
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {stats.citiesVisited}
              </span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Travel Days
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {stats.totalTravelDays}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Settings Form Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            Personal Details & Preferences
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Home City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Barcelona"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Home Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Spain"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Avatar Photo URL
              </label>
              <div className="relative">
                <Camera className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
