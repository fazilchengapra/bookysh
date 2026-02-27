"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MovieCard from "@/components/customer/movies/MovieCard";
import EventCard from "@/components/customer/events/EventCard";
import { type TMDBMovie } from "@/lib/tmdb";
import { type TMEvent } from "@/lib/ticketmaster";

interface Props {
  sports: TMEvent[];
}

/* Loading skeleton for movie cards */
function MovieSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 animate-pulse">
      <div className="w-full aspect-[2/3] rounded-2xl bg-[#0D1526] border border-white/[0.05]" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-3 bg-[#0D1526] rounded w-4/5" />
        <div className="h-2.5 bg-[#0D1526] rounded w-3/5" />
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, href }: { title: string; sub?: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-[17px] font-bold text-white tracking-tight">{title}</h2>
        {sub && <p className="text-xs text-white/35 mt-0.5">{sub}</p>}
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-[#1D8EFF] hover:text-[#06B6D4] transition-colors">
        See All <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function CustomerHomePageClient({ sports }: Props) {
  const [nowPlaying,   setNowPlaying]   = useState<TMDBMovie[]>([]);
  const [upcoming,     setUpcoming]     = useState<TMDBMovie[]>([]);
  const [trailerKeys,  setTrailerKeys]  = useState<Record<number, string>>({});
  const [moviesLoading, setMoviesLoading] = useState(true);

  useEffect(() => {
    const API = "d86edccefa9682ac2a92a664006b2684";

    async function fetchTrailers(movies: TMDBMovie[]) {
      const keys: Record<number, string> = {};
      await Promise.allSettled(
        movies.slice(0, 8).map(async (m) => {
          const r = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${API}&language=en-US`);
          if (!r.ok) return;
          const d = await r.json();
          const t = (d.results as { site: string; type: string; key: string; official: boolean }[])
            .find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
          if (t) keys[m.id] = t.key;
        })
      );
      return keys;
    }

    async function loadMovies() {
      try {
        const [npRes, upRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API}&language=en-US&page=1&region=IN`),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API}&language=en-US&page=1&region=IN`),
        ]);
        const [np, up] = await Promise.all([npRes.json(), upRes.json()]);
        const npMovies = (np.results as TMDBMovie[]).slice(0, 10);
        const upMovies = (up.results as TMDBMovie[]).slice(0, 6);
        setNowPlaying(npMovies);
        setUpcoming(upMovies);
        const keys = await fetchTrailers([...npMovies, ...upMovies]);
        setTrailerKeys(keys);
      } catch (e) {
        console.error("TMDB fetch error:", e);
      } finally {
        setMoviesLoading(false);
      }
    }
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#080C15]">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-10">

        {/* ── Now Showing (TMDB) ─────────── */}
        <section id="now-showing">
          <SectionHeader title="Now Showing" sub="Book tickets for movies in your city" href="/movies"/>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {moviesLoading
              ? Array.from({ length: 7 }).map((_, i) => <MovieSkeleton key={i} />)
              : nowPlaying.map((m) => (
                  <MovieCard key={m.id} movie={m} trailerKey={trailerKeys[m.id] ?? null} size="md" />
                ))}
          </div>
        </section>

        {/* ── Sports Events ──────────────── */}
        <section id="sports-events">
          <SectionHeader title="Sports Events" sub="Live matches & tournaments near you" href="/sports"/>
          {sports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sports.map((event) => (
                <EventCard key={event.id} event={event} size="md" />
              ))}
            </div>
          ) : (
             <div className="text-sm text-white/50 py-4 px-2">
                No sports events available.
             </div>
          )}
        </section>

        {/* ── Upcoming Movies (TMDB) ─────── */}
        <section id="upcoming-movies">
           <SectionHeader title="Releasing Soon" sub="Set a reminder for upcoming blockbusters" href="/movies?tab=upcoming"/>
           <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {moviesLoading
              ? Array.from({ length: 5 }).map((_, i) => <MovieSkeleton key={i} />)
              : upcoming.map((m) => (
                  <MovieCard key={m.id} movie={m} trailerKey={trailerKeys[m.id] ?? null} size="md" />
                ))}
          </div>
        </section>

      </div>
    </div>
  );
}
