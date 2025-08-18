import React from "react";

export const SkeletonCard: React.FC = () => (
  <div className="rounded-xl overflow-hidden bg-[#0f1116]/90 ring-1 ring-white/8 backdrop-blur-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.65)] animate-pulse">
    <div className="aspect-[3/4] bg-white/[0.06]" />
    <div className="p-3.5 space-y-2">
      <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
      <div className="h-3 w-1/2 bg-white/[0.06] rounded" />
    </div>
  </div>
);
