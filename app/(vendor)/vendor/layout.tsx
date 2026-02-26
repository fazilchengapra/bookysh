import Link from "next/link";
import { LayoutDashboard, CalendarDays, MapPin, Ticket, BarChart3, Settings } from "lucide-react";

const navItems = [
  { href:"/vendor",         icon:LayoutDashboard, label:"Overview"            },
  { href:"/vendor/events",  icon:CalendarDays,    label:"My Events"           },
  { href:"/vendor/venues",  icon:MapPin,          label:"Venues & Seat Maps"  },
  { href:"/vendor/orders",  icon:Ticket,          label:"Orders & Attendees"  },
  { href:"/vendor/reports", icon:BarChart3,       label:"Financial Reports"   },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080C15] text-white">
      <aside className="hidden md:flex w-60 flex-col border-r border-white/[0.07] bg-[#0A0F1E] fixed h-full z-40">
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/[0.07]">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
            <Ticket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            Bokysh <span className="text-[#06B6D4]">Vendor</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-[#026CDF]/[0.08] transition-all"
            >
              <Icon className="w-4 h-4 group-hover:text-[#1D8EFF] transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.07] space-y-1">
          <Link
            href="/vendor/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-[#026CDF]/[0.08] transition-all"
          >
            <Settings className="w-4 h-4 group-hover:text-[#1D8EFF] transition-colors" />
            Profile & Settings
          </Link>
          <div className="mt-1 p-3 rounded-xl bg-[#026CDF]/[0.06] border border-[#026CDF]/[0.15]">
            <p className="text-[10px] font-semibold text-white/40">Logged in as</p>
            <p className="text-sm font-bold text-white mt-0.5">My Venue LLC</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              ✓ Verified Vendor
            </span>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-60 flex flex-col">
        <header className="h-14 border-b border-white/[0.07] bg-[#0A0F1E]/90 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <span className="text-sm font-semibold text-white/40">Vendor Portal</span>
          <button className="flex items-center gap-2 px-4 py-1.5 gradient-brand text-white text-sm font-bold rounded-lg hover:opacity-90 glow-blue-sm transition-all">
            + Create Event
          </button>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
