"use client";

import { useState } from "react";
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";

const mockEvents = [
  { id: "e1", name: "Coldplay: Music of the Spheres", type: "Music", date: "Nov 15, 2026", venue: "Wankhede Stadium", status: "Active", sold: "45,000 / 50,000", revenue: "₹22.5Cr" },
  { id: "e2", name: "Avengers: Secret Wars", type: "Movie", date: "Dec 25, 2026", venue: "Global Theaters", status: "Active", sold: "12,000 / 15,000", revenue: "₹3.6Cr" },
  { id: "e3", name: "India vs Australia T20", type: "Sports", date: "Jan 10, 2027", venue: "Eden Gardens", status: "Upcoming", sold: "10,000 / 65,000", revenue: "₹1.5Cr" },
  { id: "e4", name: "Ed Sheeran Tour", type: "Music", date: "Feb 14, 2027", venue: "Jio World Drive", status: "Draft", sold: "0 / 20,000", revenue: "₹0" },
  { id: "e5", name: "Spider-Man: Beyond the Spider-Verse", type: "Movie", date: "Mar 05, 2027", venue: "PVR Cinemas", status: "Active", sold: "8,500 / 10,000", revenue: "₹2.1Cr" },
];

export default function AdminEventsPage() {
  const [search, setSearch] = useState("");

  const filteredEvents = mockEvents.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Platform Events</h2>
          <p className="text-white/40 mt-1">Manage global events, movies, and sports fixtures.</p>
        </div>
        <button className="bg-[#1D8EFF] hover:bg-[#026CDF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(29,142,255,0.4)] hover:shadow-[0_4px_25px_rgba(2,108,223,0.6)] hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by event name or type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors text-white font-medium">
          <Filter className="w-4 h-4 text-white/60" />
          Filters
        </button>
      </div>

      {/* Table grid */}
      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Event Name</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Date / Venue</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Tickets Sold</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{event.name}</div>
                    <div className="text-xs text-white/40 font-medium">ID: {event.id.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#111D35] border border-white/[0.08] text-white/70">
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white/80 font-medium">{event.date}</div>
                    <div className="text-xs text-white/40">{event.venue}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-white/80">{event.sold}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-400">{event.revenue}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${
                      event.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      event.status === 'Upcoming' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'Active' ? 'bg-emerald-400' : event.status === 'Upcoming' ? 'bg-amber-400' : 'bg-white/40'}`} />
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
           <span className="text-sm text-white/40">Showing 1 to {filteredEvents.length} of {mockEvents.length} entries</span>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 rounded-lg bg-[#111D35] text-white/30 text-sm font-medium border border-white/[0.05] cursor-not-allowed">Previous</button>
             <button className="px-3 py-1.5 rounded-lg bg-[#111D35] text-white/80 hover:bg-white/[0.05] hover:text-white text-sm font-medium border border-white/[0.08] transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
