export const Hairline = ({ className = "" }: { className?: string }) => (
  <div className={`relative h-px ${className}`}>
    <div className="absolute inset-0 bg-white/8" />
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);
