import { useEffect, useState } from "react";

type Breakpoints = {
  xs: boolean; // <= 359
  sm: boolean; // 360–639
  md: boolean; // 640–1023
  lg: boolean; // 1024–1279
  xl: boolean; // 1280–1919
  x2k: boolean; // 1920–2559
  x4k: boolean; // >= 2560
};

export function useBreakpoint(): Breakpoints {
  const query = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

  const calc = (): Breakpoints => ({
    xs: query("(max-width: 359px)"),
    sm: query("(min-width: 360px) and (max-width: 639px)"),
    md: query("(min-width: 640px) and (max-width: 1023px)"),
    lg: query("(min-width: 1024px) and (max-width: 1279px)"),
    xl: query("(min-width: 1280px) and (max-width: 1919px)"),
    x2k: query("(min-width: 1920px) and (max-width: 2559px)"),
    x4k: query("(min-width: 2560px)"),
  });

  const [bp, setBp] = useState<Breakpoints>(calc);

  useEffect(() => {
    const handler = () => setBp(calc());
    window.addEventListener("resize", handler);
    // cập nhật ngay khi mount (đề phòng SSR/hydration)
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
}
