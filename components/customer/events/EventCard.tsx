"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Tag, Play } from "lucide-react";
import {
  bestImage, formatEventDate, formatEventTime,
  getVenueLabel, getEventSegment, getEventGenre, formatPriceRange,
  type TMEvent,
} from "@/lib/ticketmaster";
import { cn } from "@/lib/utils";

interface Props {
  event: TMEvent;
  size?: "sm" | "md";
}

const SEGMENT_COLORS: Record<string, string> = {
  "Music":          "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/20",
  "Sports":         "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20",
  "Arts & Theatre": "text-[#fb923c] bg-[#fb923c]/10 border-[#fb923c]/20",
  "Film":           "text-[#1D8EFF] bg-[#1D8EFF]/10 border-[#1D8EFF]/20",
  "Miscellaneous":  "text-[#f9a8d4] bg-[#f9a8d4]/10 border-[#f9a8d4]/20",
};

export default function EventCard({ event, size = "md" }: Props) {
  const img     = bestImage(event.images, size === "sm" ? 320 : 640);
  const segment = getEventSegment(event);
  const genre   = getEventGenre(event);
  const venue   = getVenueLabel(event);
  const date    = formatEventDate(event);
  const time    = formatEventTime(event);
  const price   = formatPriceRange(event.priceRanges);
  const status  = event.dates?.status?.code;
  const tagColor = SEGMENT_COLORS[segment] ?? SEGMENT_COLORS["Miscellaneous"];

  const isSm = size === "sm";

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden bg-[#0D1526] border border-white/[0.07]",
        "hover:border-[#026CDF]/40 hover:shadow-xl hover:shadow-[#026CDF]/10 transition-all duration-300",
        isSm ? "w-48 shrink-0" : "w-full"
      )}
    >
      {/* Image */}
      <div className={cn("relative overflow-hidden bg-[#0D1526]", isSm ? "h-28" : "h-44")}>
        {img ? (
          <Image
            src={img}
            alt={event.name}
            fill
            sizes={isSm ? "192px" : "(max-width: 640px) 50vw, 240px"}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D1526] to-[#080C15] flex items-center justify-center">
            <Play className="w-10 h-10 text-white/10" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526] via-transparent to-transparent opacity-80" />

        {/* Status badge */}
        {status && status !== "onsale" && (
          <span className={cn(
            "absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
            status === "cancelled"  && "bg-red-500/90 text-white",
            status === "postponed"  && "bg-amber-500/90 text-black",
            status === "rescheduled"&& "bg-blue-500/90 text-white",
            status === "offsale"    && "bg-white/20 text-white/80",
          )}>
            {status}
          </span>
        )}

        {/* Segment tag */}
        <span className={cn(
          "absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
          tagColor
        )}>
          {genre || segment}
        </span>
      </div>

      {/* Info */}
      <div className={cn("flex flex-col gap-1.5 p-3", isSm && "p-2.5")}>
        <h3 className={cn(
          "font-bold text-white leading-tight line-clamp-2 group-hover:text-[#1D8EFF] transition-colors",
          isSm ? "text-[11px]" : "text-sm"
        )}>
          {event.name}
        </h3>

        {!isSm && (
          <>
            <div className="flex items-center gap-1.5 text-[11px] text-white/45">
              <Calendar className="w-3 h-3 shrink-0 text-[#026CDF]" />
              <span className="truncate">{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/45">
              <Clock className="w-3 h-3 shrink-0 text-[#026CDF]" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/45">
              <MapPin className="w-3 h-3 shrink-0 text-[#06B6D4]" />
              <span className="truncate">{venue}</span>
            </div>
          </>
        )}

        {isSm && (
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{date}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-[10px] text-white/35">
            <Tag className="w-3 h-3" />
            <span>{price}</span>
          </div>
          {!isSm && (
            <span className="text-[10px] font-semibold text-[#1D8EFF] group-hover:text-[#06B6D4] transition-colors">
              View →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
