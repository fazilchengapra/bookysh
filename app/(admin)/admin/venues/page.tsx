"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Plus, Maximize2, X } from "lucide-react";

const mockVenues = [
  { id: "v1", name: "Wankhede Stadium", city: "Mumbai", capacity: "33,108", type: "Stadium", sportType: "cricket", activeEvents: 12 },
  { id: "v2", name: "Salt Lake Stadium", city: "Kolkata", capacity: "85,000", type: "Stadium", sportType: "football", activeEvents: 4 },
  { id: "v3", name: "PVR Director's Cut", city: "Delhi", capacity: "1,200", type: "Theater", sportType: "default", activeEvents: 45 },
  { id: "v4", name: "Jio World Drive Arena", city: "Mumbai", capacity: "15,000", type: "Arena", sportType: "music", activeEvents: 8 },
  { id: "v5", name: "Indira Gandhi Indoor", city: "Delhi", capacity: "14,348", type: "Arena", sportType: "basketball", activeEvents: 3 },
  { id: "v6", name: "INOX Megaplex", city: "Mumbai", capacity: "2,500", type: "Theater", sportType: "default", activeEvents: 60 },
];

export default function AdminVenuesPage() {
  const [search, setSearch] = useState("");
  const [previewVenue, setPreviewVenue] = useState<string | null>(null);

  const filteredVenues = mockVenues.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">System Venues</h2>
          <p className="text-white/40 mt-1">Manage global theaters, stadiums, and their interactive seating structures.</p>
        </div>
        <Link 
          href="/admin/venues/new"
          className="bg-[#1D8EFF] hover:bg-[#026CDF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(29,142,255,0.4)] hover:shadow-[0_4px_25px_rgba(2,108,223,0.6)] hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add New Venue
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input 
          type="text" 
          placeholder="Search venues by name or city..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg bg-[#0A0F1E] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="group bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:bg-[#0A0F1E] hover:border-white/[0.1] transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 ${
              venue.type === "Stadium" ? "bg-emerald-500" :
              venue.type === "Theater" ? "bg-purple-500" : "bg-blue-500"
            }`} />
            
            <div className="flex items-start justify-between mb-4 mt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/40" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{venue.city}</span>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide border ${
                venue.type === "Stadium" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                venue.type === "Theater" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : 
                "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {venue.type}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={venue.name}>{venue.name}</h3>
            
            <div className="mt-4 grid grid-cols-2 gap-4 flex-1">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Capacity</p>
                <p className="text-lg font-black text-white">{venue.capacity}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Events</p>
                <p className="text-lg font-black text-[#1D8EFF]">{venue.activeEvents}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
              <div className="text-xs font-medium text-white/30">ID: {venue.id.toUpperCase()}</div>
              <button 
                onClick={() => setPreviewVenue(venue.name)}
                className="text-xs font-bold text-white flex items-center gap-1.5 hover:text-[#1D8EFF] transition-colors bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg border border-white/5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Preview Map
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-[#0A0F1E]/50">
          <MapPin className="w-12 h-12 text-white/10 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No venues found</h3>
          <p className="text-white/40 max-w-sm">We couldn't find any venues matching your current search filters.</p>
        </div>
      )}

      {/* Map Preview Modal */}
      {previewVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="w-full max-w-5xl h-full max-h-[85vh] bg-[#0A0F1E] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
             
             {/* Modal Header */}
             <div className="h-16 border-b border-white/10 bg-[#111D35]/50 flex items-center justify-between px-6 shrink-0 z-10">
               <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Layout Preview</h3>
                  <p className="text-sm font-medium text-white/50">{previewVenue}</p>
               </div>
               <button 
                 onClick={() => setPreviewVenue(null)}
                 className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Modal Content - Fake Map Preview since we can't easily import the complex Client component without full data context here in mock */}
             <div className="flex-1 bg-[#111D35] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full border border-white/20 bg-white/5 mx-auto flex items-center justify-center mb-6">
                     <Maximize2 className="w-8 h-8 text-white/30" />
                  </div>
                  <h4 className="text-2xl font-black text-white px-8">{previewVenue} Mock Map Display</h4>
                  <p className="text-white/40 max-w-md mx-auto">
                    The interactive Seat Map Client (`StadiumSeatMapClient`) would render here, fed with specific layout data for the admin to configure zones, blocks, and seats visually.
                  </p>
                  
                  <div className="pt-8 flex justify-center gap-4">
                     <button onClick={() => setPreviewVenue(null)} className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">Close Preview</button>
                     <button className="px-6 py-2.5 rounded-xl bg-[#1D8EFF] text-white font-medium shadow-[0_0_20px_rgba(29,142,255,0.3)] hover:bg-[#026CDF] transition-colors">Edit Layout Structure</button>
                  </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
