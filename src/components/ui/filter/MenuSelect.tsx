import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  className?: string;
  buttonClassName?: string;
  placeholder?: string;
  align?: "left" | "right";
  width?: number | string;
  disabled?: boolean;
};

export function MenuSelect<T extends string>({
  value,
  onChange,
  options,
  className,
  buttonClassName,
  placeholder = "Chọn…",
  align = "left",
  width,
  disabled = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  );

  const [coords, setCoords] = useState<{ left: number; top: number; maxH: number; width: number }>(
    { left: 0, top: 0, maxH: 280, width: 200 }
  );

  const computePosition = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const w = typeof width === "number" ? width : Math.round(r.width);

    const margin = 8;
    const spaceBelow = viewportH - r.bottom - margin;
    const spaceAbove = r.top - margin;

    let openDown = true;
    let maxH = Math.min(320, spaceBelow);
    if (maxH < 160 && spaceAbove > spaceBelow) {
      openDown = false;
      maxH = Math.min(320, spaceAbove);
    }

    let left = align === "left" ? r.left : r.right - w;
    left = Math.max(margin, Math.min(left, viewportW - w - margin));

    const top = openDown ? r.bottom + margin : Math.max(margin, r.top - margin - maxH);

    setCoords({
      left: Math.round(left),
      top: Math.round(top),
      maxH: Math.max(160, Math.round(maxH)),
      width: w,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
    const onWin = () => computePosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, align, width]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[activeIdx];
      if (opt) onChange(opt.value);
      setOpen(false);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={clsx("relative", className)}>
      {/* Button */}
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "w-full h-10 rounded-xl px-3 pr-9 text-sm text-left transition",
          // Light
          "bg-white ring-1 ring-zinc-200 text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-300/40",
          // Dark
          "dark:bg-white/[0.04] dark:ring-white/10 dark:text-white dark:hover:bg-white/[0.06] dark:focus:ring-white/25",
          disabled && "opacity-50 cursor-not-allowed",
          buttonClassName
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={clsx(
            "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
            "text-zinc-500 dark:text-white/55"
          )}
        />
      </button>

      {/* Menu */}
      {open &&
        createPortal(
          <AnimatePresence>
            {/* click-away layer (transparent) */}
            <motion.div
              key="ms-backdrop"
              className="fixed inset-0 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="ms-menu"
              ref={listRef}
              role="listbox"
              aria-activedescendant={`opt-${activeIdx}`}
              className={clsx(
                "fixed z-[9999] rounded-xl overflow-auto",
                // Light
                "bg-white ring-1 ring-zinc-200 shadow-lg",
                // Dark
                "dark:ring-white/12 dark:backdrop-blur-md dark:shadow-[0_18px_48px_rgba(0,0,0,0.55)]",
              )}
              style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
                maxHeight: coords.maxH,
                // gradient nền cho dark, light để trắng phẳng
                background:
                  typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                    ? "linear-gradient(180deg, rgba(20,22,28,0.96), rgba(16,18,24,0.94))"
                    : undefined,
              }}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              onKeyDown={onKeyDown}
            >
              <div className="py-1">
                {options.map((opt, i) => {
                  const isSelected = opt.value === value;
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={opt.value}
                      id={`opt-${i}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={clsx(
                        "w-full text-left px-3 py-2 text-sm transition select-none",
                        // Light
                        isActive ? "bg-zinc-100" : "hover:bg-zinc-50",
                        isSelected ? "text-zinc-900" : "text-zinc-700",
                        // Dark (ghi đè)
                        "dark:hover:bg-white/[0.06] dark:text-white/85",
                        isActive && "dark:bg-white/10",
                        isSelected && "dark:text-white"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
