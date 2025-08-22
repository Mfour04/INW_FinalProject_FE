import { fillTrack } from "../util";

interface ReaderPrefsProps {
  open: boolean;
  onClose: () => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  lineHeight: number;
  setLineHeight: (n: number) => void;
  widthIdx: number;
  setWidthIdx: (n: number) => void;
  widthLevels: readonly number[];
  defaults: { fontSize: number; lineHeight: number; widthIdx: number };
}

export const ReaderPrefs = ({
  open,
  onClose,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  widthIdx,
  setWidthIdx,
  defaults,
}: ReaderPrefsProps) => {
  const resetPrefs = () => {
    setFontSize(defaults.fontSize);
    setLineHeight(defaults.lineHeight);
    setWidthIdx(defaults.widthIdx);
  };

  if (!open) return null;

  return (
    <div
      className="
        absolute right-0 z-50 mt-2 w-[320px] rounded-2xl p-3
        ring-1 bg-white/95 text-gray-900 ring-gray-200 backdrop-blur-md shadow-[0_28px_80px_-24px_rgba(0,0,0,0.18)]
        dark:bg-[#0c0d10]/95 dark:text-white dark:ring-white/12 dark:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.85)]
      "
    >
      <style>{`
        .reader-range{appearance:none;height:6px;border-radius:9999px;background:rgba(0,0,0,.08);outline:none}
        .dark .reader-range{background:rgba(255,255,255,.18)}
        .reader-range::-webkit-slider-thumb{appearance:none;height:14px;width:14px;border-radius:9999px;background:#ff7a59;border:2px solid rgba(0,0,0,.6);box-shadow:0 1px 2px rgba(0,0,0,.15)}
        .reader-range::-moz-range-thumb{height:14px;width:14px;border-radius:9999px;background:#ff7a59;border:2px solid rgba(0,0,0,.6);box-shadow:0 1px 2px rgba(0,0,0,.15)}
        .dark .reader-range::-webkit-slider-thumb{border-color:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.4)}
        .dark .reader-range::-moz-range-thumb{border-color:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.4)}
        .reader-range:hover::-webkit-slider-thumb{filter:brightness(1.08)}
        .reader-range:hover::-moz-range-thumb{filter:brightness(1.08)}
        .reader-range::-webkit-slider-thumb{border-color:rgba(53, 53, 53, 0.9)
      `}</style>

      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-gray-900 dark:text-white/90">
          Thiết lập hiển thị
        </div>
        <button
          onClick={resetPrefs}
          className="
            rounded-full px-3 py-1.5 text-[12.5px] transition
            border bg-gray-50 hover:bg-gray-200 border-gray-200 text-gray-800
            dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white
          "
        >
          Mặc định
        </button>
      </div>

      <div className="space-y-3 text-[13px]">
        <div>
          <div className="mb-1 text-gray-700 dark:text-white/80">Cỡ chữ</div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={14}
              max={22}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="reader-range w-full cursor-pointer"
              style={fillTrack(fontSize, 14, 22)}
            />
            <span className="w-10 text-right tabular-nums text-gray-600 dark:text-white/70">
              {fontSize}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-gray-700 dark:text-white/80">Giãn dòng</div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              step={0.05}
              min={1.4}
              max={1.9}
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="reader-range w-full cursor-pointer"
              style={fillTrack(lineHeight, 1.4, 1.9)}
            />
            <span className="w-12 text-right tabular-nums text-gray-600 dark:text-white/70">
              {lineHeight.toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-gray-700 dark:text-white/80">Độ rộng nội dung</div>
          <div
            className="
              relative rounded-full p-0.5
              border bg-gray-50 border-gray-200
              dark:border-white/10 dark:bg-white/5
            "
          >
            <div
              className="
                absolute inset-y-[3px] left-[3px] w-1/3 rounded-full transition-transform
                bg-gray-200
                dark:bg-white/20
              "
              style={{ transform: `translateX(${widthIdx * 100}%)` }}
            />
            <div className="relative z-10 grid grid-cols-3">
              {["Hẹp", "Chuẩn", "Rộng"].map((label, i) => {
                const active = widthIdx === i;
                return (
                  <button
                    key={label}
                    onClick={() => setWidthIdx(i)}
                    className={[
                      "h-7 rounded-full text-[12.5px] font-semibold transition w-full",
                      active
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-700 hover:text-gray-900 dark:text-white/80 dark:hover:text-white",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onClose}
          className="
            inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[12.5px] transition
            border bg-gray-50 hover:bg-gray-200 border-gray-200 text-gray-800
            dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white
          "
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
