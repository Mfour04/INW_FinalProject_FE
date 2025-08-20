import { Check } from "lucide-react";

type StepperProps = {
  current: number; // 1..3
};

const STEPS = [
  { id: 1, label: "Tiêu đề" },
  { id: 2, label: "Nội dung" },
  { id: 3, label: "Lịch & Giá" },
];

// Kích thước & khoảng cách phải khớp với Tailwind đang dùng bên dưới
const DOT = 32;       // h-8 w-8
const HALF = DOT / 2; // 16px
const GAP = 12;       // space-y-3 = 0.75rem = 12px

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
            {/* Cột trái: line + dot. Line không xuyên dot, không dùng màu cam */}
            <div className="relative w-10">
              {/* Đoạn trên: từ top đến (tâm - bán kính) + bù nửa GAP để nối qua khoảng cách ngoài li */}
              {!isFirst && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-[-6px] w-px bg-white/14 rounded-full"
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
              {/* Tô đậm line phần đã đi qua (vẫn là trắng, chỉ sáng hơn) */}
              {!isFirst && (done || active) && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-[-6px] w-px bg-white/35 rounded-full"
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}

              {/* DOT canh giữa item */}
              <div
                className={[
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "h-8 w-8 rounded-full grid place-items-center ring-1 transition",
                  done
                    ? "bg-white/90 text-black ring-white/80"
                    : active
                    ? "bg-[linear-gradient(90deg,#ff6740,#ff9966)] text-white ring-white/40"
                    : "bg-white/[0.08] text-white/70 ring-white/10",
                ].join(" ")}
                aria-hidden
              >
                {done ? <Check className="h-4 w-4" /> : <span className="text-[12px] leading-none">{s.id}</span>}
              </div>

              {/* Đoạn dưới: từ (tâm + bán kính) đến bottom + bù nửa GAP để nối qua khoảng cách ngoài li */}
              {!isLast && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-px bg-white/14 rounded-full"
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
              {/* Phần dưới đã hoàn tất (chỉ khi step này đã xong hẳn) */}
              {!isLast && done && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-px bg-white/35 rounded-full"
                  style={{ height: `calc(50% - ${HALF}px + ${GAP / 2}px)` }}
                  aria-hidden
                />
              )}
            </div>

            {/* Thẻ mô tả bước (chỉ hiển thị, không click) */}
            <div
              className={[
                "rounded-xl px-3 py-2 ring-1 transition",
                active ? "bg-white/[0.10] ring-white/20" : "bg-white/[0.04] ring-white/10",
              ].join(" ")}
              aria-current={active ? "step" : undefined}
            >
              <div className="text-[13px] font-semibold">{s.label}</div>
              <div className="text-[12px] text-white/60">
                {active ? "Đang thực hiện" : done ? "Hoàn tất" : "Chưa thực hiện"}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
