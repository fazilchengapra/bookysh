"use client";

import { useState } from "react";
import {
  Trophy, Search, Calendar,
} from "lucide-react";
import EventCard from "@/components/customer/events/EventCard";
import { type TMEvent } from "@/lib/ticketmaster";
import { cn } from "@/lib/utils";

interface SportsResult {
  label: string;
  keyword: string;
  events: TMEvent[];
}

interface Props {
  sportsResults: SportsResult[];
}

const SPORT_ICONS: Record<string, string> = {
  Football:            "⚽",
  Basketball:          "🏀",
  Cricket:             "🏏",
};

export default function SportsClientPage({ sportsResults }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [search,     setSearch]   = useState("");

  const q = search.trim().toLowerCase();

  const activeSport = sportsResults[activeTab];

  const pool = activeSport?.events ?? [];
  const matches = q
    ? pool.filter((e) => e.name.toLowerCase().includes(q))
    : pool;

  const totalMatches = matches.length;

  return (
    <div className="min-h-screen bg-[#080C15]">

      {/* ── Page header ─────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#0A0F1E]">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Sports</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Sports Events
              </h1>
              <p className="text-sm text-white/40 mt-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {totalMatches} events · {activeSport?.label ?? ""}
              </p>
            </div>

            {/* search */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events…"
                  className="w-full h-10 pl-9 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sport tabs */}
          <div className="flex gap-2 mt-7 overflow-x-auto scrollbar-none">
            {sportsResults.map((sport, i) => {
              const icon  = SPORT_ICONS[sport.label] ?? "🏆";
              const count = sport.events.length;
              return (
                <button
                  key={sport.label}
                  id={`tab-sport-${i}`}
                  onClick={() => { setActiveTab(i); setSearch(""); }}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0",
                    activeTab === i
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                      : "text-white/45 hover:text-white bg-white/[0.04] hover:bg-emerald-600/[0.08] border border-white/[0.06] hover:border-emerald-500/25"
                  )}
                >
                  <span>{icon}</span>
                  {sport.label}
                  <span className={cn(
                    "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    activeTab === i ? "bg-white/20 text-white" : "bg-white/[0.07] text-white/40"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fixtures ────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {totalMatches === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Trophy className="w-16 h-16 text-white/10 mb-4" />
            <p className="text-lg font-semibold text-white/30">
              {search ? "No events matched your search" : "No events available right now"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-emerald-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {matches.map((event) => (
              <EventCard key={event.id} event={event} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
