"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play, Star, Clock, Calendar, Globe,
  DollarSign, ArrowLeft, Ticket, ChevronRight,
  Users, Film,
} from "lucide-react";
import {
  posterUrl, backdropUrl, profileUrl,
  formatRuntime, formatMoney, ratingColor,
  type TMDBMovieDetails, type TMDBCastMember, type TMDBCrewMember, type TMDBMovie,
} from "@/lib/tmdb";
import MovieCard from "@/components/customer/movies/MovieCard";

interface Props {
  movie:      TMDBMovieDetails;
  trailerKey: string | null;
  director:   TMDBCrewMember | null;
  topCast:    TMDBCastMember[];
  similar:    TMDBMovie[];
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export default function MovieDetailClient({ movie, trailerKey, director, topCast, similar }: Props) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError,    setImgError]    = useState(false);

  const poster   = posterUrl(movie.poster_path, "w500");
  const backdrop = backdropUrl(movie.backdrop_path);
  const rating   = movie.vote_average;
  const color    = ratingColor(rating);
  const year     = movie.release_date?.slice(0, 4) ?? "";

  return (
    <div className="min-h-screen bg-[#080C15]">

      {/* ═══════════════════════════════════════
          HERO BACKDROP
      ═══════════════════════════════════════ */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        {/* Backdrop image */}
        {backdrop ? (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D1526] to-[#080C15]" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C15] via-[#080C15]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C15]/80 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            href="/movies"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all hover:bg-black/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>

        {/* Play Trailer Button over backdrop */}
        {trailerKey && (
          <button
            id="hero-play-trailer"
            onClick={() => setShowTrailer(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:bg-[#026CDF]/70 group-hover:border-[#026CDF] group-hover:scale-110 transition-all glow-blue">
              <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
            </div>
            <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
              Watch Trailer
            </span>
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header Row ─────────────────── */}
        <div className="flex flex-col sm:flex-row gap-8 -mt-28 relative z-10 pb-8 border-b border-white/[0.06]">

          {/* Poster */}
          <div className="shrink-0 self-start">
            <div className="relative w-40 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/[0.1] shadow-2xl shadow-black/60">
              {poster && !imgError ? (
                <Image
                  src={poster}
                  alt={movie.title}
                  fill
                  sizes="208px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D1526] to-[#080C15] flex items-center justify-center">
                  <Film className="w-12 h-12 text-white/15" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-16">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-[#026CDF]/15 text-[#1D8EFF] border border-[#026CDF]/20"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-base text-white/40 italic mt-2">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              {/* Rating */}
              <div className="flex items-center gap-1.5 bg-[#111D35] px-3 py-2 rounded-xl border border-white/[0.06]">
                <Star className="w-4 h-4 fill-current" style={{ color }} />
                <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
                <span className="text-xs text-white/35">/ 10</span>
              </div>

              {/* Runtime */}
              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-sm text-white/50">
                  <Clock className="w-4 h-4 text-white/30" />
                  {formatRuntime(movie.runtime)}
                </div>
              )}

              {/* Year */}
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <Calendar className="w-4 h-4 text-white/30" />
                {movie.release_date}
              </div>

              {/* Language */}
              <div className="flex items-center gap-1.5 text-sm text-white/50 uppercase">
                <Globe className="w-4 h-4 text-white/30" />
                {movie.spoken_languages?.[0]?.english_name ?? movie.original_language}
              </div>

              {/* Status badge */}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                movie.status === "Released" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              }`}>
                {movie.status}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href={`/movies/${movie.id}/book`}
                id="book-tickets-btn"
                className="flex items-center gap-2 px-7 py-3 rounded-xl gradient-brand text-white font-bold text-sm hover:opacity-90 glow-blue-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets
              </Link>

              {trailerKey && (
                <button
                  id="watch-trailer-btn"
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white/[0.07] border border-white/[0.09] text-white font-bold text-sm hover:bg-white/[0.10] hover:border-[#026CDF]/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Overview ───────────────────── */}
        {movie.overview && (
          <div className="py-8 border-b border-white/[0.06]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-3">Overview</h2>
            <p className="text-base text-white/65 leading-relaxed max-w-4xl">{movie.overview}</p>
          </div>
        )}

        {/* ── Stats Row ──────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-b border-white/[0.06]">
          {director && (
            <InfoPill label="Director" value={director.name} />
          )}
          <InfoPill label="Vote Count"  value={`${movie.vote_count?.toLocaleString()} votes`} />
          {movie.budget    > 0 && <InfoPill label="Budget"   value={formatMoney(movie.budget)}  />}
          {movie.revenue   > 0 && <InfoPill label="Revenue"  value={formatMoney(movie.revenue)} />}
        </div>

        {/* ── Cast ───────────────────────── */}
        {topCast.length > 0 && (
          <div className="py-8 border-b border-white/[0.06]">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1D8EFF]" />
              Top Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
              {topCast.map((actor) => {
                const pic = profileUrl(actor.profile_path);
                return (
                  <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#0D1526] border border-white/[0.07] mb-2">
                      {pic ? (
                        <Image
                          src={pic}
                          alt={actor.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🎭
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-white/80 leading-tight truncate">{actor.name}</p>
                    <p className="text-[10px] text-white/35 truncate mt-0.5">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Similar Movies ─────────────── */}
        {similar.length > 0 && (
          <div className="py-8 pb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-[#1D8EFF]" />
                Similar Movies
              </h2>
              <Link href="/movies" className="flex items-center gap-1 text-xs font-semibold text-[#1D8EFF] hover:text-[#06B6D4] transition-colors">
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} trailerKey={null} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          TRAILER MODAL
      ═══════════════════════════════════════ */}
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div className="absolute inset-0 bg-black/92 backdrop-blur-lg" />

          <div
            className="relative z-10 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1D8EFF]/70 mb-0.5">
                  Official Trailer
                </p>
                <h3 className="text-lg font-bold text-white">{movie.title}</h3>
              </div>
              <button
                id="close-trailer-modal"
                onClick={() => setShowTrailer(false)}
                className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
              >
                ✕
              </button>
            </div>

            {/* iFrame */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/70"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} – Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-xs text-white/20 mt-3">
              Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10">ESC</kbd> to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
