import { useEffect, useRef, useState } from "react";

type Opt = { label: string; value: any };

type Props = {
  value: any;
  onChange: (v: any) => void;
  options: Opt[];
  className?: string;
  placeholder?: string;
};

export const CustomSelect = ({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Chọn...",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value)
    )
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function commit(i: number) {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>
  ) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open) setOpen(true);
      else commit(active);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={[
          "h-9 min-w-[160px] px-3 rounded-md text-sm flex items-center justify-between",
          "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
          "dark:bg-white/5 dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/10",
          "focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-white/20",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <span className="ml-2 text-slate-500 dark:text-white/60 text-xs">
          ▾
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={[
            "absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md shadow-lg",
            "bg-white ring-1 ring-slate-200",
            "dark:bg-[#0f1318] dark:ring-white/10",
          ].join(" ")}
        >
          {options.map((o, i) => {
            const isActive = i === active;
            const isSelected = o.value === value;
            return (
              <div
                key={String(o.value)}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(i)}
                className={[
                  "px-3 py-2 text-sm cursor-pointer",
                  isActive
                    ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                    : "text-slate-700 dark:text-white/80",
                  isSelected ? "font-semibold" : "font-normal",
                ].join(" ")}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
