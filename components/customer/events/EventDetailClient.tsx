"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Tag, ArrowLeft,
  ExternalLink, Ticket, ChevronRight, Music,
} from "lucide-react";
import {
  bestImage, formatEventDate, formatEventTime, formatPriceRange,
  getEventSegment, getEventGenre, getVenue, statusColor,
  type TMEvent, type TMVenue,
} from "@/lib/ticketmaster";
import EventCard from "@/components/customer/events/EventCard";

interface Props {
  event:   TMEvent;
  related: TMEvent[];
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
      <Icon className="w-4 h-4 mt-0.5 text-[#a78bfa] shrink-0" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">{label}</p>
        <p className="text-sm text-white/80 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function EventDetailClient({ event, related }: Props) {
  const hero     = bestImage(event.images, 1280) ?? bestImage(event.images, 640);
  const poster   = bestImage(event.images, 320);
  const segment  = getEventSegment(event);
  const genre    = getEventGenre(event);
  const date     = formatEventDate(event);
  const time     = formatEventTime(event);
  const venue    = getVenue(event);
  const price    = formatPriceRange(event.priceRanges);
  const status   = event.dates?.status?.code;
  const statusCl = statusColor(status);
  const attractions = event._embedded?.attractions ?? [];

  return (
    <div className="min-h-screen bg-[#080C15]">

      {/* ── Hero Backdrop ───────────────── */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        {hero ? (
          <Image
            src={hero}
            alt={event.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] to-[#080C15]" />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C15] via-[#080C15]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C15]/70 via-transparent to-transparent" />

        {/* Back */}
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            href="/events"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all hover:bg-black/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* ── Main content ────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row gap-8 -mt-24 relative z-10 pb-8 border-b border-white/[0.06]">

          {/* Poster */}
          {poster && (
            <div className="shrink-0 self-start">
              <div className="relative w-36 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-white/[0.1] shadow-2xl shadow-black/60">
                <Image
                  src={poster}
                  alt={event.name}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-[#7C3AED]/15 text-[#a78bfa] border border-[#7C3AED]/20">
                {segment}
              </span>
              {genre && genre !== segment && (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-white/[0.05] text-white/50 border border-white/[0.08]">
                  {genre}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {event.name}
            </h1>

            {/* Status */}
            {status && (
              <span className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full
                ${statusCl === "emerald" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : statusCl === "amber"   ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                :                         "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
                {status === "onsale" ? "On Sale" : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}

            {/* Quick meta pills */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-1.5 bg-[#111D35] px-3 py-2 rounded-xl border border-white/[0.06] text-sm text-white/70">
                <Calendar className="w-4 h-4 text-[#a78bfa]" />
                {date}
              </div>
              <div className="flex items-center gap-1.5 bg-[#111D35] px-3 py-2 rounded-xl border border-white/[0.06] text-sm text-white/70">
                <Clock className="w-4 h-4 text-[#a78bfa]" />
                {time}
              </div>
              <div className="flex items-center gap-1.5 bg-[#111D35] px-3 py-2 rounded-xl border border-white/[0.06] text-sm text-white/70">
                <Tag className="w-4 h-4 text-[#a78bfa]" />
                {price}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href={`/events/${event.id}/book`}
                id="book-event-btn"
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#7C3AED] text-white font-bold text-sm hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Ticket className="w-4 h-4" />
                Book on Bokysh
              </Link>
              
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/70 font-bold text-sm hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  Official Tickets
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column body ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">

          {/* Left — description + performers */}
          <div className="lg:col-span-2 space-y-8">

            {/* Info text */}
            {(event.info || event.pleaseNote) && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-3">About</h2>
                {event.info && (
                  <p className="text-base text-white/65 leading-relaxed mb-3">{event.info}</p>
                )}
                {event.pleaseNote && (
                  <p className="text-sm text-amber-400/70 leading-relaxed bg-amber-500/[0.06] border border-amber-500/15 rounded-xl px-4 py-3">
                    ⚠️ {event.pleaseNote}
                  </p>
                )}
              </div>
            )}

            {/* Performers / Attractions */}
            {attractions.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#a78bfa]" />
                  Performers
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {attractions.map((a) => {
                    const pic = bestImage(a.images, 200);
                    return (
                      <div key={a.id} className="flex items-center gap-3 bg-[#0D1526] border border-white/[0.07] rounded-xl px-4 py-3">
                        {pic && (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                            <Image src={pic} alt={a.name} fill className="object-cover" sizes="40px" />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-white">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — venue details */}
          <div className="lg:col-span-1">
            <div className="bg-[#0D1526] border border-white/[0.07] rounded-2xl p-5 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Venue Details
              </h2>

              {venue ? (
                <div className="space-y-0">
                  <InfoRow icon={MapPin}   label="Venue"   value={venue.name} />
                  {venue.address?.line1 && (
                    <InfoRow icon={MapPin} label="Address" value={venue.address.line1} />
                  )}
                  {venue.city && (
                    <InfoRow icon={MapPin} label="City"
                      value={[venue.city.name, venue.state?.name, venue.country?.name].filter(Boolean).join(", ")} />
                  )}
                  {venue.postalCode && (
                    <InfoRow icon={Tag}    label="Postal Code" value={venue.postalCode} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/40">Venue to be announced</p>
              )}

              {venue?.url && (
                <a
                  href={venue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Venue Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Events ─────────────── */}
        {related.length > 0 && (
          <div className="py-8 pb-16 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-[#a78bfa]" />
                More Events
              </h2>
              <Link href="/events" className="flex items-center gap-1 text-xs font-semibold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
              {related.map((e) => (
                <EventCard key={e.id} event={e} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
