import { useEffect } from "react";

export function useAutoGrow(
  ref: React.RefObject<HTMLTextAreaElement>,
  value: string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(Math.max(el.scrollHeight, 44), 240); 
    el.style.height = `${next}px`;
  }, [value, ref]);
}
