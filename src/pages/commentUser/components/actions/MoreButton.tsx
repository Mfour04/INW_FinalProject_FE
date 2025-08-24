import React, { useEffect, useRef, useState } from "react";
import { Flag, Ban, MoreHorizontal } from "lucide-react";

export const MoreButton = () => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!btnRef.current || !popRef.current) return;
      if (!btnRef.current.contains(target) && !popRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở menu tác vụ"
        aria-expanded={open}
        className={[
          "inline-flex items-center justify-center h-6 w-6 rounded-[5px] transition-all",
          // light
          "border border-gray-300 bg-white/80 hover:bg-white",
          "shadow-sm",
          // dark
          "dark:border-white/20 dark:bg-white/12 dark:hover:bg-white/18",
          "dark:focus-visible:ring-2 dark:focus-visible:ring-white/40",
          open ? "dark:bg-white/18 dark:border-white/30" : "",
        ].join(" ")}
      >
        <MoreHorizontal className="h-3.5 w-3.5 opacity-90" />
      </button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          className={[
            "absolute right-0 mt-2 min-w-[200px] rounded-xl px-1.5 py-0.5 z-50",
            // light
            "bg-white/95 text-gray-900 border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur",
            // dark
            "dark:bg-[rgba(18,20,26,0.96)] dark:text-white dark:border dark:border-white/12 dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)]",
          ].join(" ")}
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                alert("Báo cáo người dùng");
              }}
              className={[
                "inline-flex items-center justify-center gap-1.5 h-7 rounded-lg px-1.5 text-[12px] transition",
                "hover:bg-gray-100",
                "dark:hover:bg-white/10",
              ].join(" ")}
            >
              <Flag className="h-[14px] w-[14px]" />
              Báo cáo
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                alert("Đã chặn người dùng");
              }}
              className={[
                "inline-flex items-center justify-center gap-1.5 h-7 rounded-lg px-1.5 text-[12px] transition",
                "hover:bg-gray-100",
                "dark:hover:bg-white/10",
              ].join(" ")}
            >
              <Ban className="h-[14px] w-[14px]" />
              Chặn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
