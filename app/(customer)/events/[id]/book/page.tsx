import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

import { 
  getEventById, 
  bestImage, 
  formatEventDate, 
  formatEventTime, 
  getVenue 
} from "@/lib/ticketmaster";
import { getMockStadiumForEvent } from "@/lib/mockStadiums";
import StadiumSeatMapClient from "./StadiumSeatMapClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    return { title: `Book Tickets for ${event.name} — Bokysh` };
  } catch {
    return { title: "Book Tickets — Bokysh" };
  }
}

export default async function EventBookingPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await getEventById(id);
  } catch {
    notFound();
  }

  const stadiumLayout = getMockStadiumForEvent(event);
  const backdrop = bestImage(event.images, 1280) ?? bestImage(event.images, 640);
  const date = formatEventDate(event);
  const time = formatEventTime(event);
  const venue = getVenue(event)?.name || "Venue TBD";

  return (
    <div className="min-h-screen bg-[#080C15] flex flex-col pt-16">
      {/* ── Event Header Context ── */}
      <div className="relative h-24 sm:h-32 shrink-0 border-b border-white/[0.06] overflow-hidden">
        {backdrop && (
          <Image 
            src={backdrop} 
            alt={event.name} 
            fill 
            className="object-cover object-top opacity-20 blur-[2px]" 
            priority 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C15]/50 to-[#080C15]" />
        
        <div className="absolute inset-0 max-w-screen-xl mx-auto px-4 flex items-center justify-between z-10">
           <div className="flex items-center gap-4">
              <Link 
                href={`/events/${id}`}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                 <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                 <h1 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-1">{event.name}</h1>
                 <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#026CDF]" /> {date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#026CDF]" /> {time}</span>
                    <span className="flex items-center gap-1 hidden sm:flex"><MapPin className="w-3 h-3 text-[#06B6D4]" /> {venue}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── Stadium Seat Map Client ── */}
      <StadiumSeatMapClient event={event} layout={stadiumLayout} />
    </div>
  );
}
