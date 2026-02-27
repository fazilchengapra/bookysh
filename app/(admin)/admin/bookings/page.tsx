"use client";

import { useState } from "react";
import { Search, Filter, Download, Eye, Ban, CheckCircle } from "lucide-react";

const mockBookings = [
  { id: "BOK-98213", user: "Rahul Sharma", email: "rahul@example.com", event: "Coldplay: Music of the Spheres", type: "Music", seats: "VIP Standing (x2)", amount: "₹18,000", date: "Oct 24, 2026", status: "Confirmed" },
  { id: "BOK-98214", user: "Priya Singh", email: "priya.s@example.com", event: "Spider-Man: Beyond the...", type: "Movie", seats: "Diamond L12, L13", amount: "₹900", date: "Oct 24, 2026", status: "Confirmed" },
  { id: "BOK-98215", user: "Amit Kumar", email: "amit.k@example.com", event: "India vs Australia T20", type: "Sports", seats: "North Stand (x4)", amount: "₹12,000", date: "Oct 23, 2026", status: "Pending" },
  { id: "BOK-98216", user: "Neha Gupta", email: "neha.g@example.com", event: "Ed Sheeran Tour", type: "Music", seats: "General Admission (x1)", amount: "₹4,500", date: "Oct 23, 2026", status: "Cancelled" },
  { id: "BOK-98217", user: "Vikram Reddy", email: "vikram.r@example.com", event: "Avengers: Secret Wars", type: "Movie", seats: "Premium M10", amount: "₹350", date: "Oct 22, 2026", status: "Confirmed" },
  { id: "BOK-98218", user: "Ananya Desai", email: "ananya.d@example.com", event: "India vs Australia T20", type: "Sports", seats: "Pavilion End (x2)", amount: "₹24,000", date: "Oct 22, 2026", status: "Confirmed" },
];

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBookings = mockBookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(search.toLowerCase()) || 
                          b.user.toLowerCase().includes(search.toLowerCase()) || 
                          b.event.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Global Bookings Ledger</h2>
          <p className="text-white/40 mt-1">Review all transactions, tickets, and revenue on the platform.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by ID, User, or Event name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
        
        <div className="flex border border-white/10 rounded-xl overflow-hidden bg-[#111D35]">
           {["All", "Confirmed", "Pending", "Cancelled"].map(stat => (
             <button 
               key={stat}
               onClick={() => setStatusFilter(stat)}
               className={`px-4 py-2.5 text-sm font-bold transition-colors ${
                 statusFilter === stat 
                  ? "bg-[#1D8EFF] text-white shadow-inner" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
               }`}
             >
               {stat}
             </button>
           ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Event Details</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Date Booked</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{booking.id}</div>
                    <div className={`text-xs mt-1 px-2 py-0.5 rounded border inline-block ${
                      booking.type === 'Movie' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      booking.type === 'Sports' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {booking.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{booking.user}</div>
                    <div className="text-xs text-white/40 font-medium">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white w-48 truncate" title={booking.event}>{booking.event}</div>
                    <div className="text-xs text-white/50">{booking.seats}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white/70">{booking.date}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-400">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${
                      booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {booking.status === 'Confirmed' && <CheckCircle className="w-3 h-3" />}
                      {booking.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      {booking.status === 'Cancelled' && <Ban className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-white transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status !== "Cancelled" && (
                         <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Cancel Booking">
                           <Ban className="w-4 h-4" />
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
           <span className="text-sm text-white/40">Showing 1 to {filteredBookings.length} of {mockBookings.length} entries</span>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 rounded-lg bg-[#111D35] text-white/30 text-sm font-medium border border-white/[0.05] cursor-not-allowed">Previous</button>
             <button className="px-3 py-1.5 rounded-lg bg-[#111D35] text-white/80 hover:bg-white/[0.05] hover:text-white text-sm font-medium border border-white/[0.08] transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
