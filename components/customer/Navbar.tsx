"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Ticket,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

const navLinks = [
  { label: "Movies", href: "/movies" },
  { label: "Events", href: "/events" },
  { label: "Sports", href: "/sports" },
];

export default function CustomerNavbar() {
  const pathname = usePathname();
  const [city, setCity] = useState("Mumbai");
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        /* Deep navy header — always solid */
        "bg-[#0A0F1E] border-b border-white/[0.07]",
        scrolled && "shadow-xl shadow-black/40",
      )}
    >
      {/* ── Top bar ────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2 mr-1 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center glow-blue-sm group-hover:opacity-90 transition-opacity">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-white hidden sm:block">
            bokysh
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#1D8EFF] transition-colors pointer-events-none" />
          <input
            id="nav-search"
            type="text"
            placeholder="Search movies, events, concerts, sports…"
            className="w-full h-9 pl-9 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 outline-none focus:border-[#026CDF]/60 focus:bg-[#026CDF]/[0.05] transition-all"
          />
        </div>

        {/* City */}
        <div className="relative shrink-0">
          <button
            id="city-selector"
            onClick={() => setCityOpen(!cityOpen)}
            className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/[0.05]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="hidden sm:block">{city}</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                cityOpen && "rotate-180",
              )}
            />
          </button>

          {cityOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0D1526] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setCityOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    c === city
                      ? "text-[#1D8EFF] bg-[#026CDF]/[0.12] font-semibold"
                      : "text-white/55 hover:text-white hover:bg-white/[0.04]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <Link
            href="/auth/login"
            id="nav-signin"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-brand text-white text-sm font-semibold hover:opacity-90 glow-blue-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </Link>
        </div>

        {/* Mobile */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Category nav ───────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-screen-xl mx-auto px-4">
          <nav className="flex items-center overflow-x-auto scrollbar-none">
            {navLinks.map((l) => {
              const isActive =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                    isActive
                      ? "text-white border-[#026CDF] bg-[#026CDF]/[0.08] font-semibold"
                      : "text-white/45 border-transparent hover:text-white hover:border-[#026CDF] hover:bg-[#026CDF]/[0.04]",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#0D1526] border-t border-white/[0.06] px-4 py-4 space-y-1">
          {navLinks.map((l) => {
            const isActive =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive
                    ? "text-[#1D8EFF] bg-[#026CDF]/[0.12] font-semibold"
                    : "text-white/55 hover:text-white hover:bg-white/[0.04]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/[0.06]">
            <Link
              href="/auth/login"
              className="block text-center py-2.5 rounded-lg gradient-brand text-white text-sm font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
