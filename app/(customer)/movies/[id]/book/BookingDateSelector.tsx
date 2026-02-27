"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  movieId: string;
  activeDateStr: string;
}

export default function BookingDateSelector({ movieId, activeDateStr }: Props) {
  const router = useRouter();

  // Generate 7 days starting from today
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const isoString = d.toISOString().split("T")[0];
      const isToday = i === 0;
      const isTomorrow = i === 1;

      let displayDay = d.toLocaleDateString("en-US", { weekday: "short" });
      if (isToday) displayDay = "Today";
      else if (isTomorrow) displayDay = "Tom";

      arr.push({
        dateObj: d,
        isoString,
        displayDay,
        displayDate: d.getDate(),
        displayMonth: d.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return arr;
  }, []);

  const handleSelectDate = (isoString: string) => {
    // Only update URL if it's different
    if (isoString !== activeDateStr) {
      router.push(`/movies/${movieId}/book?date=${isoString}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
        <ChevronLeft className="w-4 h-4 text-white/50" />
      </button>

      <div className="flex flex-1 gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {dates.map((d) => {
          const isActive = d.isoString === activeDateStr;
          return (
            <button
              key={d.isoString}
              onClick={() => handleSelectDate(d.isoString)}
              className={`snap-center shrink-0 flex flex-col items-center justify-center w-[72px] h-[88px] rounded-2xl transition-all ${
                isActive 
                  ? "bg-[#026CDF] border border-[#026CDF] shadow-[0_0_15px_rgba(2,108,223,0.5)] scale-105" 
                  : "bg-[#111D35] border border-white/[0.06] hover:border-white/20 hover:bg-[#111D35]/80"
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isActive ? "text-white/80" : "text-white/40"}`}>
                {d.displayMonth}
              </span>
              <span className={`text-2xl font-black leading-none ${isActive ? "text-white" : "text-white/90"}`}>
                {d.displayDate}
              </span>
              <span className={`text-[11px] font-medium mt-1 ${isActive ? "text-white" : "text-white/50"}`}>
                {d.displayDay}
              </span>
            </button>
          );
        })}
      </div>

      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
        <ChevronRight className="w-4 h-4 text-white/50" />
      </button>
    </div>
  );
}
