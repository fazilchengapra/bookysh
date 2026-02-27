import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Info } from "lucide-react";

import { getMovieDetails, posterUrl, backdropUrl } from "@/lib/tmdb";
import { getMockTheatersForMovie } from "@/lib/mockBooking";
import BookingDateSelector from "./BookingDateSelector";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return { title: `Book Tickets for ${movie.title} — Bokysh` };
  } catch {
    return { title: "Book Tickets — Bokysh" };
  }
}

export default async function MovieBookingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { date } = await searchParams;

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  // Determine active date (default to today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight
  
  let activeDate = today;
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      parsed.setHours(0,0,0,0);
      activeDate = parsed;
    }
  }

  const dateStr = activeDate.toISOString().split('T')[0];
  const theaters = getMockTheatersForMovie(movie.id.toString(), dateStr);

  const poster = posterUrl(movie.poster_path, "w342");
  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-[#080C15] pb-24">
      {/* ── Movie Header ── */}
      <div className="relative h-48 sm:h-64 overflow-hidden border-b border-white/[0.06]">
        {backdrop ? (
          <Image src={backdrop} alt={movie.title} fill className="object-cover object-top opacity-30" priority />
        ) : (
          <div className="absolute inset-0 bg-[#0D1526]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C15] to-transparent" />
        
        <div className="absolute inset-0 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-6">
          <div className="flex items-end gap-5">
            {poster && (
              <div className="w-20 sm:w-28 blur-none shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-2xl relative z-10 hidden sm:block">
                <Image src={poster} alt="Poster" width={112} height={168} className="w-full h-auto object-cover blur-none" />
              </div>
            )}
            <div className="relative z-10 w-full pb-2">
              <Link
                href={`/movies/${id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Details
              </Link>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{movie.title}</h1>
              <p className="text-sm text-white/60 mt-1 max-w-xl truncate">{movie.genres?.map(g => g.name).join(", ")} • {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "Duration N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Client Dates Scroll ── */}
        <div className="py-6 border-b border-white/[0.06] sticky top-[60px] z-40 bg-[#080C15]/95 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0">
          <BookingDateSelector movieId={id} activeDateStr={dateStr} />
        </div>

        {/* ── Required Formats/Filters ── */}
        <div className="flex flex-wrap items-center gap-3 py-5">
           <div className="flex items-center gap-2 bg-[#111D35] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-white/70">Available</span>
           </div>
           <div className="flex items-center gap-2 bg-[#111D35] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-semibold text-white/70">Fast Filling</span>
           </div>
        </div>

        {/* ── Theater List ── */}
        <div className="mt-4 flex flex-col gap-6">
          {theaters.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-lg font-bold text-white mb-2">No Shows Available</h3>
              <p className="text-white/50">There are no showtimes scheduled for this date. Try selecting another day.</p>
            </div>
          ) : (
            theaters.map((theater) => (
              <div key={theater.id} className="bg-[#0D1526] rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col sm:flex-row">
                {/* Theater Info */}
                <div className="p-5 sm:p-6 sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/[0.06] flex flex-col justify-center">
                  <h3 className="text-white font-bold text-base mb-2">{theater.name}</h3>
                  <div className="flex flex-col gap-1.5 text-xs text-white/40">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{theater.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{theater.distance}</span>
                    <span className="flex items-center gap-1.5 mt-2 text-[#026CDF]/70 cursor-pointer hover:text-[#026CDF]"><Info className="w-3 h-3" /> Facility Info</span>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="p-5 sm:p-6 flex-1 bg-white/[0.01]">
                   <div className="flex flex-wrap gap-3">
                     {theater.showtimes.map((show) => (
                        <Link 
                          key={show.id}
                          href={`/movies/${id}/book/${show.id}/seats?date=${dateStr}&t=${theater.id}`}
                          className="group relative"
                        >
                          <div className="flex flex-col items-center justify-center min-w-[100px] border border-[#026CDF]/30 bg-[#026CDF]/10 rounded-xl py-2 px-4 hover:bg-[#026CDF] transition-all hover:scale-105 active:scale-95 glow-blue-sm">
                            <span className="text-xs text-[#06B6D4] font-medium group-hover:text-white transition-colors">{show.time}</span>
                            <span className="text-[10px] uppercase font-bold text-white/60 mt-0.5 group-hover:text-white/80 transition-colors">{show.format}</span>
                          </div>
                        </Link>
                     ))}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
