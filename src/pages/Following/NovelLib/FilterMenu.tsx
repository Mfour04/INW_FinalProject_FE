import { BookOpenCheck, Clock, CheckCheck, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FilterKey = "reading" | "wishlist" | "done";

const FILTER_LABEL: Record<FilterKey, string> = {
  reading: "Đang đọc",
  wishlist: "Sẽ đọc",
  done: "Hoàn thành",
};

const FILTER_ICON: Record<FilterKey, React.ReactNode> = {
  reading: <BookOpenCheck size={16} />,
  wishlist: <Clock size={16} />,
  done: <CheckCheck size={16} />,
};

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

type Props = {
  value: FilterKey;
  onChange: (v: FilterKey) => void;
};

export const FilterMenu = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="group h-9 pl-3 pr-2 rounded-lg bg-white/[0.06] text-white ring-1 ring-white/10 hover:bg-white/[0.1] focus:outline-none inline-flex items-center gap-2 transition"
      >
        {FILTER_ICON[value]}
        <span className="text-sm">{FILTER_LABEL[value]}</span>
        <ChevronDown size={16} className="opacity-80 transition" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md z-50"
          role="menu"
        >
          {(["reading", "wishlist", "done"] as FilterKey[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                onChange(k);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-white/[0.06] transition"
            >
              {FILTER_ICON[k]}
              <span>{FILTER_LABEL[k]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
