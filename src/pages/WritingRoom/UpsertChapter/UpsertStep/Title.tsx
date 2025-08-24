import { useState } from "react";
import { Type, MessageCircle } from "lucide-react";
import { TEXT } from "../constants";
import type { ChapterForm } from "../UpsertChapter";

/* ========== SimpleGradientToggle ========== */
type ToggleSize = "sm" | "md" | "lg";
type SimpleGradientToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: ToggleSize;
  ariaLabel?: string;
  className?: string;
};

const MAP = {
  sm: { trackW: 36, trackH: 20, knob: 16, pad: 3, cls: "h-5 w-9" },  
  md: { trackW: 44, trackH: 24, knob: 20, pad: 3, cls: "h-6 w-11" },
  lg: { trackW: 56, trackH: 28, knob: 24, pad: 3, cls: "h-7 w-14" }, 
};

function SimpleGradientToggle({
  checked,
  onChange,
  disabled,
  size = "lg",
  ariaLabel = "Bật tắt",
  className = "",
}: SimpleGradientToggleProps) {
  const S = MAP[size];
  const innerW = S.trackW - S.pad * 2;
  const delta = innerW - S.knob; 
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={[
        "relative inline-flex items-center rounded-full ring-1 transition-colors p-[4px]",
        S.cls,
        checked ? "ring-white/20" : "ring-white/12",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        background: checked
          ? "linear-gradient(90deg,#ff6740 0%,#ff9966 100%)"
          : "linear-gradient(90deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))",
      }}
    >
      <span
        className="block rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: S.knob,
          height: S.knob,
          transform: `translateX(${checked ? delta : 0}px)`,
        }}
      />
    </button>
  );
}

/* ================= Title Step ================= */
type TitleStepProps = {
  chapterForm: ChapterForm;
  setChapterForm: (param: ChapterForm) => void;
};

export const Title = ({ chapterForm, setChapterForm }: TitleStepProps) => {
  const LIMIT = 100;
  const title = chapterForm.title ?? "";

  const hasAllowField = Object.prototype.hasOwnProperty.call(chapterForm ?? {}, "allowComments");
  const [localAllow, setLocalAllow] = useState(true);
  const allowComments: boolean = hasAllowField
    ? (chapterForm as any).allowComments ?? true
    : localAllow;

  const setAllow = (v: boolean) => {
    if (hasAllowField) {
      // setChapterForm({ ...chapterForm, allowComments?: v });
    } else {
      setLocalAllow(v);
    }
  };

  const count = title.length;
  const nearLimit = count >= LIMIT - 10;

  return (
    <section className="p-2 py-2 px-3 mb-4">
      {/* Header */}
      <header className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] md:text-[17px] font-semibold text-white/95">
              {TEXT.TITLE_LABEL}{" "}
              <span className="text-red-400">{TEXT.CONTENT_REQUIRED_SYMBOL}</span>
            </h2>
            <p className="text-[12.5px] text-white/55">
              Tiêu đề ngắn gọn, dễ nhớ cho chương của bạn.
            </p>
          </div>
      </header>

      {/* Title input */}
      <div className="mt-4 rounded-2xl ring-1 ring-white/12 bg-[linear-gradient(180deg,rgba(20,22,28,0.9),rgba(16,18,24,0.9))] px-4 py-3 focus-within:ring-2 focus-within:ring-white/25">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
            <Type className="h-4 w-4 text-white/80" />
          </div>
          <input
            type="text"
            maxLength={LIMIT}
            value={title}
            onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
            placeholder={TEXT.TITLE_PLACEHOLDER}
            className="flex-1 bg-transparent text-[15px] md:text-[16px] leading-7 placeholder:text-white/35 focus:outline-none"
          />
          {!!title && (
            <button
              type="button"
              onClick={() => setChapterForm({ ...chapterForm, title: "" })}
              className="h-7 w-7 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 text-white/80"
              title="Xoá"
              aria-label="Xoá tiêu đề"
            >
              ×
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[12.5px] text-white/55">Tối đa {LIMIT} ký tự.</p>
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-[2px] text-[11px] ring-1",
              nearLimit ? "ring-white/20 text-white bg-white/[0.10]" : "ring-white/12 text-white/80",
            ].join(" ")}
          >
            {count}/{LIMIT}
          </span>
        </div>
      </div>

      {/* Allow comments */}
      <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl ring-1 ring-white/12 bg-[linear-gradient(180deg,rgba(20,22,28,0.9),rgba(16,18,24,0.9))] px-4 py-3">
        <div
          className="min-w-0 cursor-pointer select-none"
          onClick={() => setAllow(!allowComments)}
          role="button"
          aria-pressed={allowComments}
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
              <MessageCircle className="h-4 w-4 text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-[14.5px] font-medium">Bật bình luận</p>
              <p className="text-[12.5px] text-white/60">
                Cho phép người đọc thảo luận bên dưới chương này.
              </p>
            </div>
          </div>
        </div>

        <div className="justify-self-end flex items-center gap-2">
          <span
            className={[
              "hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1",
              allowComments
                ? "ring-emerald-300/40 bg-emerald-900/20 text-emerald-200"
                : "ring-rose-300/40 bg-rose-900/20 text-rose-200",
            ].join(" ")}
          >
            {allowComments ? "Đang bật" : "Đang tắt"}
          </span>
          <SimpleGradientToggle
            checked={allowComments}
            onChange={setAllow}
            size="md"
            ariaLabel="Bật bình luận"
          />
        </div>
      </div>
    </section>
  );
};
