"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, Calendar, Info } from "lucide-react";
import { type TMDBMovie, posterUrl, ratingColor } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: TMDBMovie;
  trailerKey?: string | null; // pre-fetched trailer key (optional)
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({ movie, trailerKey, size = "md" }: MovieCardProps) {
  const [imgError, setImgError]   = useState(false);
  const [hovered, setHovered]     = useState(false);
  const [showModal, setShowModal] = useState(false);

  const poster  = posterUrl(movie.poster_path, "w500");
  const year    = movie.release_date?.slice(0, 4) ?? "";
  const rating  = movie.vote_average;
  const color   = ratingColor(rating);

  const widthClass = {
    sm: "w-32 sm:w-36",
    md: "w-36 sm:w-44",
    lg: "w-44 sm:w-52",
  }[size];

  return (
    <>
      <div
        className={cn("group flex-shrink-0 cursor-pointer", widthClass)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Poster ──────────────────────── */}
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.07] group-hover:border-[#026CDF]/35 transition-all group-hover:scale-[1.022] group-hover:shadow-2xl group-hover:shadow-[#026CDF]/10">
          {poster && !imgError ? (
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="(max-width:640px) 144px, 176px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback gradient poster */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D1526] to-[#080C15] flex items-center justify-center">
              <div className="text-center px-3">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-xs text-white/30 font-medium leading-snug">{movie.title}</p>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-current" style={{ color }} />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </div>

          {/* Year badge */}
          {year && (
            <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-[10px] font-semibold text-white/60">{year}</span>
            </div>
          )}

          {/* Hover action buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Trailer play button */}
            {trailerKey && (
              <button
                id={`play-trailer-${movie.id}`}
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hover:bg-[#026CDF]/80 hover:border-[#026CDF] transition-all hover:scale-110 active:scale-95"
              >
                <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
              </button>
            )}

            {/* Details button */}
            <Link
              id={`details-${movie.id}`}
              href={`/movies/${movie.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all hover:scale-110 active:scale-95"
            >
              <Info className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Bottom Book button (always visible at bottom on hover) */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={`/movies/${movie.id}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#026CDF] hover:bg-[#1D8EFF] text-white text-xs font-bold transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Book Tickets
            </Link>
          </div>
        </div>

        {/* ── Info ────────────────────────── */}
        <div className="mt-2.5 px-0.5">
          <Link href={`/movies/${movie.id}`}>
            <h3 className="text-[13px] font-semibold text-white/90 leading-snug truncate hover:text-[#1D8EFF] transition-colors">
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-white/25" />
            <span className="text-[11px] text-white/35">{year}</span>
            <span className="text-white/15">·</span>
            <span className="text-[11px] text-white/35 uppercase">{movie.original_language}</span>
          </div>
        </div>
      </div>

      {/* Trailer Modal (lazy — portal not needed for simple overlay) */}
      {showModal && trailerKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1D8EFF]/70 mb-0.5">Official Trailer</p>
                <h3 className="text-base font-bold text-white">{movie.title}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} – Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-xs text-white/20 mt-3">
              Click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
