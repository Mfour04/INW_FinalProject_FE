export const gradientBtn = [
  "relative w-full rounded-full border-none font-semibold",
  "text-sm px-4 py-1.5 text-white",
  "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
  "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
  "shadow-[0_10px_24px_rgba(255,103,64,0.35)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.55)]",
  "transition-colors duration-300",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/70",
  "overflow-hidden before:content-[''] before:absolute before:inset-0",
  "before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.22),transparent_55%)]",
  "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  // light mode adjust
  "disabled:opacity-60",
].join(" ");

export const buyBtn = [
  "relative w-full rounded-full font-semibold",
  "text-[12px] px-3 py-1.5 text-white",
  "!bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]",
  "hover:from-[#7c83ff] hover:via-[#9d6cff] hover:to-[#b59cff]",
  "shadow-[0_10px_24px_rgba(139,92,246,0.35)] hover:shadow-[0_14px_32px_rgba(139,92,246,0.55)]",
  "transition-colors duration-300",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/60",
  "disabled:opacity-60",
].join(" ");

export const MAX_LEN = 750;
export const scoreKeys = ["1", "2", "3", "4", "5"] as const;
