"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star, Clock, MapPin, ChevronRight, Play,
  Calendar, Filter, Flame, Film,
} from "lucide-react";
import MovieCard from "@/components/customer/movies/MovieCard";
import { type TMDBMovie } from "@/lib/tmdb";

/* ═══════════════════════════════════════════════
   STATIC DUMMY DATA — Sports, Events, Meetups
═══════════════════════════════════════════════ */
const sportsEvents = [
  { id:"s1", title:"IPL 2026 — RCB vs MI",       day:"Sun", date:"Mar 15", time:"7:30 PM", venue:"Wankhede Stadium",        city:"Mumbai",   price:"₹1,200", tag:"Hot 🔥",       tagBg:"#ea580c", accent:"#F59E0B" },
  { id:"s2", title:"FIFA International Friendly",  day:"Sun", date:"Mar 22", time:"6:00 PM", venue:"Salt Lake Stadium",        city:"Kolkata",  price:"₹800",   tag:"Fast Filling", tagBg:"#026CDF", accent:"#1D8EFF" },
  { id:"s3", title:"PKL Season 11 — Final",        day:"Sat", date:"Apr 5",  time:"8:00 PM", venue:"JLN Stadium",              city:"Delhi",    price:"₹600",   tag:"Finale",       tagBg:"#7c3aed", accent:"#a855f7" },
  { id:"s4", title:"Formula E Race — Round 5",     day:"Sun", date:"Apr 12", time:"3:00 PM", venue:"Hyderabad Street Circuit", city:"Hyderabad",price:"₹2,500", tag:"",             tagBg:"",        accent:"#06B6D4" },
];

const concertEvents = [
  { id:"c1", title:"AR Rahman — World Tour 2026",     type:"Concert",        date:"Apr 2, 2026",     venue:"DY Patil Stadium, Pune",      price:"₹2,500", tag:"Selling Fast",  tagBg:"#7c3aed", accent:"#a855f7" },
  { id:"c2", title:"Sunburn Festival 2026",           type:"Music Festival", date:"Mar 28–30, 2026", venue:"Candolim Beach, Goa",         price:"₹3,999", tag:"3-Day Pass",    tagBg:"#059669", accent:"#10b981" },
  { id:"c3", title:"Zakir Hussain Tribute Night",     type:"Classical",      date:"Mar 20, 2026",    venue:"NCPA, Mumbai",                price:"₹999",   tag:"Limited Seats", tagBg:"#b45309", accent:"#F59E0B" },
  { id:"c4", title:"Delhi International Comedy Fest", type:"Comedy",         date:"Apr 10–12, 2026", venue:"Siri Fort Auditorium, Delhi", price:"₹599",   tag:"",              tagBg:"",        accent:"#06B6D4" },
];

const familyMeetups = [
  { id:"f1", title:"Kidzee Birthday Brunch Package",  type:"Family",  seats:"Up to 30 guests", venue:"The Zoo Café, Mumbai",      price:"₹4,500 / package", emoji:"👨‍👩‍👧", accent:"#F59E0B" },
  { id:"f2", title:"Family Adventure Day — Lonavala", type:"Outdoor", seats:"Min 10 guests",   venue:"Camp Wild, Lonavala",       price:"₹799 / person",    emoji:"🌲",        accent:"#10b981" },
  { id:"f3", title:"Private Movie Screening",         type:"Private", seats:"Up to 50 seats",  venue:"PVR Gold Class, Bangalore", price:"₹12,000 / screen", emoji:"🎬",        accent:"#026CDF" },
];

const trendingTags = [
  "IPL 2026","KGF 3","AR Rahman","Sunburn Festival","Avengers",
  "Private Screen","Comedy Night","Family Package","T20 World Cup","Pushpa 3",
];

/* ═══════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════ */
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

function SportCard({ e }: { e: typeof sportsEvents[0] }) {
  return (
    <Link href={`/sports/${e.id}`} id={`sport-${e.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0D1526] border border-white/[0.07] hover:border-[#026CDF]/30 hover:bg-[#111D35] transition-all"
    >
      <div className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border"
        style={{ background:`${e.accent}12`, borderColor:`${e.accent}28` }}>
        <span className="text-[9px] font-bold text-white/35 uppercase">{e.day}</span>
        <span className="text-[22px] font-black text-white leading-none">{e.date.split(" ")[1]}</span>
        <span className="text-[9px] font-medium text-white/30 uppercase">{e.date.split(" ")[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-[#1D8EFF] transition-colors">{e.title}</h3>
          {e.tag && <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background:e.tagBg }}>{e.tag}</span>}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-white/35">
          <Clock className="w-3 h-3"/><span>{e.time}</span>
          <span className="mx-1 text-white/15">·</span>
          <MapPin className="w-3 h-3"/><span className="truncate">{e.venue}, {e.city}</span>
        </div>
        <p className="text-[11px] font-bold text-[#1D8EFF] mt-1">From {e.price}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#1D8EFF] shrink-0 transition-colors"/>
    </Link>
  );
}

function EventCard({ e }: { e: typeof concertEvents[0] }) {
  return (
    <Link href={`/events/${e.id}`} id={`event-${e.id}`}
      className="group flex flex-col rounded-2xl bg-[#0D1526] border border-white/[0.07] hover:border-[#026CDF]/25 hover:bg-[#111D35] transition-all overflow-hidden"
    >
      <div className="h-[3px]" style={{ background:`linear-gradient(90deg, ${e.accent}, transparent 70%)` }}/>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md"
            style={{ background:`${e.accent}14`, color:e.accent }}>
            {e.type}
          </span>
          {e.tag && <span className="text-[10px] font-bold px-2 py-1 rounded-md text-white" style={{ background:e.tagBg }}>{e.tag}</span>}
        </div>
        <h3 className="text-[13px] font-bold text-white leading-snug flex-1 mb-3 group-hover:text-[#1D8EFF] transition-colors">{e.title}</h3>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-white/35"><Calendar className="w-3 h-3"/>{e.date}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/35"><MapPin className="w-3 h-3"/><span className="truncate">{e.venue}</span></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-white/45">From <span className="text-white font-bold">{e.price}</span></p>
          <span className="text-xs font-bold text-[#1D8EFF] group-hover:text-[#06B6D4] transition-colors">Book →</span>
        </div>
      </div>
    </Link>
  );
}

function MeetupCard({ m }: { m: typeof familyMeetups[0] }) {
  return (
    <Link href={`/meetups/${m.id}`} id={`meetup-${m.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0D1526] border border-white/[0.07] hover:border-[#026CDF]/25 hover:bg-[#111D35] transition-all"
    >
      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
        style={{ background:`${m.accent}12`, borderColor:`${m.accent}22` }}>{m.emoji}</div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color:m.accent }}>{m.type}</span>
        <h3 className="text-[13px] font-bold text-white truncate group-hover:text-[#1D8EFF] transition-colors">{m.title}</h3>
        <p className="text-[11px] text-white/35 mt-0.5 truncate">{m.venue} · {m.seats}</p>
        <p className="text-[11px] font-bold text-white/65 mt-1">{m.price}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#1D8EFF] shrink-0 transition-colors"/>
    </Link>
  );
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

/* ═══════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════ */
const quickFilters = [
  { label:"🎬 Now Showing",    active:true  },
  { label:"🔜 Releasing Soon", active:false },
  { label:"🏏 IPL 2026",       active:false },
  { label:"🎵 Concerts",       active:false },
  { label:"🎭 Plays",          active:false },
  { label:"👨‍👩‍👧 Family",   active:false },
];

export default function CustomerHomePage() {
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
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API}&language=en-US&page=1`),
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

        {/* Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickFilters.map((f) => (
            <button key={f.label}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                f.active
                  ? "gradient-brand text-white glow-blue-sm"
                  : "bg-[#0D1526] text-white/50 hover:text-white border border-white/[0.07] hover:border-[#026CDF]/30 hover:bg-[#026CDF]/[0.06]"
              }`}>{f.label}</button>
          ))}
          <button className="shrink-0 ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#0D1526] border border-white/[0.07] text-white/50 hover:text-white hover:border-[#026CDF]/30 transition-all">
            <Filter className="w-3.5 h-3.5"/>Filter
          </button>
        </div>

        {/* ── Now Showing (TMDB) ─────────── */}
        <section id="now-showing">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Now Showing</h2>
              <p className="text-xs text-white/35 mt-0.5">Book tickets for movies in your city</p>
            </div>
            <Link href="/movies" className="flex items-center gap-1 text-xs font-semibold text-[#1D8EFF] hover:text-[#06B6D4] transition-colors">
              See All <ChevronRight className="w-3.5 h-3.5"/>
            </Link>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sportsEvents.map((e) => <SportCard key={e.id} e={e}/>)}
          </div>
        </section>

        {/* ── Concerts & Events ──────────── */}
        <section id="concerts-events">
          <SectionHeader title="Concerts & Events" sub="Music, comedy, festivals and more" href="/events"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {concertEvents.map((e) => <EventCard key={e.id} e={e}/>)}
          </div>
        </section>

        {/* ── Upcoming Movies (TMDB) ─────── */}
        <section id="upcoming-movies">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Releasing Soon</h2>
              <p className="text-xs text-white/35 mt-0.5">Set a reminder for upcoming blockbusters</p>
            </div>
            <Link href="/movies?tab=upcoming" className="flex items-center gap-1 text-xs font-semibold text-[#1D8EFF] hover:text-[#06B6D4] transition-colors">
              See All <ChevronRight className="w-3.5 h-3.5"/>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {moviesLoading
              ? Array.from({ length: 5 }).map((_, i) => <MovieSkeleton key={i} />)
              : upcoming.map((m) => (
                  <MovieCard key={m.id} movie={m} trailerKey={trailerKeys[m.id] ?? null} size="md" />
                ))}
          </div>
        </section>

        {/* ── Family & Group Meetups ─────── */}
        <section id="family-meetups">
          <SectionHeader title="Family & Group Meetups" sub="Plan private events, screenings & outings" href="/meetups"/>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {familyMeetups.map((m) => <MeetupCard key={m.id} m={m}/>)}
          </div>
        </section>

        {/* ── Trending ──────────────────── */}
        <section id="trending-searches" className="pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#F59E0B]"/>
            <h2 className="text-sm font-bold text-white">Trending Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button key={tag}
                className="px-3 py-1.5 rounded-full border border-white/[0.07] bg-[#0D1526] text-xs font-medium text-white/45 hover:text-white hover:border-[#026CDF]/35 hover:bg-[#026CDF]/[0.07] transition-all">
                {tag}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
