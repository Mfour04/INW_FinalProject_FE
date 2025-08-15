import { useEffect, useRef, useState } from "react";
import type { UiBank, VietQrBank } from "./BankSelectType";
import { useQuery } from "@tanstack/react-query";
import { GetQrBanks } from "../../../../api/BankAccount/bank.api";

type InlineBankSelectProps = {
  value: UiBank | null;
  onSelect: (b: UiBank) => void;
  placeholder?: string;
  className?: string;
};

export const InlineBankSelect = ({
  value,
  onSelect,
  placeholder = "Chọn ngân hàng",
  className,
}: InlineBankSelectProps) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: vietqrBanks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vietqrBanks"],
    queryFn: async () => {
      const res = await GetQrBanks();
      const raw: VietQrBank[] = res.data?.data ?? [];
      return raw
        .filter((b) => b.transferSupported === 1)
        .map((b) => ({ shortName: b.shortName, logo: b.logo }))
        .sort((a, b) => a.shortName.localeCompare(b.shortName, "vi"));
    },
    staleTime: 1000 * 60 * 5,
  });

  const data = Array.isArray(vietqrBanks)
    ? vietqrBanks.filter((b) =>
        (b.shortName || "").toLowerCase().includes(q.trim().toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isError) setErr("Không tải được danh sách ngân hàng");
  }, [isError]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={["relative", className || "w-2/3"].join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-8 px-2 rounded-md border border-zinc-700 bg-zinc-800 text-white text-xs flex items-center justify-between hover:border-zinc-500 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {value ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 shrink-0 grid place-items-center">
                {value.logo ? (
                  <img
                    src={value.logo}
                    alt={value.shortName}
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                ) : (
                  <span className="h-4 w-4 rounded bg-zinc-700 text-[9px] leading-4 text-white grid place-items-center">
                    {(value.shortName || "BK").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              {value.shortName}
            </span>
          ) : (
            <span className="text-zinc-400">{placeholder}</span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 ml-2 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 shadow-lg overflow-hidden">
          <div className="p-2 border-b border-zinc-800">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm ngân hàng..."
                className="w-full h-8 pl-7 pr-2 rounded-md bg-zinc-800 text-white text-xs placeholder-zinc-500 border border-zinc-700 focus:border-[#ff6740] outline-none"
              />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div role="listbox" tabIndex={-1} className="max-h-60 overflow-auto">
            {isLoading && (
              <div className="px-2 py-3 text-xs text-zinc-400">Đang tải...</div>
            )}
            {!isLoading && err && (
              <div className="px-2 py-3 text-xs text-red-400">{err}</div>
            )}
            {!isLoading && !err && (
              <>
                {data?.length ? (
                  data.map((b, idx) => (
                    <div
                      key={`${b.shortName}-${idx}`}
                      role="option"
                      aria-selected={value?.shortName === b.shortName}
                      tabIndex={0}
                      onClick={() => {
                        onSelect(b);
                        setOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(b);
                          setOpen(false);
                        }
                      }}
                      className={[
                        "px-2 py-2 text-xs cursor-pointer flex items-center gap-2",
                        "hover:bg-zinc-800 transition",
                      ].join(" ")}
                      title={b.shortName}
                    >
                      <span className="h-6 w-6 shrink-0 grid place-items-center">
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt={b.shortName}
                            className="h-6 w-6 object-contain"
                            draggable={false}
                          />
                        ) : (
                          <span className="h-6 w-6 rounded bg-zinc-700 text-white text-[10px] grid place-items-center">
                            {b.shortName.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className="text-white">{b.shortName}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-3 text-xs text-zinc-400">
                    Không tìm thấy ngân hàng
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
