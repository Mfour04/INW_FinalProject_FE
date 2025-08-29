// src/pages/Home/ui/tokens.ts

// ==== BASE (token cũ) ====
export const BASE_TOKENS = {
  // Giữ 'container' ở BASE nhưng sẽ bị override bởi LAYOUT
  container: "max-w-[1200px]" as string, // WIDEN để tránh literal conflict nơi khác
  gutter: "gap-8",
  radius: "rounded-2xl",
  ring: "ring-1 ring-zinc-800",

  panels: {
    base: "bg-[#141416]",
    header: "bg-[#1b1c20] border border-zinc-800",
  },

  list: {
    row: "flex items-center gap-4 p-3 rounded-xl",
    title: "font-semibold truncate",
    metaSep: "text-white/20",
  },

  poster: {
    base:
      "relative aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800 bg-[#141416]",
    img: "h-full w-full object-cover",
    skeleton: "h-full w-full animate-pulse bg-zinc-800/50",
  },
} as const;

// ==== LAYOUT (token mới) ====
// - Mobile: full width
// - Bắt đầu giới hạn từ 'sm' trở lên
export const LAYOUT_TOKENS = {
  container:
    ("w-full mx-auto max-w-none sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[1400px] 2xl:max-w-[1600px]" as string),

  // Padding ngang & dọc theo breakpoint (có 'xs' nếu bạn đã khai báo trong Tailwind config)
  sectionPad: "px-3 xs:px-3.5 sm:px-4 md:px-6 lg:px-8 xl:px-10",
  sectionY: "py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12",
} as const;

// Header dùng chung
export const HEADER =
  "flex items-center justify-between mb-3 sm:mb-4 md:mb-6" as const;

// ==== MERGE (phẳng) ====
// Type đảm bảo TOKENS có đủ sectionPad/sectionY, tránh lỗi TS 'không tồn tại trên type ...'
export type Tokens = Omit<typeof BASE_TOKENS, "container"> & typeof LAYOUT_TOKENS;

// Runtime merge: ưu tiên LAYOUT_TOKENS.container, giữ nguyên các nhóm còn lại
export const DESIGN_TOKENS: Tokens = { ...BASE_TOKENS, ...LAYOUT_TOKENS } as Tokens;
