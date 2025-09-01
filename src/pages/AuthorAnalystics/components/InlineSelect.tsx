import { Check, ChevronDown } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import ReactDOM from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Option = { value: string; label: string };

type Props = {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  title?: string;
  width?: number;
};

export const InlineSelect = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  title,
  width = 220,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const listboxId = useId();
  const buttonId = useId();

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    up?: boolean;
  } | null>(null);

  const selectedOpt = options.find((o) => o.value === (value ?? "")) ?? null;
  const selectedLabel = selectedOpt?.label;

  const measure = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom;
    const menuH = 280;
    const up = spaceBelow < menuH && rect.top > menuH;

    const widthPx = rect.width;
    // Clamp X để không tràn màn hình khi portal
    const leftRaw = rect.left + window.scrollX;
    const maxLeft = vw - widthPx - 8;
    const left = Math.max(8, Math.min(leftRaw, maxLeft));

    setCoords({
      top:
        (up ? rect.top - Math.min(menuH, rect.top) : rect.bottom) +
        window.scrollY,
      left,
      width: widthPx,
      up,
    });
  }, []);

  // Mở menu thì đo & bind event outside/escape/resize/scroll
  useEffect(() => {
    if (!open) return;

    // Set activeIndex = selected khi mở
    const selIdx = options.findIndex((o) => o.value === (value ?? ""));
    setActiveIndex(selIdx);

    measure();
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // click trong button/wrapper hoặc menu thì không đóng
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onWin = () => measure();

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc as any);
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);

    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc as any);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, measure, options, value]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => {
        const next = Math.min(options.length - 1, (idx < 0 ? -1 : idx) + 1);
        scrollIntoViewIfNeeded(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => {
        const prev = Math.max(0, (idx < 0 ? options.length : idx) - 1);
        scrollIntoViewIfNeeded(prev);
        return prev;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < options.length) {
        const opt = options[activeIndex];
        onChange(opt.value || undefined);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      // Đóng khi tab đi
      setOpen(false);
    }
  };

  const scrollIntoViewIfNeeded = (idx: number) => {
    const el = document.getElementById(`${listboxId}-opt-${idx}`);
    const list = document.getElementById(listboxId);
    if (el && list) {
      const elTop = el.offsetTop;
      const elBottom = elTop + el.clientHeight;
      const viewTop = list.scrollTop;
      const viewBottom = viewTop + list.clientHeight;
      if (elTop < viewTop) list.scrollTop = elTop;
      else if (elBottom > viewBottom) list.scrollTop = elBottom - list.clientHeight;
    }
  };

  return (
    <div ref={wrapperRef} className={className} style={{ width }}>
      <button
        ref={btnRef}
        id={buttonId}
        type="button"
        title={title}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={handleKeyDown}
        className={`w-full h-9 px-3 rounded-xl transition inline-flex items-center justify-between
                    bg-white ring-1 ring-zinc-200 hover:bg-zinc-50 text-sm text-zinc-900
                    dark:bg-white/[0.04] dark:ring-white/10 dark:hover:bg-white/[0.08] dark:text-white`}
      >
        <span className="min-w-0 text-left text-sm truncate">
          {selectedLabel ?? placeholder ?? "Chọn"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        coords &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            role="presentation"
            className="absolute z-50"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transformOrigin: coords.up ? "bottom left" : "top left",
            }}
          >
            <div
              className={`rounded-xl shadow-xl overflow-hidden
                          bg-white ring-1 ring-zinc-200
                          dark:bg-[#0c121a] dark:ring-white/10`}
            >
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={buttonId}
                tabIndex={-1}
                className="max-h-72 overflow-auto py-1 focus:outline-none"
                onKeyDown={handleKeyDown}
              >
                {options.length === 0 && (
                  <li className="px-3 py-2.5 text-sm text-zinc-500 dark:text-white/60">
                    Không có dữ liệu
                  </li>
                )}

                {options.map((o, idx) => {
                  const active = (value ?? "") === o.value;
                  const highlighted = idx === activeIndex;

                  return (
                    <li key={o.value} id={`${listboxId}-opt-${idx}`} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(o.value || undefined);
                          setOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full px-3 py-2.5 text-sm flex items-center justify-between transition
                                    ${highlighted ? "bg-zinc-100 dark:bg-white/[0.08]" : ""}
                                    ${active ? "bg-zinc-100/70 dark:bg-white/[0.10]" : ""}`}
                        title={o.label}
                      >
                        <span
                          className={`max-w-[calc(100%-18px)] truncate
                                      ${active ? "text-zinc-900 dark:text-white" : "text-zinc-800 dark:text-white/85"}`}
                        >
                          {o.label}
                        </span>
                        {active && <Check className="h-4 w-4 text-zinc-700 dark:text-white/90" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
