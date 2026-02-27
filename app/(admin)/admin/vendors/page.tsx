"use client";

import { useState } from "react";
import { Search, Plus, Building, Link as LinkIcon, Edit2, ShieldCheck, Ban } from "lucide-react";

const mockVendors = [
  { id: "VND-101", name: "PVR Cinemas", email: "partners@pvrcinemas.com", type: "Theater Chain", mappedVenues: 45, status: "Active" },
  { id: "VND-102", name: "BCCI Events", email: "events@bcci.tv", type: "Sports Board", mappedVenues: 12, status: "Active" },
  { id: "VND-103", name: "Live Nation India", email: "onboarding@livenation.in", type: "Event Organizer", mappedVenues: 8, status: "Pending" },
  { id: "VND-104", name: "BookMyShow Org", email: "integrations@bms.co.in", type: "Aggregator", mappedVenues: 120, status: "Active" },
  { id: "VND-105", name: "Carnival Cinemas", email: "admin@carnival.com", type: "Theater Chain", mappedVenues: 2, status: "Suspended" },
];

export default function AdminVendorsPage() {
  const [search, setSearch] = useState("");

  const filteredVendors = mockVendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Platform Vendors</h2>
          <p className="text-white/40 mt-1">Manage B2B partners, event organizers, and venue owners.</p>
        </div>
        <button className="bg-[#1D8EFF] hover:bg-[#026CDF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(29,142,255,0.4)] hover:shadow-[0_4px_25px_rgba(2,108,223,0.6)] hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          Onboard Vendor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search vendors by company name or type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Organization</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-center">Mapped Venues</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">API Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-[#111D35] border border-white/10 flex items-center justify-center text-white/70">
                          <Building className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="font-bold text-white text-sm">{vendor.name}</div>
                         <div className="text-xs text-white/40 font-medium">{vendor.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#111D35] border border-white/[0.08] text-[#1D8EFF]">
                      {vendor.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-white px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                      {vendor.mappedVenues}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      vendor.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {vendor.status === 'Active' && <ShieldCheck className="w-3 h-3" />}
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-[#1D8EFF] transition-colors" title="Generate API Keys">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/[0.04] hover:bg-white/[0.1] rounded-lg text-white/60 hover:text-white transition-colors" title="Edit Vendor">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {vendor.status !== 'Suspended' && (
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Suspend Vendor">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No vendors found matching your search.
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
