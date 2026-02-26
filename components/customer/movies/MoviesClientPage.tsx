"use client";

import { useState } from "react";
import { Film, Clock, Search } from "lucide-react";
import MovieCard from "@/components/customer/movies/MovieCard";
import { type TMDBMovie } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface Props {
  nowPlaying: TMDBMovie[];
  upcoming:   TMDBMovie[];
  trailerKeys: Record<number, string>;
}

type Tab = "now_playing" | "upcoming";

const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "now_playing", label: "Now Showing", icon: Film  },
  { id: "upcoming",    label: "Upcoming",    icon: Clock },
];

export default function MoviesClientPage({ nowPlaying, upcoming, trailerKeys }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("now_playing");
  const [search, setSearch]       = useState("");

  const moviesMap: Record<Tab, TMDBMovie[]> = {
    now_playing: nowPlaying,
    upcoming,
  };

  const raw    = moviesMap[activeTab];
  const movies = search.trim()
    ? raw.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : raw;

  return (
    <div className="min-h-screen bg-[#080C15]">

      {/* ── Page header ─────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#0A0F1E]">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1D8EFF] mb-2">
                Movies
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Book Movie Tickets
              </h1>
              <p className="text-sm text-white/40 mt-1.5">
                {raw.length} movies{" "}
                {activeTab === "now_playing" ? "showing in cinemas now" : "releasing soon"}
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies…"
                className="w-full h-10 pl-9 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-[#026CDF]/60 transition-all"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-7 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`tab-${id}`}
                onClick={() => { setActiveTab(id); setSearch(""); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0",
                  activeTab === id
                    ? "gradient-brand text-white glow-blue-sm"
                    : "text-white/45 hover:text-white bg-white/[0.04] hover:bg-[#026CDF]/[0.07] border border-white/[0.06] hover:border-[#026CDF]/25"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {/* count badge */}
                <span className={cn(
                  "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  activeTab === id
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.07] text-white/40"
                )}>
                  {moviesMap[id].length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Movies grid ─────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Film className="w-16 h-16 text-white/10 mb-4" />
            <p className="text-lg font-semibold text-white/30">
              {search ? "No movies matched your search" : "No movies available right now"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-[#1D8EFF] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Upcoming: show release date badge hint */}
            {activeTab === "upcoming" && (
              <p className="text-xs text-white/30 mb-5 font-medium">
                🎬 Showing upcoming releases sorted by release date
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  trailerKey={trailerKeys[movie.id] ?? null}
                  size="md"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
