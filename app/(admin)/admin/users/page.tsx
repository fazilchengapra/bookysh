"use client";

import { useState } from "react";
import { Search, Filter, UserCheck, UserX, Shield, Mail } from "lucide-react";

const mockUsers = [
  { id: "USR-001", name: "Rahul Sharma", email: "rahul@example.com", joined: "Jan 12, 2026", bookings: 14, totalSpent: "₹45,000", status: "Active" },
  { id: "USR-002", name: "Priya Singh", email: "priya.s@example.com", joined: "Feb 05, 2026", bookings: 3, totalSpent: "₹2,500", status: "Active" },
  { id: "USR-003", name: "Amit Kumar", email: "amit.k@example.com", joined: "Mar 10, 2026", bookings: 8, totalSpent: "₹28,000", status: "Suspended" },
  { id: "USR-004", name: "Neha Gupta", email: "neha.g@example.com", joined: "Apr 22, 2026", bookings: 1, totalSpent: "₹1,200", status: "Active" },
  { id: "USR-005", name: "Vikram Reddy", email: "vikram.r@example.com", joined: "May 14, 2026", bookings: 25, totalSpent: "₹1,12,000", status: "VIP" },
  { id: "USR-006", name: "Ananya Desai", email: "ananya.d@example.com", joined: "Jun 30, 2026", bookings: 0, totalSpent: "₹0", status: "Inactive" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">System Users</h2>
          <p className="text-white/40 mt-1">Manage platform customers, view their booking history, and handle account statuses.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search users by name or email address..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors text-white font-medium">
          <Filter className="w-4 h-4 text-white/60" />
          Filter Options
        </button>
      </div>

      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Customer Details</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-center">Bookings</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Lifetime Value</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D8EFF] to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                         <div className="font-bold text-white text-sm">{user.name}</div>
                         <div className="text-xs text-white/40 font-medium flex items-center gap-1 mt-0.5">
                           <Mail className="w-3 h-3" /> {user.email}
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white/70">{user.joined}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-white">{user.bookings}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-400">{user.totalSpent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      user.status === 'VIP' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                      user.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {user.status === 'VIP' && <Shield className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.status === 'Suspended' ? (
                        <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors" title="Activate User">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Suspend User">
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
