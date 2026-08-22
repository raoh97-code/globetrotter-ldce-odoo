"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Compass,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  ListOrdered,
  Eye,
  AlertCircle,
  Globe,
  Lock,
  Flag,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

interface City {
  id: string;
  name: string;
  state?: string | null;
  country: string;
  costIndex: number;
  popularityScore: number;
  imageUrl?: string;
  _count?: {
    activities: number;
  };
}

interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  orderIndex: number;
  startDate: string;
  endDate: string;
  sectionBudget?: number | null;
  city: City;
  tripActivities?: any[];
}

interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
}

export default function BuildItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  // New section form modal / row state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [stopStartDate, setStopStartDate] = useState("");
  const [stopEndDate, setStopEndDate] = useState("");
  const [sectionBudget, setSectionBudget] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Destination Filters (Directive 2.0 & 2.1)
  const [selectedRegion, setSelectedRegion] = useState<"india" | "international">("india");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  useEffect(() => {
    fetchTripDetails();
    fetchCities();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (!res.ok) throw new Error("Failed to load trip.");
      const data = await res.json();
      setTrip(data.trip);
      setStops(data.trip.stops || []);
      setIsPublic(data.trip.isPublic || false);
      
      // Default stop dates to trip dates if empty
      if (data.trip) {
        setStopStartDate(new Date(data.trip.startDate).toISOString().split("T")[0]);
        setStopEndDate(new Date(data.trip.endDate).toISOString().split("T")[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch("/api/cities");
      if (res.ok) {
        const data = await res.json();
        setAvailableCities(data.cities || []);
        setAvailableStates(data.states || []);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // Add a new section (TripStop)
  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId || !stopStartDate || !stopEndDate) {
      setError("Please select a city and date range for this section.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: selectedCityId,
          startDate: stopStartDate,
          endDate: stopEndDate,
          sectionBudget: sectionBudget ? parseFloat(sectionBudget) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add section.");

      setStops([...stops, data.stop]);
      setShowAddModal(false);
      setSelectedCityId("");
      setSectionBudget("");
      setCitySearch("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reorder sections in state and persist to DB
  const moveSection = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    // Update orderIndex values
    const updatedStops = newStops.map((stop, i) => ({
      ...stop,
      orderIndex: i,
    }));

    setStops(updatedStops);

    // Persist to database
    try {
      await fetch(`/api/trips/${tripId}/stops/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stops: updatedStops.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
        }),
      });
    } catch (err) {
      console.error("Error reordering sections:", err);
    }
  };

  // Delete section
  const handleDeleteStop = async (stopId: string) => {
    if (!confirm("Are you sure you want to remove this city section?")) return;

    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStops(stops.filter((s) => s.id !== stopId));
      }
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const filteredCities = availableCities.filter((c) => {
    // Filter by Region
    if (selectedRegion === "india" && c.country !== "India") return false;
    if (selectedRegion === "international" && c.country === "India") return false;

    // Filter by State if in India
    if (selectedRegion === "india" && selectedState !== "all" && c.state !== selectedState) {
      return false;
    }

    // Filter by search string
    if (citySearch) {
      const searchLower = citySearch.toLowerCase();
      const matchName = c.name.toLowerCase().includes(searchLower);
      const matchState = c.state?.toLowerCase().includes(searchLower);
      const matchCountry = c.country.toLowerCase().includes(searchLower);
      if (!matchName && !matchState && !matchCountry) return false;
    }

    return true;
  });

  const selectedCityObj = availableCities.find((c) => c.id === selectedCityId);

  // Total section budget sum
  const totalSectionBudget = stops.reduce(
    (acc, curr) => acc + (Number(curr.sectionBudget) || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading itinerary builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Summary Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 relative overflow-hidden gradient-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <ListOrdered className="w-3.5 h-3.5" />
                Section Builder
              </div>
              <h1 className="text-3xl font-bold text-white">{trip?.name}</h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {trip && new Date(trip.startDate).toLocaleDateString()} —{" "}
                {trip && new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl glass-card border border-slate-700/80 text-right">
                <span className="text-xs text-slate-400 block">Total Allocated Budget</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(totalSectionBudget, stops[0]?.city?.country || (selectedRegion === "india" ? "India" : "USA"))}
                </span>
              </div>

              <Link
                href={`/trips/${tripId}/itinerary`}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Itinerary</span>
              </Link>

              <Link
                href={`/trips/${tripId}/calendar`}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar View</span>
              </Link>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/trips/${tripId}/share`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isPublic: !isPublic }),
                    });
                    if (res.ok) {
                      setIsPublic(!isPublic);
                    }
                  } catch (err) {
                    console.error("Error toggling visibility:", err);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isPublic
                    ? "text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/30"
                    : "text-slate-400 bg-slate-800/60 hover:bg-slate-800 border-slate-700/50"
                }`}
              >
                {isPublic ? (
                  <><Globe className="w-4 h-4" /><span>Public</span></>
                ) : (
                  <><Lock className="w-4 h-4" /><span>Private</span></>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section List Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Trip Sections ({stops.length})
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {/* Sections List */}
        {stops.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 my-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No City Sections Added Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Add your first city stop to begin configuring dates, section budgets, and activities.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Section</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div
                key={stop.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Reorder Buttons & Section Number */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1 rounded bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === stops.length - 1}
                      title="Move Down"
                      className="p-1 rounded bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 font-mono text-sm shrink-0">
                    #{index + 1}
                  </div>

                  {/* City Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{stop.city.name}</h3>
                      <span className="text-xs text-slate-400">({stop.city.country})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        Cost Index: {stop.city.costIndex}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {new Date(stop.startDate).toLocaleDateString()} —{" "}
                        {new Date(stop.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Budget & Actions */}
                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                      Section Budget
                    </span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {formatCurrency(stop.sectionBudget || 0, stop.city.country)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteStop(stop.id)}
                    title="Delete Section"
                    className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Section Modal / Drawer */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add City Section
              </h2>

              <form onSubmit={handleAddStop} className="space-y-4">
                {/* Directive 2.0: Inside India vs Outside India Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Destination Region *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRegion("india");
                        setSelectedCityId("");
                        setSelectedState("all");
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                        selectedRegion === "india"
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25"
                          : "bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white"
                      }`}
                    >
                      <span>🇮🇳 Inside India</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRegion("international");
                        setSelectedCityId("");
                        setSelectedState("all");
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                        selectedRegion === "international"
                          ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25"
                          : "bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white"
                      }`}
                    >
                      <span>✈️ Outside India</span>
                    </button>
                  </div>
                </div>

                {/* Directive 2.1: State Selection Dropdown for Inside India */}
                {selectedRegion === "india" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select State of India *
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCityId("");
                      }}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">-- All States of India ({availableStates.length} States) --</option>
                      {availableStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Searchable City / Place Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Place / City *
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all"
                    >
                      <span className={selectedCityObj ? "text-white font-medium" : "text-slate-500"}>
                        {selectedCityObj
                          ? `${selectedCityObj.name}${selectedCityObj.state ? `, ${selectedCityObj.state}` : ""}, ${selectedCityObj.country} (${getCurrencySymbol(selectedCityObj.country)})`
                          : `-- Select a place in ${selectedRegion === "india" ? (selectedState !== "all" ? selectedState : "India") : "International Destinations"} --`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>

                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-2xl p-2 border border-slate-700 shadow-2xl z-50 max-h-60 overflow-y-auto">
                        <div className="relative p-2 sticky top-0 bg-[#0b0f17]">
                          <Search className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            placeholder="Filter places by name..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {filteredCities.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 text-center">No matching places found</div>
                        ) : (
                          filteredCities.map((city) => (
                            <div
                              key={city.id}
                              onClick={() => {
                                setSelectedCityId(city.id);
                                setDropdownOpen(false);
                              }}
                              className="p-2.5 rounded-xl hover:bg-indigo-600/20 text-xs text-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div>
                                <span className="font-semibold text-white">{city.name}</span>
                                {city.state && <span className="text-indigo-300 ml-1">({city.state})</span>}
                                <span className="text-slate-400 ml-1.5">({city.country})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {city._count?.activities !== undefined && (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono">
                                    {city._count.activities} Activities
                                  </span>
                                )}
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                  {getCurrencySymbol(city.country)}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Section Budget */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Section Budget (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500 font-mono">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={sectionBudget}
                      onChange={(e) => setSectionBudget(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add Section"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
