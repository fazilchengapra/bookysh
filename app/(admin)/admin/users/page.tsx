"use client";

import { useState } from "react";
import { 
  Search, Filter, UserCheck, UserX, Shield, Mail, Ban,
  MapPin, Calendar, Clock, CreditCard, ChevronRight, X, Smartphone, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Enhanced Mock Data ---
type UserStatus = "Active" | "VIP" | "Suspended" | "Inactive";

interface BookingMin {
  id: string;
  event: string;
  date: string;
  amount: number;
  status: "Confirmed" | "Cancelled";
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  lastLogin: string;
  bookingsCount: number;
  totalSpent: number;
  status: UserStatus;
  recentBookings: BookingMin[];
}

const mockUsers: UserProfile[] = [
  { 
    id: "USR-001", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", location: "Mumbai, MH",
    joined: "Jan 12, 2026", lastLogin: "2 hours ago (IP: 103.1.x.x)", bookingsCount: 14, totalSpent: 45000, status: "Active",
    recentBookings: [
      { id: "BOK-98213", event: "Coldplay: Music of the Spheres", date: "Oct 24, 2026", amount: 18000, status: "Confirmed" },
      { id: "BOK-98001", event: "Dua Lipa Live", date: "Aug 15, 2026", amount: 12000, status: "Confirmed" },
    ]
  },
  { 
    id: "USR-002", name: "Priya Singh", email: "priya.s@example.com", phone: "+91 91234 56789", location: "Delhi, DL",
    joined: "Feb 05, 2026", lastLogin: "1 day ago (IP: 14.139.x.x)", bookingsCount: 3, totalSpent: 2500, status: "Active",
    recentBookings: [
      { id: "BOK-98214", event: "Spider-Man: Beyond the...", date: "Oct 24, 2026", amount: 900, status: "Confirmed" },
    ]
  },
  { 
    id: "USR-003", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 99887 76655", location: "Bangalore, KA",
    joined: "Mar 10, 2026", lastLogin: "20 days ago (IP: 49.207.x.x)", bookingsCount: 8, totalSpent: 28000, status: "Suspended",
    recentBookings: [
       { id: "BOK-98215", event: "India vs Australia T20", date: "Oct 23, 2026", amount: 12000, status: "Cancelled" },
    ]
  },
  { 
    id: "USR-005", name: "Vikram Reddy", email: "vikram.r@example.com", phone: "+91 98765 12345", location: "Hyderabad, TS",
    joined: "May 14, 2026", lastLogin: "Just now (IP: 157.49.x.x)", bookingsCount: 25, totalSpent: 112000, status: "VIP",
    recentBookings: [
      { id: "BOK-98217", event: "Avengers: Secret Wars", date: "Oct 22, 2026", amount: 350, status: "Confirmed" },
      { id: "BOK-98150", event: "F1 Indian Grand Prix", date: "Sep 10, 2026", amount: 45000, status: "Confirmed" },
    ]
  },
];


export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  // Selection / Drawer State
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [drawerUser, setDrawerUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "security">("overview");

  // Filter Logic
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAll = () => {
     if (selectedUserIds.size === filteredUsers.length) {
       setSelectedUserIds(new Set());
     } else {
       setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
     }
  };

  const toggleUser = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedUserIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUserIds(next);
  };

  const openDrawer = (user: UserProfile) => {
     setDrawerUser(user);
     setActiveTab("overview");
  };

  // Mock Actions
  const handleMockAction = (action: string) => {
    if (action === "suspend") {
      const reason = prompt("Enter reason for suspension (Internal Use Only):");
      if (reason) alert(`User suspended. Reason logged: ${reason}`);
    } else {
      alert(`${action} triggered successfully.`);
    }
  };


  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Customer Directory</h2>
          <p className="text-white/40 mt-1">Manage platform customers, view their booking history, and handle account statuses.</p>
        </div>
      </div>

      {/* Toolbar & Select Actions */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0F1E]/80 border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm shadow-xl items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search users by name or email address..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1D8EFF] transition-colors"
          />
        </div>
        
        {selectedUserIds.size > 0 ? (
          <div className="flex items-center gap-3 shrink-0 animate-in zoom-in-95 duration-200">
             <span className="text-sm font-bold text-white/60">{selectedUserIds.size} Selected</span>
             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-colors font-medium text-sm">
                <Mail className="w-4 h-4" /> Bulk Email
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors font-medium text-sm">
                <Ban className="w-4 h-4" /> Suspend
             </button>
          </div>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors text-white font-medium shrink-0">
            <Filter className="w-4 h-4 text-white/60" />
            Filter Options
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-[#0A0F1E]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 w-12">
                   <input type="checkbox" checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-white/20 bg-[#111D35] text-[#1D8EFF]" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Customer Details</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-center">Bookings</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Lifetime Value</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => openDrawer(user)}
                  className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={(e) => toggleUser(e as any, user.id)} className="w-4 h-4 rounded border-white/20 bg-[#111D35] text-[#1D8EFF]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D8EFF] to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
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
                  <td className="px-6 py-4 text-center text-sm font-bold text-white">
                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                      {user.bookingsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-400">₹{user.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      user.status === 'VIP' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                      user.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {user.status === 'VIP' && <Shield className="w-3 h-3" />}
                      {user.status === 'Suspended' && <AlertTriangle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Out Profile Drawer ── */}
      {drawerUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
           {/* Backdrop overlay */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={() => setDrawerUser(null)} />
           
           {/* Drawer Panel */}
           <div className="relative w-full max-w-xl h-full bg-[#0A0F1E] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300">
               
               {/* Drawer Header */}
               <div className="p-6 border-b border-white/[0.06] flex items-start justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1D8EFF] to-purple-600 p-0.5 shadow-xl">
                        <div className="w-full h-full bg-[#0A0F1E] rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                           {drawerUser.name.charAt(0)}
                        </div>
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-white leading-tight">{drawerUser.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/40 font-mono bg-white/5 px-2 py-0.5 rounded">{drawerUser.id}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${drawerUser.status === 'VIP' ? 'text-purple-400 bg-purple-500/20' : drawerUser.status === 'Suspended' ? 'text-red-400 bg-red-500/20' : 'text-emerald-400 bg-emerald-500/20'}`}>
                            {drawerUser.status}
                          </span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setDrawerUser(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Drawer Nav Tabs */}
               <div className="flex px-6 border-b border-white/[0.06] gap-6">
                  {["overview", "bookings", "security"].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${
                        activeTab === tab 
                         ? "border-[#1D8EFF] text-[#1D8EFF]" 
                         : "border-transparent text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

               {/* Drawer Content Body */}
               <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
                  
                  {activeTab === "overview" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                       {/* Quick Stats */}
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#111D35] p-4 rounded-2xl border border-white/[0.05]">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> Lifetime Value</p>
                            <p className="text-2xl font-black text-emerald-400">₹{drawerUser.totalSpent.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="bg-[#111D35] p-4 rounded-2xl border border-white/[0.05]">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Total Bookings</p>
                            <p className="text-2xl font-black text-white">{drawerUser.bookingsCount}</p>
                          </div>
                       </div>

                       {/* Contact Info */}
                       <div>
                         <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Contact Information</h4>
                         <div className="space-y-2 bg-[#111D35] p-4 rounded-2xl border border-white/[0.05]">
                            <div className="flex items-center gap-3 p-2">
                               <Mail className="w-4 h-4 text-white/30" />
                               <span className="text-sm font-medium text-white">{drawerUser.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2">
                               <Smartphone className="w-4 h-4 text-white/30" />
                               <span className="text-sm font-medium text-white">{drawerUser.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2">
                               <MapPin className="w-4 h-4 text-white/30" />
                               <span className="text-sm font-medium text-white">{drawerUser.location}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2">
                               <Clock className="w-4 h-4 text-white/30" />
                               <div className="flex flex-col">
                                 <span className="text-xs text-white/40">Joined {drawerUser.joined}</span>
                                 <span className="text-[10px] text-white/30">Last Login: {drawerUser.lastLogin}</span>
                               </div>
                            </div>
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "bookings" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                       <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Recent Transactions</h4>
                       {drawerUser.recentBookings.length > 0 ? drawerUser.recentBookings.map(bk => (
                         <div key={bk.id} className="bg-[#111D35] p-4 rounded-2xl border border-white/[0.05] flex items-center justify-between group hover:border-white/10 transition-colors">
                            <div>
                               <p className="text-sm font-bold text-white mb-0.5">{bk.event}</p>
                               <div className="flex items-center gap-3 text-xs text-white/40">
                                  <span>{bk.id}</span>
                                  <span>•</span>
                                  <span>{bk.date}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-emerald-400 mb-0.5">₹{bk.amount.toLocaleString('en-IN')}</p>
                               <span className={`text-[10px] font-bold uppercase ${bk.status === 'Confirmed' ? 'text-emerald-500' : 'text-red-500'}`}>{bk.status}</span>
                            </div>
                         </div>
                       )) : (
                         <p className="text-sm text-white/40 text-center py-8">No recent bookings found for this user.</p>
                       )}
                       
                       {drawerUser.bookingsCount > drawerUser.recentBookings.length && (
                         <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-bold rounded-xl transition-colors border border-white/5">
                           View All {drawerUser.bookingsCount} Bookings
                         </button>
                       )}
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                       
                       <div className="space-y-3">
                         <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Account Actions</h4>
                         
                         {drawerUser.status !== "VIP" && (
                           <button onClick={() => handleMockAction('Upgrade to VIP')} className="w-full flex items-center justify-between p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-2xl transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Shield className="w-4 h-4 text-purple-400" /></div>
                                 <div className="text-left">
                                   <p className="text-sm font-bold text-purple-400">Upgrade to VIP Status</p>
                                   <p className="text-[10px] text-purple-400/60">Grants priority booking access.</p>
                                 </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-purple-400/50 group-hover:text-purple-400 transition-colors" />
                           </button>
                         )}

                         <button onClick={() => handleMockAction('Send Password Reset')} className="w-full flex items-center justify-between p-4 bg-[#111D35] hover:bg-white/10 border border-white/5 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail className="w-4 h-4 text-white/60" /></div>
                               <div className="text-left">
                                 <p className="text-sm font-bold text-white/90">Force Password Reset</p>
                                 <p className="text-[10px] text-white/40">Sends a secure reset link via email.</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                         </button>
                       </div>

                       <div className="pt-6 border-t border-red-500/20 space-y-3">
                         <h4 className="text-xs font-bold text-red-500/60 uppercase tracking-widest mb-2">Danger Zone</h4>
                         
                         {drawerUser.status !== "Suspended" ? (
                           <button onClick={() => handleMockAction('suspend')} className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center"><Ban className="w-4 h-4 text-red-500" /></div>
                                 <div className="text-left">
                                   <p className="text-sm font-bold text-red-500">Suspend Account</p>
                                   <p className="text-[10px] text-red-500/60">Temporarily block login and booking capabilities.</p>
                                 </div>
                              </div>
                           </button>
                         ) : (
                           <button onClick={() => handleMockAction('reactivate')} className="w-full flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><UserCheck className="w-4 h-4 text-emerald-400" /></div>
                                 <div className="text-left">
                                   <p className="text-sm font-bold text-emerald-400">Reactivate Account</p>
                                   <p className="text-[10px] text-emerald-400/60">Restore all privileges to user.</p>
                                 </div>
                              </div>
                           </button>
                         )}
                       </div>

                    </div>
                  )}

               </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
