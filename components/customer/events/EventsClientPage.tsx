"use client";

import { useState } from "react";
import { Music, Trophy, Theater, Film, Star, Search, Calendar } from "lucide-react";
import EventCard from "@/components/customer/events/EventCard";
import { type TMEvent, type TMSegment } from "@/lib/ticketmaster";
import { cn } from "@/lib/utils";

interface Props {
  music:   TMEvent[];
  all:     TMEvent[];
}

type Tab = "all" | "music";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "all",    label: "All Events", icon: Star    },
  { id: "music",  label: "Music",      icon: Music   },
];

export default function EventsClientPage({ music, all }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch]       = useState("");

  const moviesMap: Record<Tab, TMEvent[]> = { all, music };
  const raw    = moviesMap[activeTab];
  const events = search.trim()
    ? raw.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    : raw;

  return (
    <div className="min-h-screen bg-[#080C15]">

      {/* ── Page header ─────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#0A0F1E]">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a78bfa] mb-2">
                Live Events
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Upcoming Events
              </h1>
              <p className="text-sm text-white/40 mt-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {raw.length} events happening near you
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full h-10 pl-9 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-[#a78bfa]/60 transition-all"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-7 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`tab-events-${id}`}
                onClick={() => { setActiveTab(id); setSearch(""); }}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0",
                  activeTab === id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30"
                    : "text-white/45 hover:text-white bg-white/[0.04] hover:bg-[#7C3AED]/[0.08] border border-white/[0.06] hover:border-[#7C3AED]/25"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={cn(
                  "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  activeTab === id ? "bg-white/20 text-white" : "bg-white/[0.07] text-white/40"
                )}>
                  {moviesMap[id].length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Events grid ─────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Star className="w-16 h-16 text-white/10 mb-4" />
            <p className="text-lg font-semibold text-white/30">
              {search ? "No events matched your search" : "No events available right now"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-[#a78bfa] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
