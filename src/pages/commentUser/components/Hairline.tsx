export const Hairline = ({ className = "" }: { className?: string }) => (
  <div className={`relative h-px ${className}`}>
    <div className="absolute inset-0 dark:bg-white/8 bg-black/10" />
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent dark:via-white/20 via-black/20 to-transparent" />
  </div>
);
