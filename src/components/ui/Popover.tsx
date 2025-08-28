import React, { useEffect, useRef } from "react";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export const Popover: React.FC<Props> = ({ anchorEl, open, onClose, children, className = "" }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node) && !anchorEl?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const style: React.CSSProperties = {
    position: "fixed",
    top: rect.bottom + 8,
    left: rect.right,
    transform: "translateX(-100%)",
    zIndex: 60,
  };

  return (
    <div ref={ref} style={style}
      className={[
        "min-w-40 rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.25)] ring-1",
        "bg-white text-zinc-900 ring-black/10",
        "dark:bg-[#121419] dark:text-white dark:ring-white/10",
        "backdrop-blur supports-[backdrop-filter]:bg-white/90 supports-[backdrop-filter]:dark:bg-[#121419]/90",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};
