import { Check } from "lucide-react";

type StepperProps = { current: number }; // 1..3

const STEPS = [
  { id: 1, label: "Tiêu đề" },
  { id: 2, label: "Nội dung" },
  { id: 3, label: "Lịch & Giá" },
];

const DOT = 32; // h-8 w-8
const HALF = DOT / 2;
const GAP = 12; // space-y-3

export const Stepper = ({ current }: StepperProps) => {
  const clamped = Math.min(Math.max(current, 1), STEPS.length);

  return (
    <ul className="space-y-3 select-none">
      {STEPS.map((s, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === STEPS.length - 1;
        const done = clamped > s.id;
        const active = clamped === s.id;

        return (
          <li key={s.id} className="grid grid-cols-[40px_1fr] gap-3 items-stretch">
            {/* Cột trái: line + dot */}
            <div className="relative w-10">
              {!isFirst && (
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 top-[-6px] w-px rounded-full",
                    // Light
                    "bg-zinc-200",
                    // Dark
                    "dark:bg-white/14",
                  ].join(" ")}
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
              {!isFirst && (done || active) && (
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 top-[-6px] w-px rounded-full",
                    // Light
                    "bg-zinc-400",
                    // Dark
                    "dark:bg-white/35",
                  ].join(" ")}
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}

              {/* DOT */}
              <div
                className={[
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "h-8 w-8 rounded-full grid place-items-center ring-1 transition",
                  done
                    ? [
                        // Light
                        "bg-zinc-900 text-white ring-zinc-800",
                        // Dark
                        "dark:bg-white/90 dark:text-black dark:ring-white/80",
                      ].join(" ")
                    : active
                    ? "ring-white/40 bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_45%,#ff9966_100%)] text-white"
                    : [
                        // Light
                        "bg-zinc-100 text-zinc-600 ring-zinc-200",
                        // Dark
                        "dark:bg-white/[0.08] dark:text-white/70 dark:ring-white/10",
                      ].join(" "),
                ].join(" ")}
                aria-hidden
              >
                {done ? <Check className="h-4 w-4" /> : <span className="text-[12px] leading-none">{s.id}</span>}
              </div>

              {!isLast && (
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-px rounded-full",
                    // Light
                    "bg-zinc-200",
                    // Dark
                    "dark:bg-white/14",
                  ].join(" ")}
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
              {!isLast && done && (
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-px rounded-full",
                    // Light
                    "bg-zinc-400",
                    // Dark
                    "dark:bg-white/35",
                  ].join(" ")}
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
            </div>

            {/* Mô tả bước */}
            <div
              className={[
                "rounded-xl px-3 py-2 ring-1 transition",
                active
                  ? [
                      // Light
                      "bg-zinc-100 ring-zinc-200",
                      // Dark
                      "dark:bg-white/10 dark:ring-white/20",
                    ].join(" ")
                  : [
                      // Light
                      "bg-white ring-zinc-200 shadow-sm",
                      // Dark
                      "dark:bg-white/[0.04] dark:ring-white/10 dark:shadow-none",
                    ].join(" "),
              ].join(" ")}
              aria-current={active ? "step" : undefined}
            >
              <div className="text-[13px] font-semibold text-zinc-900 dark:text-white">{s.label}</div>
              <div className="text-[12px] text-zinc-600 dark:text-white/60">
                {active ? "Đang thực hiện" : done ? "Hoàn tất" : "Chưa thực hiện"}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
