import type { ChapterForm } from "../UpsertChapter";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Rocket,
  FileClock,
  Coins,
  BadgeDollarSign,
  Info,
} from "lucide-react";

type ScheduleAndPriceStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: React.Dispatch<React.SetStateAction<ChapterForm>>;
};

type PublishOption = "draft" | "now" | "scheduled";

export const ScheduleAndPrice = ({
  chapterForm,
  setChapterForm,
}: ScheduleAndPriceStepProps) => {
  const [publishOption, setPublishOption] = useState<PublishOption>(
    chapterForm.isDraft
      ? "draft"
      : chapterForm.scheduledAt
      ? "scheduled"
      : "now"
  );

  const initialDate = chapterForm.scheduledAt
    ? toDateInputValue(new Date(chapterForm.scheduledAt))
    : "";

  const [dateStr, setDateStr] = useState<string>(initialDate);
  const [isPaid, setIsPaid] = useState<boolean>(chapterForm.isPaid);
  const [price, setPrice] = useState<number>(chapterForm.price || 1);

  const publishDate: Date | null = useMemo(() => {
    if (publishOption !== "scheduled" || !dateStr) return null;
    return parseLocalDate(dateStr); 
  }, [publishOption, dateStr]);

  useEffect(() => {
    setChapterForm((prev) => {
      const next: ChapterForm = {
        ...prev,
        isPaid,
        price: isPaid ? price : 0,
        isDraft: publishOption === "draft",
        isPublic: publishOption !== "draft",
        scheduledAt: publishOption === "scheduled" ? publishDate : null,
      };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, [publishOption, isPaid, price, publishDate, setChapterForm]);

  const minDate = toDateInputValue(new Date());

  const helperText = useMemo(() => {
    if (publishOption === "draft") return "Lưu dưới dạng bản nháp (không công khai).";
    if (publishOption === "now") return "Xuất bản ngay sau khi lưu.";
    if (publishOption === "scheduled") {
      return publishDate
        ? `Xuất bản lúc 00:00 ngày ${formatHumanDate(publishDate)}.`
        : "Chọn ngày xuất bản.";
    }
    return "";
  }, [publishOption, publishDate]);

  return (
    <section className="p-2 py-2 px-3 mb-4">
      <header className="mb-5">
        <span className="text-[16px] md:text-[17px] font-semibold leading-tight">
          Lịch xuất bản & Chi phí
        </span>
        <p className="text-white/60 text-[12.5px]">
          Thiết lập cách phát hành chương và giá coin nếu tính phí
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5">
        {/* Cách xuất bản */}
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-3 md:p-4">
          <p className="text-sm font-medium mb-3">Cách xuất bản</p>

          <SegmentedControl
            value={publishOption}
            onChange={setPublishOption}
            items={[
              {
                value: "draft",
                label: "Bản nháp",
                icon: FileClock,
                desc: "Lưu lại, chưa công khai",
              },
              {
                value: "now",
                label: "Xuất bản ngay",
                icon: Rocket,
                desc: "Công khai sau khi lưu",
              },
              {
                value: "scheduled",
                label: "Hẹn ngày",
                icon: CalendarDays,
                desc: "Chọn ngày",
              },
            ]}
          />

          {publishOption === "scheduled" && (
            <div className="flex items-center gap-5 flex-wrap mt-4">
              <div className="inline-flex items-center gap-2 text-[12.5px] text-white/70">
                <Info className="h-4 w-4" />
                <span>
                  {publishDate
                    ? `Xuất bản lúc 00:00 ngày ${formatHumanDate(publishDate)}`
                    : "Chọn ngày xuất bản"}
                </span>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="h-9 w-[160px] md:w-[200px] rounded-xl bg-white/[0.06] ring-1 ring-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/25"
                  min={minDate}
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Chi phí */}
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-3 md:p-4">
          <p className="text-sm font-medium mb-3">Chi phí</p>

          {/* Free / Paid pill */}
          <div className="inline-flex rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setIsPaid(false)}
              className={[
                "px-4 h-9 text-sm font-medium transition",
                !isPaid
                  ? "bg-white/[0.14] text-white"
                  : "text-white/80 hover:bg-white/[0.08]",
              ].join(" ")}
            >
              Miễn phí
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPaid(true);
                if (!price) setPrice(1);
              }}
              className={[
                "px-4 h-9 text-sm font-medium transition border-l border-white/10",
                isPaid
                  ? "bg-white/[0.14] text-white"
                  : "text-white/80 hover:bg-white/[0.08]",
              ].join(" ")}
            >
              Tính phí
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12.5px] text-white/75">
            {isPaid ? (
              <>
                <BadgeDollarSign className="h-4 w-4" />
                <span>Độc giả trả coin để đọc</span>
              </>
            ) : (
              <>
                <Coins className="h-4 w-4" />
                <span>Miễn phí cho tất cả độc giả</span>
              </>
            )}
          </div>

          {/* Coin chips */}
          {isPaid && (
            <div className="mt-4">
              <p className="text-[12.5px] text-white/70 mb-2">
                Chọn mức giá (coin)
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <CoinChip
                    key={val}
                    value={val}
                    active={price === val}
                    onClick={() => setPrice(val)}
                  />
                ))}
              </div>
              <p className="mt-2 text-[12px] text-white/55">
                Gợi ý: 1–2 coin cho chương ngắn, 3–5 coin cho chương dài/chất lượng cao.
              </p>
            </div>
          )}
        </div>

        {/* helper note */}
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-4">
          <p className="text-[12.5px] text-white/70 leading-relaxed">
            {helperText}
          </p>
        </div>
      </div>
    </section>
  );
};

/* ========== helpers & inline UI ========== */

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" về local time 00:00 để tránh lệch múi giờ */
function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatHumanDate(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const SegmentedControl = <T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; icon: any; desc?: string }[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((it) => {
        const active = it.value === value;
        const Icon = it.icon;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className={[
              "text-left rounded-xl p-3 ring-1 transition group",
              active
                ? "bg-white/[0.1] ring-white/20"
                : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "h-8 w-8 grid place-items-center rounded-lg ring-1",
                  active
                    ? "bg-white/[0.18] ring-white/20"
                    : "bg-white/[0.08] ring-white/10",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 text-white/90" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">{it.label}</p>
                {it.desc && (
                  <p className="text-[12px] text-white/60">{it.desc}</p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const CoinChip = ({
  value,
  active,
  onClick,
}: {
  value: number;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-xl px-3.5 h-10 ring-1 transition",
        active
          ? "bg-[linear-gradient(90deg,#ff512f,#ff9966)] text-white ring-white/20 shadow-[0_6px_20px_-8px_rgba(255,99,64,0.7)]"
          : "bg-white/[0.06] text-white/90 ring-white/12 hover:bg-white/[0.1]",
      ].join(" ")}
      title={`${value} coin`}
      aria-label={`${value} coin`}
    >
      <Coins className="h-4 w-4" />
      <span className="text-sm font-semibold">{value}</span>
    </button>
  );
};
