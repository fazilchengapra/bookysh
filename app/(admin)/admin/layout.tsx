import Link from "next/link";
import {
  LayoutDashboard, Users, CalendarDays,
  Ticket, Tag, Settings, ShieldCheck, MapPin
} from "lucide-react";

const navItems = [
  { href:"/admin",            icon:LayoutDashboard, label:"Overview"         },
  { href:"/admin/vendors",    icon:ShieldCheck,     label:"Vendors"          },
  { href:"/admin/events",     icon:CalendarDays,    label:"Platform Events"  },
  { href:"/admin/venues",     icon:MapPin,          label:"Venues"           },
  { href:"/admin/bookings",   icon:Ticket,          label:"Global Bookings"  },
  { href:"/admin/users",      icon:Users,           label:"Users"            },
  { href:"/admin/categories", icon:Tag,             label:"Categories"       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080C15] text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/[0.07] bg-[#0A0F1E] fixed h-full z-40">
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/[0.07]">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
            <Ticket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-extrabold text-white tracking-tight">
            Bokysh <span className="text-[#1D8EFF]">Admin</span>
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

        <div className="p-3 border-t border-white/[0.07]">
          <Link
            href="/admin/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-[#026CDF]/[0.08] transition-all"
          >
            <Settings className="w-4 h-4 group-hover:text-[#1D8EFF] transition-colors" />
            System Settings
          </Link>
        </div>
      </aside>

      <div className="flex-1 md:ml-60 flex flex-col">
        <header className="h-14 border-b border-white/[0.07] bg-[#0A0F1E]/90 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <span className="text-sm font-semibold text-white/40">Admin Panel</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-white/30">System Online</span>
            </div>
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
