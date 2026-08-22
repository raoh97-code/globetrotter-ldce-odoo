"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Map, MapPin, Search } from "lucide-react";

export default function MapPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedCity(searchInput.trim());
    }
  };

  const presetCities = ["Mumbai", "Ahmedabad", "Jaipur", "Amritsar", "Surat", "Udaipur", "Goa", "Tokyo", "Paris", "New York"];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative overflow-hidden">
      <Header user={user} />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Map className="w-3.5 h-3.5" />
                Interactive Destinations Map
              </div>
              <h1 className="text-3xl font-extrabold text-white">Global Travel Map</h1>
              <p className="text-slate-400 text-sm mt-1">
                Explore destination maps, street layouts, and location views for any city worldwide.
              </p>
            </div>

            {/* Custom Search & Quick City Buttons */}
            <div className="space-y-3 w-full lg:w-auto">
              <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search any place or city..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </form>

              <div className="flex flex-wrap gap-1.5 max-w-xl">
                {presetCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setSearchInput("");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedCity === city
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Map Display Container */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 h-[650px] relative shadow-2xl">
          <iframe
            title={`Map view for ${selectedCity}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCity)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      </main>
    </div>
  );
}
