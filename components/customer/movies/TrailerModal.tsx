"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, title, onClose }: TrailerModalProps) {
  // Close on Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1D8EFF]/70 mb-0.5">
              Official Trailer
            </p>
            <h3 className="text-base font-bold text-white truncate max-w-lg">{title}</h3>
          </div>
          <button
            id="trailer-close-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* YouTube iFrame */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} – Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-white/20 mt-3">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-white/40">ESC</kbd> or click outside to close
        </p>
      </div>
    </div>
  );
}
