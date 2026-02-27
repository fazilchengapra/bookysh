import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { getMovieDetails, backdropUrl } from "@/lib/tmdb";
import { getMockTheatersForMovie, Theater, Showtime } from "@/lib/mockBooking";
import SeatMapClient from "./SeatMapClient";

interface PageProps {
  params: Promise<{ id: string; showId: string }>;
  searchParams: Promise<{ date?: string; t?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return { title: `Select Seats: ${movie.title} — Bokysh` };
  } catch {
    return { title: "Select Seats — Bokysh" };
  }
}

export default async function SeatSelectionPage({ params, searchParams }: PageProps) {
  const { id, showId } = await params;
  const { date, t } = await searchParams;

  if (!date || !t) notFound();

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  const theaters = getMockTheatersForMovie(movie.id.toString(), date);
  const theater = theaters.find(th => th.id === t);
  if (!theater) notFound();

  const showtime = theater.showtimes.find(s => s.id === showId);
  if (!showtime) notFound();

  // Parse the display date
  const dObj = new Date(date);
  const displayDate = dObj.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-[#080C15] flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#080C15]/90 backdrop-blur-md border-b border-white/[0.06] h-16 sm:h-20 flex items-center">
        <div className="w-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Link
               href={`/movies/${id}/book?date=${date}`}
               className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
             >
               <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
             </Link>
             <div className="flex flex-col">
               <h1 className="text-sm sm:text-base font-bold text-white leading-tight">{movie.title} <span className="text-white/40 font-normal">({showtime.format})</span></h1>
               <p className="text-[10px] sm:text-xs text-white/50">{theater.name} | {displayDate}, {showtime.time}</p>
             </div>
           </div>
        </div>
      </header>
      
      {/* ── Client Side Interactive Map ── */}
      <SeatMapClient movie={movie} theater={theater} showtime={showtime} />
    </div>
  );
}
