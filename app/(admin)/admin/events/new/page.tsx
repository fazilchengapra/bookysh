"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, CheckCircle2, Ticket, MapPin, 
  Calendar as CalendarIcon, Play, Music, Trophy, UploadCloud, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type EventCategory = "Movie" | "Music" | "Sports";

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Movie" as EventCategory,
    description: "",
    venue: "PVR Director's Cut",
    date: "",
    showtimes: ["10:00 AM", "01:30 PM", "06:00 PM"],
    basePrice: "250",
    vipPrice: "800",
    platformFee: "10"
  });

  const handlePublish = () => {
    alert(`Successfully generated and published '${formData.title}' to the platform! (Mock Action)`);
    router.push("/admin/events");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080C15]">
      
      {/* ── Header Bar ── */}
      <div className="h-16 border-b border-white/[0.06] bg-[#0A0F1E]/90 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-40">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <h1 className="text-lg font-bold text-white leading-tight">Create Listing</h1>
               <div className="flex items-center gap-2 text-xs font-semibold text-white/40 mt-0.5">
                  <span className={step === 1 ? "text-[#1D8EFF]" : ""}>1. Details</span>
                  <span>/</span>
                  <span className={step === 2 ? "text-[#1D8EFF]" : ""}>2. Logistics</span>
                  <span>/</span>
                  <span className={step === 3 ? "text-[#1D8EFF]" : ""}>3. Pricing</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 rounded-xl text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1 as any)}
                className="px-6 py-2.5 bg-white hover:bg-white/90 text-black rounded-xl text-sm font-bold shadow-xl transition-all"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handlePublish}
                className="px-6 py-2.5 bg-[#1D8EFF] hover:bg-[#026CDF] text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(29,142,255,0.4)] transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Event Now
              </button>
            )}
         </div>
      </div>

      {/* ── Main Content Form ── */}
      <div className="flex-1 overflow-auto p-8 relative">
         <div className="max-w-3xl mx-auto w-full pt-8">
            
            {/* ── STEP 1: Details ── */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white mb-2">Event Master Details</h2>
                    <p className="text-white/40">Define what the event is and how it appeals to customers on the listing page.</p>
                 </div>

                 <div className="bg-[#0A0F1E]/80 border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {(['Movie', 'Music', 'Sports'] as EventCategory[]).map(cat => (
                         <button
                           key={cat}
                           onClick={() => setFormData({...formData, category: cat})}
                           className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                             formData.category === cat 
                               ? "bg-[#1D8EFF]/10 border-[#1D8EFF]/50 text-[#1D8EFF]" 
                               : "bg-[#111D35] border-white/[0.05] text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                           }`}
                         >
                            {cat === 'Movie' && <Play className="w-6 h-6" />}
                            {cat === 'Music' && <Music className="w-6 h-6" />}
                            {cat === 'Sports' && <Trophy className="w-6 h-6" />}
                            <span className="font-bold">{cat}</span>
                         </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest">Public Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Inception 10th Anniversary Screening"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all font-medium text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest">Thumbnail / Banner Image</label>
                       <div className="border-2 border-dashed border-white/10 rounded-2xl bg-[#111D35]/50 p-10 flex flex-col items-center justify-center text-center hover:bg-[#111D35] transition-colors cursor-pointer group">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <UploadCloud className="w-6 h-6 text-[#1D8EFF]" />
                          </div>
                          <p className="text-sm font-bold text-white">Click or drag an image here</p>
                          <p className="text-xs text-white/40 mt-1">Recommended size: 1920x1080px (JPEG or PNG based)</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Provide details about the cast, the rules, or the performer..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1D8EFF] transition-all font-medium resize-none"
                      />
                    </div>
                 </div>
              </div>
            )}

            {/* ── STEP 2: Venue & Schedule ── */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white mb-2">Location & Timings</h2>
                    <p className="text-white/40">Assign the event to a registered venue and configure system runtime.</p>
                 </div>

                 <div className="bg-[#0A0F1E]/80 border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Select System Venue
                      </label>
                      <select 
                        value={formData.venue}
                        onChange={e => setFormData({...formData, venue: e.target.value})}
                        className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all font-medium appearance-none"
                      >
                         <option value="Wankhede Stadium">Wankhede Stadium, Mumbai</option>
                         <option value="DY Patil Stadium">DY Patil Stadium, Mumbai</option>
                         <option value="PVR Director's Cut">PVR Director's Cut, Delhi</option>
                         <option value="Jio World Drive">Jio World Drive Arena, Mumbai</option>
                      </select>
                      <p className="text-[10px] text-white/40 italic ml-1 mt-1">Note: The Seat Layout mapped to this venue will automatically link to the booking flow.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest flex items-center gap-2">
                           <CalendarIcon className="w-3.5 h-3.5" /> Primary Event Date
                         </label>
                         <input 
                           type="date" 
                           value={formData.date}
                           onChange={e => setFormData({...formData, date: e.target.value})}
                           className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#1D8EFF] transition-all font-medium"
                         />
                       </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                      <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest">Showtimes / Batches</label>
                      
                      <div className="flex flex-wrap gap-2">
                         {formData.showtimes.map((st, i) => (
                           <div key={i} className="bg-[#1D8EFF]/10 border border-[#1D8EFF]/20 text-[#1D8EFF] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                              {st}
                           </div>
                         ))}
                         <button className="bg-white/5 border border-dashed border-white/20 text-white/40 hover:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Add Time
                         </button>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* ── STEP 3: Pricing & Config ── */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white mb-2">Ticketing & Revenue</h2>
                    <p className="text-white/40">Configure base price anchoring and platform commission metrics before deploying.</p>
                 </div>

                 <div className="bg-[#0A0F1E]/80 border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-8">
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-widest flex items-center gap-2">
                           <Ticket className="w-3.5 h-3.5" /> Base Ticket Price (₹)
                         </label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black tracking-widest">INR</span>
                            <input 
                              type="number" 
                              value={formData.basePrice}
                              onChange={e => setFormData({...formData, basePrice: e.target.value})}
                              className="w-full bg-[#111D35] border border-white/[0.08] rounded-xl pl-16 pr-4 py-3.5 text-white focus:outline-none focus:border-[#1D8EFF] focus:bg-[#111D35]/80 transition-all font-black text-xl shadow-inner"
                            />
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-purple-400/60 ml-1 uppercase tracking-widest flex items-center gap-2">
                           VIP/Premium Base Price (₹)
                         </label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/40 font-black tracking-widest">INR</span>
                            <input 
                              type="number" 
                              value={formData.vipPrice}
                              onChange={e => setFormData({...formData, vipPrice: e.target.value})}
                              className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl pl-16 pr-4 py-3.5 text-white focus:outline-none focus:border-purple-500 focus:bg-purple-500/10 transition-all font-black text-xl shadow-inner"
                            />
                         </div>
                       </div>
                    </div>

                    <div className="bg-[#111D35] p-5 rounded-2xl border border-white/[0.05]">
                       <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">Platform Processing Fee (%)</p>
                            <p className="text-[10px] text-white/40 mt-1">This amount is automatically added to the customer checkout cart as Revenue.</p>
                          </div>
                          <div className="relative w-24">
                            <input 
                              type="number" 
                              value={formData.platformFee}
                              onChange={e => setFormData({...formData, platformFee: e.target.value})}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-right font-bold focus:outline-none focus:border-emerald-500"
                            />
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                       <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                       <h3 className="text-lg font-black text-white">Ready for Launch</h3>
                       <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto leading-relaxed">By clicking Publish, this event will be immediately visible to platform customers and mapped to its assigned Venue Layout.</p>
                    </div>

                 </div>
              </div>
            )}

         </div>
      </div>
    </div>
  );
}
