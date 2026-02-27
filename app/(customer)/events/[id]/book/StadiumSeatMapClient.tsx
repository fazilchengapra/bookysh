"use client";

import { useState, useMemo } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { TMEvent } from "@/lib/ticketmaster";
import { StadiumLayout, StadiumSeat, StadiumZone } from "@/lib/mockStadiums";
import { cn } from "@/lib/utils";

interface Props {
  event: TMEvent;
  layout: StadiumLayout;
}

export default function StadiumSeatMapClient({ event, layout }: Props) {
  // Seat-based selection state
  const [selectedSeats, setSelectedSeats] = useState<StadiumSeat[]>([]);
  // Zone-based selection state
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoneQuantity, setZoneQuantity] = useState(1);
  
  const [scale, setScale] = useState(layout.selectionType === "zone" ? 0.8 : 1);
  const MAX_SEATS = 10;

  const toggleSeat = (seat: StadiumSeat) => {
    if (seat.status === "booked") return;
    
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) return prev.filter((s) => s.id !== seat.id);
      
      if (prev.length >= MAX_SEATS) {
        alert(`You can only select up to ${MAX_SEATS} seats.`);
        return prev;
      }
      return [...prev, seat];
    });
  };

  const calculateTotal = () => {
    if (layout.selectionType === "zone") {
      const zone = layout.zones.find(z => z.id === selectedZoneId);
      return zone ? zone.price * zoneQuantity : 0;
    } else {
      return selectedSeats.reduce((total, seat) => {
        const zone = layout.zones.find((z) => z.id === seat.zoneId);
        return total + (zone?.price || 0);
      }, 0);
    }
  };

  const handleZoneClick = (zoneId: string) => {
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(null);
      setZoneQuantity(1);
    } else {
      setSelectedZoneId(zoneId);
      setZoneQuantity(1);
    }
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.4));
  const resetZoom = () => setScale(1);

  const getPositionClass = (pos: StadiumZone["position"]) => {
    switch (pos) {
      case "top": return "top-8 left-1/2 -translate-x-1/2";
      case "bottom": return "bottom-8 left-1/2 -translate-x-1/2 rotate-180";
      case "left": return "-left-16 top-1/2 -translate-y-1/2 -rotate-90";
      case "right": return "-right-16 top-1/2 -translate-y-1/2 rotate-90";
      case "top-left": return "top-[15%] left-[15%] -rotate-45";
      case "top-right": return "top-[15%] right-[15%] rotate-45";
      case "bottom-left": return "bottom-[15%] left-[15%] -rotate-135";
      case "bottom-right": return "bottom-[15%] right-[15%] rotate-135";
      default: return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-[#111D35] overflow-hidden min-h-[600px]">
      {/* ── Interactive Canvas Wrapper ── */}
      <div className="absolute inset-0 overflow-auto scrollbar-none flex items-center justify-center p-8 pb-48">
        {/* Floating Zoom Controls */}
        <div className="fixed top-36 right-4 sm:right-8 z-30 flex flex-col gap-2 bg-[#080C15]/80 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-xl">
           <button onClick={zoomIn} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><ZoomIn className="w-4 h-4" /></button>
           <button onClick={zoomOut} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors border-t border-white/10"><ZoomOut className="w-4 h-4" /></button>
           <button onClick={resetZoom} className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors border-t border-white/10"><Maximize2 className="w-4 h-4" /></button>
        </div>

        {/* ── The Transform Map ── */}
        <div 
          className="relative w-[1300px] h-[1300px] transition-transform duration-300 ease-out origin-center" 
          style={{ transform: `scale(${scale})` }}
        >
          {/* Pitch / Field Anchor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
             <div className={cn(
               "relative shadow-[0_0_50px_rgba(0,0,0,0.5)]",
               layout.sportType === "cricket" 
                ? "w-[650px] h-[650px] rounded-full" 
                : layout.sportType === "football"
                  ? "w-[850px] h-[550px] rounded-lg"
                  : "w-[450px] h-[280px] rounded-md"
             )}>
                {/* Field Markings for flavor */}
                {layout.sportType === "football" && (
                  <div className="absolute inset-0 bg-emerald-700/80 border-4 border-white/50 overflow-hidden rounded-lg shadow-inner">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/50 -translate-x-1/2"></div>
                    <div className="absolute left-1/2 top-1/2 w-48 h-48 rounded-full border-4 border-white/50 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-40 h-80 border-4 border-white/50 border-l-0 -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-40 h-80 border-4 border-white/50 border-r-0 -translate-y-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-16 h-40 border-4 border-white/50 border-l-0 -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-16 h-40 border-4 border-white/50 border-r-0 -translate-y-1/2"></div>
                  </div>
                )}
                {layout.sportType === "basketball" && (
                   <div className="absolute inset-0 bg-[#d98a44] border-[4px] border-white/70 rounded-md shadow-inner">
                     <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/60 -translate-x-1/2"></div>
                     <div className="absolute left-1/2 top-1/2 w-28 h-28 rounded-full border-[4px] border-white/60 -translate-x-1/2 -translate-y-1/2"></div>
                     <div className="absolute left-0 top-1/2 w-48 h-56 rounded-r-full border-[4px] border-white/60 -translate-y-1/2"></div>
                     <div className="absolute right-0 top-1/2 w-48 h-56 rounded-l-full border-[4px] border-white/60 -translate-y-1/2"></div>
                     <div className="absolute left-0 top-1/2 w-32 h-32 border-[4px] border-white/60 border-l-0 -translate-y-1/2"></div>
                     <div className="absolute right-0 top-1/2 w-32 h-32 border-[4px] border-white/60 border-r-0 -translate-y-1/2"></div>
                   </div>
                )}
                {layout.sportType === "cricket" && (
                  <div className="absolute inset-0 bg-emerald-700/80 rounded-full border-4 border-white/30 shadow-inner">
                    <div className="absolute left-1/2 top-1/2 w-24 h-64 bg-[#c4a482] border-2 border-[#b08e6c] rounded-sm -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute top-6 left-0 right-0 h-1 bg-white/80"></div>
                      <div className="absolute bottom-6 left-0 right-0 h-1 bg-white/80"></div>
                    </div>
                  </div>
                )}
                {layout.sportType === "music" && (
                  <div className="absolute inset-0 bg-[#0A0F1E] border-2 border-[#a78bfa]/40 rounded-md overflow-hidden flex flex-col items-center justify-start pt-6 shadow-[0_0_30px_rgba(167,139,250,0.2)]">
                      <div className="w-3/4 h-24 bg-gradient-to-b from-[#a78bfa]/80 to-[#a78bfa]/20 rounded-t-3xl border border-[#a78bfa]/60 flex items-center justify-center shadow-[0_0_50px_rgba(167,139,250,0.4)]">
                        <span className="text-white font-black tracking-widest text-xl drop-shadow-md">STAGE</span>
                      </div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/20 font-black tracking-[0.5em] uppercase text-3xl drop-shadow-xl z-10">
                    {layout.sportType === "cricket" ? "OVAL" : layout.sportType === "football" ? "PITCH" : layout.sportType === "music" ? "" : "COURT"}
                  </span>
                </div>
             </div>
          </div>

          {/* Zones loop */}
          {layout.zones.map((zone) => {
            const isZoneSelected = selectedZoneId === zone.id;
            
            return (
            <div key={zone.id} className={cn("absolute flex flex-col items-center gap-2", getPositionClass(zone.position))}>
              {/* Zone label */}
              <div 
                className={cn(
                  "px-4 py-1 backdrop-blur rounded-full border shadow-lg mb-2 transition-colors cursor-default",
                  isZoneSelected || layout.selectionType !== "zone" 
                    ? "bg-[#111D35]/90 border-white/20" 
                    : "bg-[#080C15]/70 border-white/5"
                )}
              >
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: zone.color }}>
                  {zone.name} - ₹{zone.price}
                </span>
              </div>
              
              {layout.selectionType === "zone" ? (
                /* ── Zone Block Rendering ── */
                <button
                  onClick={() => handleZoneClick(zone.id)}
                  className={cn(
                    "flex items-center justify-center p-6 rounded-2xl border-4 transition-all duration-300 backdrop-blur-sm",
                    isZoneSelected
                      ? "bg-white/10 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      : "bg-[#0A0F1E]/80 hover:bg-[#0A0F1E] hover:scale-105"
                  )}
                  style={{ 
                    borderColor: isZoneSelected ? zone.color : `${zone.color}40`,
                    minWidth: "200px",
                    minHeight: "100px",
                    boxShadow: isZoneSelected ? `0 0 40px ${zone.color}60` : "none"
                  }}
                >
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{zone.name}</p>
                    <p className="text-sm text-white/50 mt-1">Select to choose tickets</p>
                  </div>
                </button>
              ) : (
                /* ── Seat Grid Rendering ── */
                <div className="flex flex-col gap-2 bg-[#0A0F1E] p-4 rounded-3xl border border-white/[0.05]">
                  {zone.rows.map((row, rIdx) => (
                    <div key={`${zone.id}-${row.row}-${rIdx}`} className="flex items-center gap-2">
                      <div className="w-5 text-[10px] sm:text-[11px] font-bold text-white/30 text-right">{row.row}</div>
                      <div className="flex gap-1">
                         {row.seats.map((seat, sIdx) => {
                           if (!seat) {
                              return <div key={`gap-${rIdx}-${sIdx}`} className="w-5 sm:w-6 h-5 sm:h-6" />;
                           }
                           
                           const isSelected = selectedSeats.some((s) => s.id === seat.id);
                           const isBooked = seat.status === "booked";
                           const isWheelchair = seat.status === "wheelchair";
                           
                           return (
                              <button
                                key={seat.id}
                                onClick={() => toggleSeat(seat)}
                                disabled={isBooked}
                                className={`relative w-4 h-4 sm:w-[18px] sm:h-[18px] rounded flex items-center justify-center text-[7px] font-bold transition-all z-10 shrink-0 ${
                                  isBooked 
                                   ? "bg-white/[0.04] border border-white/[0.06] text-transparent cursor-not-allowed"
                                   : isSelected
                                     ? "bg-[#026CDF] border-[#026CDF] text-white shadow-[0_0_10px_rgba(2,108,223,0.5)] scale-125 block-number z-20"
                                     : "bg-[#0D1526] border text-transparent hover:scale-125 hover:text-white show-on-hover z-10"
                                }`}
                                style={(!isBooked && !isSelected) ? { borderColor: `${zone.color}60` } : {}}
                                title={`${row.row}${seat.num} (${zone.name})`}
                              >
                                 <span className={cn(isWheelchair && "text-blue-300")}>
                                     {isWheelchair ? "♿" : seat.num}
                                 </span>
                              </button>
                           );
                         })}
                      </div>
                      <div className="w-5 text-[10px] sm:text-[11px] font-bold text-white/30">{row.row}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )})}

        </div>
      </div>

      {/* ── Fixed Bottom Actions Bar ── */}
      <div className="fixed bottom-0 left-0 w-full bg-[#080C15] border-t border-white/[0.06] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
             {/* Legend or Selection Status */}
             {layout.selectionType === "zone" ? (
               <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-white/60">
                 {selectedZoneId ? (
                   <span className="text-emerald-400 font-semibold text-base py-1.5 px-3 bg-emerald-500/10 rounded-lg">
                     {layout.zones.find(z => z.id === selectedZoneId)?.name} Selected
                   </span>
                 ) : (
                   <span>Click a zone block on the map to select tickets</span>
                 )}
               </div>
             ) : (
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
             )}

             {/* Action Pricing */}
             <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                {/* Quantity Editor for Zones */}
                {layout.selectionType === "zone" && selectedZoneId && (
                  <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl mr-2">
                    <button 
                      onClick={() => setZoneQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      -
                    </button>
                    <span className="text-white font-bold w-4 text-center">{zoneQuantity}</span>
                    <button 
                      onClick={() => setZoneQuantity(q => Math.min(MAX_SEATS, q + 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      +
                    </button>
                  </div>
                )}

                {(selectedSeats.length > 0 || selectedZoneId) ? (
                  <div className="flex flex-col text-right grow sm:grow-0">
                    <span className="text-white text-sm font-bold truncate max-w-[200px]">
                      {layout.selectionType === "zone" 
                        ? `${zoneQuantity} Ticket${zoneQuantity > 1 ? "s" : ""}`
                        : `${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""}`
                      }
                    </span>
                    <span className="text-xl font-black text-emerald-400">₹{calculateTotal()}</span>
                  </div>
                ) : (
                  <div className="text-right text-white/40 text-sm grow sm:grow-0">
                    {layout.selectionType === "zone" ? "Select a zone to proceed" : "Select seats to proceed"}
                  </div>
                )}
                
                <button 
                  disabled={layout.selectionType === "zone" ? !selectedZoneId : selectedSeats.length === 0}
                  className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
                     (layout.selectionType === "zone" ? selectedZoneId : selectedSeats.length > 0)
                     ? "bg-[#026CDF] hover:bg-[#1D8EFF] text-white hover:scale-105 shadow-[0_5px_20px_rgba(2,108,223,0.4)]"
                     : "bg-white/[0.05] text-white/30 cursor-not-allowed"
                  }`}
                >
                  Book Tickets
                </button>
             </div>
          </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .show-on-hover span { opacity: 0; transition: opacity 0.2s; }
        .show-on-hover:hover { z-index: 30; }
        .show-on-hover:hover span { opacity: 1; text-shadow: 0 0 4px rgba(255,255,255,0.8); }
        .block-number span { opacity: 1; }
      `}} />
    </div>
  );
}
