export const TOKENS = {
  container: "max-w-[1200px]",
  gutter: "gap-8",
  radius: "rounded-2xl",
  ring: "ring-1 ring-zinc-800",
  panels: {
    base: "bg-[#141416]",
    header: "bg-[#1b1c20] border border-zinc-800",
  },
  list: {
    rowH: "h-24", // 96px
    thumb: "h-20 w-16", // 80x64
  },
  poster: {
    h: "h-[260px]",
    w: "w-[176px]",
  },
} as const;

export const PANEL = `${TOKENS.radius} ${TOKENS.ring} ${TOKENS.panels.base}`;
export const HEADER = `${TOKENS.radius} ${TOKENS.panels.header} h-12 flex items-center justify-between px-4`;