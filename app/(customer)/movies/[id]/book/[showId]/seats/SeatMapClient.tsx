"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Check, Info, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { TMDBMovieDetails } from "@/lib/tmdb";
import { Theater, Showtime, Seat } from "@/lib/mockBooking";

interface Props {
  movie: TMDBMovieDetails;
  theater: Theater;
  showtime: Showtime;
}

export default function SeatMapClient({ movie, theater, showtime }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [scale, setScale] = useState(1);

  const MAX_SEATS = 10;

  // Derive all distinct zones for the Legend and pricing
  const zones = useMemo(() => showtime.layout.zones, [showtime]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked") return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) return prev.filter(s => s.id !== seat.id);
      
      if (prev.length >= MAX_SEATS) {
        alert(`You can only select up to ${MAX_SEATS} seats.`);
        return prev;
      }
      return [...prev, seat];
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const zone = zones.find(z => z.id === seat.zoneId);
      return total + (zone?.price || 0);
    }, 0);
  };

  // Zoom controls for the Map Canvas
  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const resetZoom = () => setScale(1);

  return (
    <div className="flex-1 flex flex-col relative bg-[#111D35] overflow-hidden">
        
      {/* ── Interactive Canvas Wrapper ── */}
      <div className="flex-1 overflow-auto relative scrollbar-none snap-mandatory flex justify-center p-8 pb-48">
          
        {/* Floating Zoom Controls */}
        <div className="fixed top-24 right-4 sm:right-8 z-30 flex flex-col gap-2 bg-[#080C15]/80 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-xl">
           <button onClick={zoomIn} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><ZoomIn className="w-4 h-4" /></button>
           <button onClick={zoomOut} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors border-t border-white/10"><ZoomOut className="w-4 h-4" /></button>
           <button onClick={resetZoom} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors border-t border-white/10"><Maximize2 className="w-4 h-4" /></button>
        </div>

        {/* ── The Transform Map ── */}
        <div 
          className="flex flex-col items-center origin-top transition-transform duration-300 ease-out" 
          style={{ transform: `scale(${scale})` }}
        >
           {/* Screen Anchor */}
           <div className="w-full max-w-[600px] mb-16 flex flex-col items-center">
             <div className="w-full h-8 relative overflow-hidden">
                <div className="absolute inset-0 border-t-[8px] border-[#026CDF]/80 rounded-[50%_50%_0_0] shadow-[0_-15px_30px_rgba(2,108,223,0.3)] filter blur-[1px]"></div>
             </div>
             <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mt-3 flex items-center gap-2">
                All Eyes This Way
             </p>
           </div>

           {/* Zones Loop */}
           <div className="flex flex-col gap-10">
             {zones.map(zone => (
                <div key={zone.id} className="flex flex-col items-center">
                   {/* Zone Header Line */}
                   <div className="w-full max-w-4xl border-b border-white/[0.05] relative mb-4">
                      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111D35] px-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: zone.color }}>
                            {zone.name} - ₹{zone.price}
                          </span>
                      </div>
                   </div>

                   {/* Rows Loop */}
                   <div className="flex flex-col gap-3">
                     {zone.rows.map((row, rIdx) => (
                       <div key={`${zone.id}-${rIdx}`} className="flex items-center gap-4">
                          {/* Row Indicator L */}
                          <div className="w-6 text-[10px] sm:text-xs font-bold text-white/30 text-right shrink-0">{row.row}</div>
                          
                          {/* Seats Loop */}
                          <div className="flex gap-1.5 sm:gap-2 justify-center">
                            {row.seats.map((seat, sIdx) => {
                               // Gap rendering
                               if (!seat) {
                                  return <div key={`gap-${rIdx}-${sIdx}`} className="w-6 sm:w-8 h-6 sm:h-8 shrink-0 relative flex justify-center items-center">
                                         {/* Aisle Path (Optional UI flare) */}
                                         <div className="w-px h-[200%] bg-white/[0.02] absolute z-0 pointer-events-none"></div>
                                      </div>;
                               }

                               const isSelected = selectedSeats.some(s => s.id === seat.id);
                               const isBooked = seat.status === "booked";
                               const isWheelchair = seat.status === "wheelchair";

                               return (
                                  <button
                                     key={seat.id}
                                     onClick={() => toggleSeat(seat)}
                                     disabled={isBooked}
                                     className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg rounded-b-md flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-all z-10 shrink-0 ${
                                       isBooked 
                                        ? "bg-white/[0.04] border border-white/[0.06] text-white/10 cursor-not-allowed hidden-number"
                                        : isSelected
                                          ? "bg-[#026CDF] border-[#026CDF] text-white shadow-[0_4px_15px_rgba(2,108,223,0.5)] scale-110 -translate-y-1 block-number"
                                          : `bg-[#0D1526] border text-white/40 hover:scale-110 hover:-translate-y-0.5 hover:text-white show-on-hover`
                                     }`}
                                     style={(!isBooked && !isSelected) ? { borderColor: `${zone.color}40` } : {}}
                                     title={`${row.row}${seat.num} (${zone.name})`}
                                  >
                                    <span className={isWheelchair ? "opacity-100 text-blue-300" : ""}>
                                        {isWheelchair ? "♿" : seat.num}
                                    </span>
                                  </button>
                               );
                            })}
                          </div>
                          
                          {/* Row Indicator R */}
                          <div className="w-6 text-[10px] sm:text-xs font-bold text-white/30 shrink-0">{row.row}</div>
                       </div>
                     ))}
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* ── Fixed Bottom Actions Bar ── */}
      <div className="fixed bottom-0 left-0 w-full bg-[#080C15] border-t border-white/[0.06] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 transform translate-y-0">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
             
             {/* Legend */}
             <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-white/60">
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm bg-[#0D1526] border border-emerald-500/40"></div>
                   <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm bg-[#026CDF] shadow-[0_2px_8px_rgba(2,108,223,0.4)]"></div>
                   <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm bg-white/[0.04] border border-white/[0.06]"></div>
                   <span>Sold</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px]">♿</div>
                   <span>Wheelchair</span>
                </div>
             </div>

             {/* Action Pricing */}
             <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-col text-right grow sm:grow-0">
                    <span className="text-white text-sm font-bold truncate max-w-[200px]">
                      {selectedSeats.map(s => `${s.id}`).join(", ")}
                    </span>
                    <span className="text-xl font-black text-white">₹{calculateTotal()}</span>
                  </div>
                ) : (
                  <div className="text-right text-white/40 text-sm grow sm:grow-0">
                    Select seats to proceed max ({MAX_SEATS})
                  </div>
                )}
                
                <button 
                  disabled={selectedSeats.length === 0}
                  className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
                     selectedSeats.length > 0
                     ? "gradient-brand text-white hover:scale-105 shadow-[0_5px_20px_rgba(2,108,223,0.4)]"
                     : "bg-white/[0.05] text-white/30 cursor-not-allowed"
                  }`}
                >
                  Pay ₹{calculateTotal()}
                </button>
             </div>
          </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hidden-number span { display: none; }
        .show-on-hover span { opacity: 0; transition: opacity 0.2s; }
        .show-on-hover:hover span { opacity: 1; text-shadow: 0 0 8px rgba(255,255,255,0.5); }
        .block-number span { opacity: 1; }
      `}} />
    </div>
  );
}
