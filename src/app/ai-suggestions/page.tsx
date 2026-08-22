"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Sparkles, MapPin, Calendar, Search, CheckCircle2, Lightbulb, AlertCircle, RefreshCw, Key, Eye, EyeOff } from "lucide-react";

export default function AISuggestionsPage() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState("Budget-Friendly");
  const [clientApiKey, setClientApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKeyText, setShowApiKeyText] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("Please enter a destination name.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          numDays,
          travelStyle,
          clientApiKey,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuggestions(data.suggestions);
      } else {
        setError(data.error || "Failed to generate suggestions.");
      }
    } catch (err) {
      console.error("AI suggestion error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = ["Goa", "Udaipur", "Manali", "Ahmedabad", "Kyoto", "Rome", "Paris", "Dubai"];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative overflow-hidden">
      <Header user={user} />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[450px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Page Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden gradient-glow">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Travel Intelligence Powered by Gemini 3.6 Flash
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              AI Place & Budget Suggestions
            </h1>

            <p className="text-slate-400 text-sm">
              Enter any place or city to receive AI-powered attraction recommendations, day-wise itineraries, and approximate budget estimates formatted in **Indian Rupees (₹ / INR)**.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destination Input */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Destination / Place Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Udaipur, Gujarat, Rome..."
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Number of Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Duration (Days)
                </label>
                <select
                  value={numDays}
                  onChange={(e) => setNumDays(parseInt(e.target.value))}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? "Day" : "Days"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Budget Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Budget-Friendly">Budget-Friendly (Backpacker)</option>
                  <option value="Moderate">Moderate (Comfort)</option>
                  <option value="Luxury">Luxury (Premium)</option>
                </select>
              </div>
            </div>

            {/* Custom API Key Collapsible Toggle */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{showApiKeyInput ? "Hide Custom API Key Option" : "Paste Custom Gemini API Key Direct (Optional)"}</span>
              </button>

              {showApiKeyInput && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 max-w-xl">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Gemini API Key (Overrides .env)
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeyText ? "text" : "password"}
                      value={clientApiKey}
                      onChange={(e) => setClientApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKeyText(!showApiKeyText)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showApiKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preset Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="font-semibold">Popular choices:</span>
              {popularDestinations.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDestination(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consulting Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Suggestions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Results Output */}
        {suggestions && (
          <div className="space-y-8 animate-fadeIn">
            {/* Summary & Total Budget Banner */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border border-purple-500/30 bg-purple-950/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AI Travel Plan for {suggestions.destination}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{suggestions.destination}</h2>
                  <p className="text-slate-300 text-sm">{suggestions.summary}</p>
                </div>

                <div className="px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                    Approximate Total Budget
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {suggestions.estimatedBudgetINR}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Attractions Grid */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                Recommended Places to Visit
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.topAttractions?.map((place: any, i: number) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-bold text-white">{place.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2">
                        {place.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{place.description}</p>
                    <div className="pt-2 border-t border-slate-800 text-xs flex items-center justify-between font-mono">
                      <span className="text-slate-500">Est. Entry/Cost:</span>
                      <span className="font-bold text-emerald-400">{place.costINR}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Wise Itinerary */}
            {suggestions.dayWiseItinerary && suggestions.dayWiseItinerary.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Suggested Day-Wise Itinerary
                </h3>

                <div className="space-y-3">
                  {suggestions.dayWiseItinerary.map((day: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 font-mono text-sm shrink-0">
                        Day {day.day}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{day.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{day.highlights}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Tips */}
            {suggestions.budgetTips && suggestions.budgetTips.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Money Saving & Budget Tips
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {suggestions.budgetTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
