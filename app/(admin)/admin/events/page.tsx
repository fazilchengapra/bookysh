"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, Filter, Plus, Calendar as CalendarIcon, MapPin, Ticket, 
  MoreHorizontal, Play, Music, Trophy, Edit2, Trash2, CheckCircle, XCircle, Building, AlertCircle, X
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Enhanced Mock Data ---
type EventStatus = "Active" | "Pending" | "Past";

interface VendorDetails {
  name: string;
  contact: string;
  commission: string;
}

interface EventData {
  id: string;
  title: string;
  type: "Movie" | "Music" | "Sports";
  date: string;
  venue: string;
  ticketsSold: string;
  revenue: string;
  status: EventStatus;
  requestedBy?: VendorDetails;
  suggestedDetails?: string;
}

const mockEvents: EventData[] = [
  { id: "EVT-101", title: "Spider-Man: Beyond the Spider-Verse", type: "Movie", date: "Oct 24, 2026", venue: "Multiple Theaters", ticketsSold: "4,500/10,000", revenue: "₹12,45,000", status: "Active" },
  { id: "EVT-102", title: "Coldplay: Music of the Spheres World Tour", type: "Music", date: "Nov 15, 2026", venue: "DY Patil Stadium", ticketsSold: "45,000/50,000", revenue: "₹4,50,00,000", status: "Active" },
  { id: "EVT-103", title: "India vs Australia - Border Gavaskar Trophy", type: "Sports", date: "Dec 05, 2026", venue: "Wankhede Stadium", ticketsSold: "32,000/33,000", revenue: "₹3,20,00,000", status: "Active" },
  { id: "EVT-104", title: "Dua Lipa Live in Mumbai", type: "Music", date: "Jan 12, 2027", venue: "Jio World Garden", ticketsSold: "12,000/15,000", revenue: "₹85,00,000", status: "Active" },
  { id: "EVT-105", title: "Avengers: Secret Wars", type: "Movie", date: "May 01, 2027", venue: "Multiple Theaters", ticketsSold: "0/20,000", revenue: "₹0", status: "Active" },
  { id: "EVT-106", title: "Pro Kabaddi League Finals", type: "Sports", date: "Feb 20, 2027", venue: "Sardar Vallabhbhai Patel Stadium", ticketsSold: "8,000/10,000", revenue: "₹40,00,000", status: "Active" },
  
  // Pending Vendor Requests
  { 
    id: "EVT-201", title: "Arijit Singh - Soulful Tour 2027", type: "Music", date: "Mar 15, 2027", venue: "Salt Lake Stadium", ticketsSold: "-", revenue: "-", status: "Pending",
    requestedBy: { name: "Live Nation India", contact: "events@livenation.in", commission: "12% Platform Fee" },
    suggestedDetails: "Massive 3-hour concert. Requesting VIP Zones and Standard seating block generation."
  },
  { 
    id: "EVT-202", title: "Pushpa 3: The Rule (Premiere)", type: "Movie", date: "Apr 10, 2027", venue: "PVR Director's Cut", ticketsSold: "-", revenue: "-", status: "Pending",
    requestedBy: { name: "Mythri Movie Makers", contact: "distro@mythri.com", commission: "8% Platform Fee" },
    suggestedDetails: "Exclusive premiere screening. Requesting premium recliner pricing configuration."
  },
];


export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<EventStatus>("Active");

  // Approval Drawer State
  const [drawerEvent, setDrawerEvent] = useState<EventData | null>(null);

  // Filter Logic
  const filteredEvents = mockEvents.filter(e => {
    const matchesTab = e.status === activeTab;
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Movie': return <Play className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Sports': return <Trophy className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Movie': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Music': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Sports': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const handleApprovalAction = (action: "Approve" | "Reject") => {
     if (!drawerEvent) return;
     const confirmPrompt = action === "Approve" 
       ? `Are you sure you want to PUBLISH '${drawerEvent.title}' to the platform?` 
       : `Are you sure you want to REJECT '${drawerEvent.title}'?`;
     
     if (confirm(confirmPrompt)) {
       alert(`Event ${action}d successfully. (Mock Action)`);
       setDrawerEvent(null);
     }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Global Events Log</h2>
          <p className="text-white/40 mt-1">Manage created events, ticket sales, and review B2B vendor requests.</p>
        </div>
        <Link 
          href="/admin/events/new"
          className="bg-[#1D8EFF] hover:bg-[#026CDF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(29,142,255,0.4)] hover:shadow-[0_4px_25px_rgba(2,108,223,0.6)] hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex px-2 border-b border-white/[0.06] gap-8">
        {(["Active", "Pending", "Past"] as EventStatus[]).map(tab => {
          const count = mockEvents.filter(e => e.status === tab).length;
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab 
                 ? "border-[#1D8EFF] text-[#1D8EFF]" 
                 : "border-transparent text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {tab} Events
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                activeTab === tab ? "bg-[#1D8EFF]/20 text-[#1D8EFF]" : "bg-white/5 text-white/40"
              }`}>
                {count}
              </span>
              {tab === "Pending" && count > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-4 right-0 animate-ping" />}
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search events by title or venue..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors text-white font-medium">
          <Filter className="w-4 h-4 text-white/60" />
          Filter Type
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Event Name & Type</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Date & Venue</th>
                {activeTab === "Active" && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Tickets Sold</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Revenue</th>
                  </>
                )}
                {activeTab === "Pending" && (
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Requesting Organization</th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredEvents.map((event) => (
                <tr 
                  key={event.id} 
                  className={`transition-colors group ${activeTab === "Pending" ? "cursor-pointer hover:bg-[#1D8EFF]/[0.02]" : "hover:bg-white/[0.02]"}`}
                  onClick={() => event.status === "Pending" ? setDrawerEvent(event) : null}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm mb-1">{event.title}</div>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-bold ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                      {event.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                        <CalendarIcon className="w-4 h-4 text-white/40" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.venue}
                      </div>
                    </div>
                  </td>

                  {activeTab === "Active" && (
                     <>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-sm font-bold text-white">
                            <Ticket className="w-4 h-4 text-amber-500" />
                            {event.ticketsSold}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-black text-emerald-400">
                          {event.revenue}
                        </td>
                     </>
                  )}

                  {activeTab === "Pending" && (
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Building className="w-3 h-3 text-white/60" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{event.requestedBy?.name}</div>
                            <div className="text-[10px] text-white/40 font-mono tracking-wide">{event.id}</div>
                          </div>
                       </div>
                     </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {activeTab === "Active" ? (
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-white transition-colors" title="Edit Event">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Cancel/Delete Event">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    ) : (
                       <div className="flex justify-end items-center gap-3">
                          <span className="text-xs font-bold text-[#1D8EFF] bg-[#1D8EFF]/10 border border-[#1D8EFF]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 group-hover:bg-[#1D8EFF] group-hover:text-white transition-colors shadow-lg">
                            Review Request
                            <MoreHorizontal className="w-3 h-3" />
                          </span>
                       </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No {activeTab.toLowerCase()} events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Out Vendor Review Drawer ── */}
      {drawerEvent && (
        <div className="fixed inset-0 z-50 flex justify-end">
           {/* Backdrop overlay */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={() => setDrawerEvent(null)} />
           
           {/* Drawer Panel */}
           <div className="relative w-full max-w-xl h-full bg-[#0A0F1E] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300">
               
               {/* Drawer Header */}
               <div className="p-6 border-b border-white/[0.06] flex items-start justify-between bg-gradient-to-b from-[#1D8EFF]/[0.03] to-transparent">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <AlertCircle className="w-7 h-7" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-white leading-tight">Pending Event Approval</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/40 font-mono bg-white/5 px-2 py-0.5 rounded">{drawerEvent.id}</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setDrawerEvent(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Drawer Content Body */}
               <div className="flex-1 overflow-y-auto p-6 scrollbar-none space-y-8">
                  
                  {/* Event Details Box */}
                  <div>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Proposed Event Details</h4>
                    <div className="bg-[#111D35] p-5 rounded-2xl border border-white/[0.05] space-y-4">
                       <div>
                         <p className="text-[10px] text-white/40 uppercase font-black mb-1">Title</p>
                         <p className="text-lg font-bold text-white">{drawerEvent.title}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase font-black mb-1">Category</p>
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-bold ${getEventColor(drawerEvent.type)}`}>
                              {getEventIcon(drawerEvent.type)}
                              {drawerEvent.type}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase font-black mb-1">Date</p>
                            <p className="text-sm font-medium text-white">{drawerEvent.date}</p>
                          </div>
                       </div>
                       <div>
                         <p className="text-[10px] text-white/40 uppercase font-black mb-1">Target Venue</p>
                         <div className="flex items-center gap-2 text-sm text-white/80 bg-black/20 p-2 rounded-lg border border-white/5">
                            <MapPin className="w-4 h-4 text-white/40" />
                            {drawerEvent.venue}
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Vendor Details Box */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1D8EFF]/70 uppercase tracking-widest mb-3 flex items-center gap-2"><Building className="w-3.5 h-3.5" /> Requesting Vendor</h4>
                    <div className="bg-[#1D8EFF]/5 p-5 rounded-2xl border border-[#1D8EFF]/10 space-y-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D8EFF]/10 rounded-full blur-[40px] pointer-events-none" />
                       
                       <div className="flex justify-between items-center bg-[#0A0F1E]/50 p-3 rounded-xl border border-white/5">
                          <div>
                             <p className="text-sm font-black text-white">{drawerEvent.requestedBy?.name}</p>
                             <p className="text-xs text-white/40 mt-0.5">{drawerEvent.requestedBy?.contact}</p>
                          </div>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{drawerEvent.requestedBy?.commission}</span>
                       </div>

                       <div>
                         <p className="text-[10px] text-white/40 uppercase font-black mb-1.5">Additional Context / Requests</p>
                         <p className="text-sm text-white/70 italic bg-[#0A0F1E]/50 p-3 rounded-xl border border-white/5 leading-relaxed">
                           &#34;{drawerEvent.suggestedDetails}&#34;
                         </p>
                       </div>
                    </div>
                  </div>

               </div>

               {/* Drawer Footer Actions */}
               <div className="p-6 border-t border-white/[0.06] bg-[#0A0F1E] flex gap-4">
                  <button 
                    onClick={() => handleApprovalAction("Reject")}
                    className="flex-1 py-3.5 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Request
                  </button>
                  <button 
                    onClick={() => handleApprovalAction("Approve")}
                    className="flex-[2] py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Configure Layout
                  </button>
               </div>

           </div>
        </div>
      )}
      
    </div>
  );
}
