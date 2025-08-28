export const Hairline = ({ className = "" }: { className?: string }) => (
  <div className={`relative h-px ${className}`}>
    {/* Base line */}
    <div className="absolute inset-0 bg-zinc-200 dark:bg-white/8" />
    {/* Highlight gradient */}
    <div className="absolute inset-x-0 -top-px h-px 
      bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent 
      dark:via-white/20" 
    />
  </div>
);
