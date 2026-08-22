"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Globe,
  Calendar,
  DollarSign,
  Clock,
  Camera,
  Plus,
  X,
  ChevronLeft,
  Star,
  Image as ImageIcon,
  Users,
} from "lucide-react";

import { formatCurrency } from "@/lib/currency";

interface Activity {
  id: string;
  name: string;
  category: string;
  cost: number;
  durationMinutes: number;
  description?: string | null;
}

interface CityPhoto {
  id: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface CityDetail {
  id: string;
  name: string;
  state?: string | null;
  country: string;
  costIndex: number;
  popularityScore: number;
  imageUrl?: string | null;
  activities: Activity[];
  photos: CityPhoto[];
  _count: {
    stops: number;
    activities: number;
    photos: number;
  };
}

const categoryColors: Record<string, string> = {
  sightseeing: "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
  food: "bg-amber-600/20 text-amber-300 border-amber-500/30",
  culture: "bg-purple-600/20 text-purple-300 border-purple-500/30",
  adventure: "bg-rose-600/20 text-rose-300 border-rose-500/30",
  nature: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
  shopping: "bg-pink-600/20 text-pink-300 border-pink-500/30",
  nightlife: "bg-violet-600/20 text-violet-300 border-violet-500/30",
};

export default function CityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const cityId = resolvedParams.id;

  const [city, setCity] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"activities" | "photos">("activities");

  // Photo upload modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<string | null>(null);

  // Activity category filter
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchCityData();
    fetchUser();
  }, [cityId]);

  const fetchCityData = async () => {
    try {
      const res = await fetch(`/api/cities/${cityId}`);
      if (res.ok) {
        const data = await res.json();
        setCity(data.city);
      }
    } catch (err) {
      console.error("Error fetching city:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;
    setPhotoUploading(true);
    setPhotoMsg(null);

    try {
      const res = await fetch(`/api/cities/${cityId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: photoUrl, caption: photoCaption }),
      });

      const data = await res.json();
      if (res.ok) {
        setPhotoMsg("✅ Photo added successfully!");
        setPhotoUrl("");
        setPhotoCaption("");
        fetchCityData(); // Refresh
      } else {
        setPhotoMsg(`❌ ${data.error}`);
      }
    } catch {
      setPhotoMsg("❌ Failed to add photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const categories = city
    ? [...new Set(city.activities.map((a) => a.category))]
    : [];

  const filteredActivities = city
    ? categoryFilter === "all"
      ? city.activities
      : city.activities.filter((a) => a.category === categoryFilter)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading city details...</span>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">City Not Found</h2>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Public Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight gradient-text">GlobeTrotter</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Get Started</Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* City Hero */}
        <div className="rounded-3xl overflow-hidden border border-slate-800 mb-8 relative">
          <div className="h-64 md:h-80 relative">
            {city.imageUrl ? (
              <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                <MapPin className="w-20 h-20 text-slate-700" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{city.name}</h1>
                  <p className="text-slate-400 text-lg font-medium">
                    {city.state ? `${city.state}, ${city.country}` : city.country}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-2 rounded-xl glass-card border border-slate-700/80 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Cost Index</span>
                    <span className="text-lg font-extrabold text-indigo-300 font-mono">{city.costIndex}/10</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl glass-card border border-slate-700/80 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Popularity</span>
                    <span className="text-lg font-extrabold text-emerald-300 font-mono">{city.popularityScore}%</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl glass-card border border-slate-700/80 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Activities</span>
                    <span className="text-lg font-extrabold text-amber-300 font-mono">{city._count.activities}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl glass-card border border-slate-700/80 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Photos</span>
                    <span className="text-lg font-extrabold text-purple-300 font-mono">{city._count.photos}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-fit">
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "activities"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Activities ({city._count.activities})
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "photos"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Photos ({city._count.photos})
          </button>
        </div>

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  categoryFilter === "all"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                All ({city.activities.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border capitalize ${
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat} ({city.activities.filter((a) => a.category === cat).length})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-white flex-1">{act.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ml-2 ${categoryColors[act.category] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                      {act.category}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                    <span className="font-semibold text-emerald-300 font-mono text-sm">
                      {formatCurrency(act.cost, city.country)}
                    </span>
                    <span className="flex items-center gap-1 font-sans text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{act.durationMinutes} mins</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div>
            {/* Add Photo Button */}
            {user && (
              <div className="mb-6">
                <button
                  onClick={() => { setShowPhotoModal(true); setPhotoMsg(null); }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>
            )}

            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-sm text-indigo-300">
                <Link href="/login" className="font-semibold hover:underline">Sign in</Link> to add your own photos of {city.name}.
              </div>
            )}

            {city.photos.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Photos Yet</h3>
                <p className="text-slate-400 text-sm">Be the first to share a photo of {city.name}!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {city.photos.map((photo) => (
                  <div key={photo.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all group">
                    <div className="h-48 relative overflow-hidden bg-slate-900">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      {photo.caption && (
                        <p className="text-sm text-white mb-2">{photo.caption}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {photo.user.firstName} {photo.user.lastName}
                        </span>
                        <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative">
            <button onClick={() => setShowPhotoModal(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              Add Photo of {city.name}
            </h2>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Caption (optional)</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Sunset at the temple"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              {photoMsg && <p className={`text-sm ${photoMsg.startsWith("✅") ? "text-emerald-400" : "text-rose-400"}`}>{photoMsg}</p>}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowPhotoModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={photoUploading} className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md cursor-pointer disabled:opacity-50">{photoUploading ? "Adding..." : "Add Photo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GlobeTrotter — {city.name}, {city.country}
        </div>
      </footer>
    </div>
  );
}
