"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, MapPin, Building, Target, Plus, X, Maximize, MousePointerSquareDashed } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type SeatType = "available" | "aisle" | "wheelchair";
type ZoneConfig = { id: string; name: string; price: number; color: string };

type SeatCell = {
  id: string; // "row-col" format like "0-5"
  rowLabel: string; // The display label e.g., "A"
  colIndex: number; // 0-based
  type: SeatType;
  zoneId: string;
};

const defaultZones: ZoneConfig[] = [
  { id: "z1", name: "VIP", price: 500, color: "#a855f7" },
  { id: "z2", name: "Premium", price: 300, color: "#1D8EFF" },
  { id: "z3", name: "Regular", price: 150, color: "#10b981" },
];

export default function NewVenueWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1: Details
  const [venueData, setVenueData] = useState({
    name: "",
    city: "",
    type: "Theater",
    capacity: "",
  });

  // Step 2: Map Configuration
  const [zones, setZones] = useState<ZoneConfig[]>(defaultZones);
  const [activeZoneId, setActiveZoneId] = useState<string>("z1");
  const [paintMode, setPaintMode] = useState<"zone" | "aisle" | "wheelchair" | "available">("zone");
  
  // Grid State
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(16);
  // Grid is deeply generated only when rows/cols change significantly. For now, flat array state.
  const [grid, setGrid] = useState<SeatCell[]>(() => generateInitialGrid(10, 16));

  const [isDragging, setIsDragging] = useState(false);

  // --- Handlers ---
  function generateInitialGrid(rCount: number, cCount: number): SeatCell[] {
     const newGrid: SeatCell[] = [];
     for(let r=0; r < rCount; r++) {
       const rowLabel = String.fromCharCode(65 + (r % 26)) + (r >= 26 ? Math.floor(r/26) : "");
       for(let c=0; c < cCount; c++) {
         newGrid.push({
           id: `${r}-${c}`,
           rowLabel: rowLabel,
           colIndex: c,
           type: "available",
           zoneId: "z3" // Default to regular
         });
       }
     }
     return newGrid;
  }

  const handleGridResize = (newR: number, newC: number) => {
    setRows(newR);
    setCols(newC);
    setGrid(generateInitialGrid(newR, newC));
  };

  const applyToolToCell = (cellId: string) => {
    setGrid(prev => prev.map(c => {
       if (c.id !== cellId) return c;
       
       if (paintMode === "zone") {
         return { ...c, type: "available", zoneId: activeZoneId };
       }
       if (paintMode === "aisle") {
         return { ...c, type: "aisle" };
       }
       if (paintMode === "wheelchair") {
         return { ...c, type: "wheelchair" };
       }
       if (paintMode === "available") { // reset to standard seat in active zone
         return { ...c, type: "available", zoneId: activeZoneId };
       }
       return c;
    }));
  };

  const handleCellMouseDown = (cellId: string) => {
    setIsDragging(true);
    applyToolToCell(cellId);
  };
  
  const handleCellMouseEnter = (cellId: string) => {
    if (isDragging) {
      applyToolToCell(cellId);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCellColor = (cell: SeatCell) => {
    if (cell.type === "aisle") return "transparent"; // invisible
    const zone = zones.find(z => z.id === cell.zoneId);
    return zone ? zone.color : "#ffffff";
  };

  // --- Rendering ---
  return (
    <div className="flex flex-col min-h-screen bg-[#080C15]" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Header bar */}
      <div className="h-16 border-b border-white/[0.06] bg-[#0A0F1E]/90 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-40">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <h1 className="text-lg font-bold text-white leading-tight">Create New Venue</h1>
               <div className="flex items-center gap-2 text-xs font-semibold text-white/40 mt-0.5">
                  <span className={step === 1 ? "text-[#1D8EFF]" : ""}>1. Details</span>
                  <span>/</span>
                  <span className={step === 2 ? "text-[#1D8EFF]" : ""}>2. Layout Designer</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 rounded-xl text-white/60 hover:text-white text-sm font-semibold transition-colors border border-transparent hover:border-white/10"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#1D8EFF] hover:bg-[#026CDF] text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(29,142,255,0.3)] transition-all"
              >
                Continue to Layout Map
              </button>
            ) : (
              <button 
                onClick={() => {
                   alert("Layout Saved! (Mock Action)");
                   router.push("/admin/venues");
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Publish Venue Layout
              </button>
            )}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-6xl mx-auto w-full">
           
           {/* STEP 1: VENUE DETAILS */}
           {step === 1 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
                <div className="text-center">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1D8EFF] to-purple-600 p-0.5 mx-auto mb-6 shadow-[0_10px_40px_rgba(29,142,255,0.4)]">
                     <div className="w-full h-full bg-[#0A0F1E] rounded-[14px] flex items-center justify-center">
                       <Building className="w-8 h-8 text-[#1D8EFF]" />
                     </div>
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2">Venue Properties</h2>
                   <p className="text-white/40">Define the core information before designing the interactive layout map.</p>
                </div>

                <div className="bg-[#0A0F1E]/80 border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D8EFF]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                   <div className="space-y-4">
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-white/80 ml-1">Venue Name</label>
                       <div className="relative">
                         <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                         <input 
                           type="text" 
                           placeholder="e.g. Jio World Center"
                           value={venueData.name}
                           onChange={e => setVenueData({...venueData, name: e.target.value})}
                           className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all shadow-inner"
                         />
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-white/80 ml-1">City Location</label>
                         <input 
                           type="text" 
                           placeholder="e.g. Mumbai"
                           value={venueData.city}
                           onChange={e => setVenueData({...venueData, city: e.target.value})}
                           className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all shadow-inner"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-white/80 ml-1">Venue Type</label>
                         <select 
                           value={venueData.type}
                           onChange={e => setVenueData({...venueData, type: e.target.value})}
                           className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all shadow-inner appearance-none"
                         >
                           <option value="Theater">Theater / Cinema</option>
                           <option value="Stadium">Sports Stadium</option>
                           <option value="Arena">Indoor Arena</option>
                           <option value="Club">Club / Lounge</option>
                         </select>
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-bold text-white/80 ml-1">Estimated Base Capacity (Optional)</label>
                       <input 
                         type="number" 
                         placeholder="e.g. 5000"
                         value={venueData.capacity}
                         onChange={e => setVenueData({...venueData, capacity: e.target.value})}
                         className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all shadow-inner"
                       />
                     </div>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 2: INTERACTIVE LAYOUT BUILDER */}
           {step === 2 && (
             <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-right-8 duration-500 h-[calc(100vh-140px)]">
               
               {/* Builder Sidebar */}
               <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                 
                 {/* Zone Configuration */}
                 <div className="bg-[#0A0F1E]/90 border border-white/[0.06] rounded-3xl p-6 backdrop-blur-md shadow-2xl flex-shrink-0">
                    <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#1D8EFF]" />
                      Pricing Zones
                    </h3>
                    <p className="text-xs text-white/40 mb-6 font-medium">Define sections and their base ticket prices.</p>

                    <div className="space-y-3">
                       {zones.map(zone => (
                         <div 
                           key={zone.id} 
                           onClick={() => { setActiveZoneId(zone.id); setPaintMode("zone"); }}
                           className={`p-3 rounded-xl border transition-all cursor-pointer ${
                             activeZoneId === zone.id && paintMode === "zone" 
                               ? "bg-[#111D35] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                               : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
                           }`}
                         >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-4 h-4 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: zone.color }} />
                                 <span className="text-sm font-bold text-white">{zone.name}</span>
                              </div>
                              <span className="text-xs font-black text-white/60">₹{zone.price}</span>
                            </div>
                         </div>
                       ))}
                       
                       <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-[#1D8EFF]/50 hover:bg-[#1D8EFF]/5 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                          <Plus className="w-4 h-4" /> Add Zone
                       </button>
                    </div>
                 </div>

                 {/* Layout Tools */}
                 <div className="bg-[#0A0F1E]/90 border border-white/[0.06] rounded-3xl p-6 backdrop-blur-md shadow-2xl flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                       <MousePointerSquareDashed className="w-5 h-5 text-purple-500" />
                       Draw Tools
                    </h3>
                    <p className="text-xs text-white/40 mb-6 font-medium">Click and drag on the grid to paint layout modifications.</p>

                    <div className="space-y-2 mb-6">
                       {[
                         { mode: "zone", label: "Paint Selected Zone", icon: <div className="w-4 h-4 rounded-sm border border-white/20" style={{ backgroundColor: zones.find(z=>z.id === activeZoneId)?.color }}/> },
                         { mode: "aisle", label: "Erase Seat (Create Aisle)", icon: <div className="w-4 h-4 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center"><X className="w-3 h-3 text-red-400" /></div> },
                         { mode: "wheelchair", label: "Mark as Wheelchair", icon: <div className="w-4 h-4 rounded-sm border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-400">♿</div> },
                       ].map(tool => (
                         <button
                           key={tool.mode}
                           onClick={() => setPaintMode(tool.mode as any)}
                           className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                             paintMode === tool.mode 
                               ? "bg-[#111D35] border-white/20 text-white" 
                               : "bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.05] hover:text-white"
                           }`}
                         >
                           {tool.icon}
                           <span className="text-sm font-bold">{tool.label}</span>
                         </button>
                       ))}
                    </div>

                    <div className="mt-auto px-4 py-4 rounded-2xl bg-[#111D35] border border-white/[0.05] space-y-4">
                       <div>
                         <label className="text-xs font-bold text-white/50 block mb-1">Grid Dimensions</label>
                         <div className="flex items-center gap-2 text-white">
                           <input type="number" value={cols} onChange={(e) => handleGridResize(rows, parseInt(e.target.value) || 1)} className="w-16 bg-black/40 border border-white/10 rounded-lg p-1 text-center text-sm font-bold" />
                           <span className="text-white/30 text-xs">Cols</span>
                           <span className="text-white/20 text-xs px-1">×</span>
                           <input type="number" value={rows} onChange={(e) => handleGridResize(parseInt(e.target.value) || 1, cols)} className="w-16 bg-black/40 border border-white/10 rounded-lg p-1 text-center text-sm font-bold" />
                           <span className="text-white/30 text-xs">Rows</span>
                         </div>
                       </div>
                    </div>
                 </div>

               </div>

               {/* Interactive Grid Map */}
               <div className="flex-1 bg-[#0A0F1E]/60 border border-white/[0.06] rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                       <h3 className="text-xl font-black text-white">{venueData.name || "Unnamed Venue"} Map Designer</h3>
                       <p className="text-sm font-bold text-emerald-400">Stage / Screen Context</p>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-semibold text-white/40">
                       <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white border border-white/20"></div> Seat</div>
                       <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-dashed border-white/20"></div> Gap</div>
                     </div>
                  </div>

                  {/* The visual stage line */}
                  <div className="w-full max-w-lg mx-auto h-4 bg-gradient-to-b from-purple-500/40 to-transparent border-t-2 border-purple-500/80 rounded-t-[50%] mb-12 flex-shrink-0 relative">
                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.2em] text-purple-400/80 uppercase">Stage / Canvas</span>
                  </div>

                  {/* Scrollable Container for Map */}
                  <div className="flex-1 overflow-auto flex items-start justify-center pb-20 scrollbar-none select-none">
                     <div 
                       className="grid gap-2 p-8" 
                       style={{ 
                         gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                         gridAutoRows: "max-content"
                       }}
                     >
                        {grid.map((cell) => {
                          const isAisle = cell.type === "aisle";
                          const isWheelchair = cell.type === "wheelchair";
                          const color = getCellColor(cell);

                          return (
                            <div 
                              key={cell.id}
                              onMouseDown={() => handleCellMouseDown(cell.id)}
                              onMouseEnter={() => handleCellMouseEnter(cell.id)}
                              className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all cursor-cell relative group ${
                                isAisle 
                                  ? "border border-dashed border-white/[0.05] hover:border-white/20" 
                                  : "shadow-sm border border-black/20 hover:scale-110 hover:shadow-lg hover:z-10"
                              }`}
                              style={{ 
                                backgroundColor: isAisle ? "transparent" : `${color}E6`, // 90% opacity
                                opacity: isAisle ? 0.3 : 1
                              }}
                            >
                              {!isAisle && (
                                <>
                                  <span className={isWheelchair ? "text-white" : "text-black/50"}>
                                    {isWheelchair ? "♿" : cell.colIndex + 1}
                                  </span>
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[10px] whitespace-nowrap z-50 pointer-events-none font-bold block-number">
                                    Row {cell.rowLabel} - {cell.colIndex + 1}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                     </div>
                  </div>

               </div>

             </div>
           )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .block-number span { opacity: 1; }
      `}} />
    </div>
  );
}
