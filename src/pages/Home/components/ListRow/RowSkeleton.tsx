export const RowSkeleton = ({ className }: { className: string }) => (
  <div
    className={[
      "flex items-center gap-4 p-3 rounded-xl",
      "bg-white/5 animate-pulse",
      className ?? "",
    ].join(" ")}
  >
    <div className="h-16 w-12 rounded-md bg-white/10" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-3 w-2/3 rounded bg-white/10" />
      <div className="h-3 w-1/3 rounded bg-white/10" />
    </div>
  </div>
);
