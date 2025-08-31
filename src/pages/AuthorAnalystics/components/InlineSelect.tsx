import { Check, ChevronDown } from "lucide-react";
import ReactDOM from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    up?: boolean;
  } | null>(null);
  const selected = options.find((o) => o.value === (value ?? ""))?.label;

  const measure = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom;
    const menuH = 280;
    const up = spaceBelow < menuH && rect.top > menuH;
    setCoords({
      top:
        (up ? rect.top - Math.min(menuH, rect.top) : rect.bottom) +
        window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      up,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    measure();
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // Nếu click bên trong button/wrapper hoặc bên trong menu (portal) thì KHÔNG đóng
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onWin = () => measure();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, measure]);

  return (
    <div ref={wrapperRef} className={className} style={{ width }}>
      <button
        ref={btnRef}
        type="button"
        title={title}
        onClick={() => setOpen((s) => !s)}
        className="w-full h-9 px-3 rounded-xl bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08] transition inline-flex items-center justify-between"
      >
        <span className="min-w-0 text-left text-sm text-white truncate">
          {selected ?? placeholder ?? "Chọn"}
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
            className="absolute z-50 rounded-xl bg-[#0c121a] ring-1 ring-white/10 shadow-xl overflow-hidden"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transformOrigin: coords.up ? "bottom left" : "top left",
            }}
          >
            <ul className="max-h-72 overflow-auto py-1">
              {options.map((o) => {
                const active = (value ?? "") === o.value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(o.value || undefined);
                        setOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-sm flex items-center justify-between hover:bg-white/[0.06] ${
                        active ? "bg-white/[0.10]" : ""
                      }`}
                      title={o.label}
                    >
                      <span
                        className={`max-w-[calc(100%-18px)] truncate ${
                          active ? "text-white" : "text-white/85"
                        }`}
                      >
                        {o.label}
                      </span>
                      {active && <Check className="h-4 w-4 opacity-90" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};
