"use client";

import { Activity, CreditCard, DollarSign, Users, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", revenue: 4000, bookings: 2400 },
  { name: "Feb", revenue: 3000, bookings: 1398 },
  { name: "Mar", revenue: 2000, bookings: 9800 },
  { name: "Apr", revenue: 2780, bookings: 3908 },
  { name: "May", revenue: 1890, bookings: 4800 },
  { name: "Jun", revenue: 2390, bookings: 3800 },
  { name: "Jul", revenue: 3490, bookings: 4300 },
  { name: "Aug", revenue: 4000, bookings: 5400 },
  { name: "Sep", revenue: 4900, bookings: 6100 },
  { name: "Oct", revenue: 5300, bookings: 6800 },
  { name: "Nov", revenue: 6200, bookings: 7500 },
  { name: "Dec", revenue: 7500, bookings: 8900 },
];

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-[#080C15] min-h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">System Global Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl backdrop-blur-md">
            Overview: <span className="text-emerald-400">All Time</span>
          </div>
        </div>
      </div>
      
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", value: "₹12,45,689", change: "+20.1%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Platform Vendors", value: "+2,350", change: "+180 new", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { title: "Active Bookings", value: "+12,234", change: "+19.0%", icon: CreditCard, color: "text-purple-400", bg: "bg-purple-500/10" },
          { title: "Active Events", value: "+573", change: "+201 this week", icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0A0F1E]/80 backdrop-blur-sm shadow-xl p-6 transition-all hover:bg-[#0A0F1E] hover:border-white/[0.1] hover:-translate-y-1">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-white/60">{stat.title}</h3>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change} <span className="text-white/40 ml-1 font-normal">from last month</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts & Activity Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Revenue Chart */}
        <div className="col-span-4 rounded-2xl border border-white/[0.06] bg-[#0A0F1E]/80 backdrop-blur-sm shadow-xl flex flex-col">
          <div className="flex flex-col space-y-1.5 p-6 border-b border-white/[0.04]">
            <h3 className="font-bold text-lg text-white">System Revenue Overview</h3>
            <p className="text-sm text-white/40">Montly revenue generated across all platform vendors.</p>
          </div>
          <div className="p-6 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D8EFF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1D8EFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1D8EFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="col-span-3 rounded-2xl border border-white/[0.06] bg-[#0A0F1E]/80 backdrop-blur-sm shadow-xl flex flex-col">
          <div className="flex flex-col space-y-1.5 p-6 border-b border-white/[0.04]">
            <h3 className="font-bold text-lg text-white">Recent Vendor Onboarding</h3>
            <p className="text-sm text-white/40">15 pending approvals requiring immediate action.</p>
          </div>
          <div className="p-6 pt-2 flex-1 overflow-y-auto">
            <div className="space-y-2 mt-4">
              {[
                { name: "PVR Cinemas", email: "partners@pvrcinemas.com", status: "Approved", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { name: "Wankhede Stadium", email: "admin@wankhede.org", status: "Pending", color: "text-amber-400", bg: "bg-amber-400/10" },
                { name: "Live Nation Tours", email: "onboarding@livenation.com", status: "Review", color: "text-blue-400", bg: "bg-blue-400/10" },
                { name: "BookMyShow Org", email: "integrations@bms.co.in", status: "Approved", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { name: "Salt Lake Stadium", email: "info@saltlake.in", status: "Rejected", color: "text-red-400", bg: "bg-red-400/10" },
              ].map((vendor, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.04]">
                  <div className="w-10 h-10 rounded-full bg-[#111D35] flex items-center justify-center text-white font-bold border border-white/[0.05]">
                    {vendor.name.charAt(0)}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-bold text-white leading-none">{vendor.name}</p>
                    <p className="text-xs text-white/40 font-medium">{vendor.email}</p>
                  </div>
                  <div className={`ml-auto font-bold text-xs px-3 py-1 rounded-full ${vendor.bg} ${vendor.color}`}>
                    {vendor.status}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-sm font-bold transition-all border border-white/[0.05]">
              View All Vendors
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

