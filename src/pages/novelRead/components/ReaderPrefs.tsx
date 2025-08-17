import { fillTrack } from "../utils/fillTrack";

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

export function ReaderPrefs({
  open, onClose,
  fontSize, setFontSize,
  lineHeight, setLineHeight,
  widthIdx, setWidthIdx,
  widthLevels,
  defaults,
}: ReaderPrefsProps) {
  const resetPrefs = () => {
    setFontSize(defaults.fontSize);
    setLineHeight(defaults.lineHeight);
    setWidthIdx(defaults.widthIdx);
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-2xl ring-1 ring-white/12 bg-[#0c0d10]/95 backdrop-blur-md shadow-[0_28px_80px_-24px_rgba(0,0,0,0.85)] p-3">
      <style>{`
  .reader-range{appearance:none;height:6px;border-radius:9999px;background:rgba(255,255,255,.18);outline:none}
  .reader-range::-webkit-slider-thumb{appearance:none;height:14px;width:14px;border-radius:9999px;background:#ff7a59;border:2px solid rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.4)}
  .reader-range::-moz-range-thumb{height:14px;width:14px;border-radius:9999px;background:#ff7a59;border:2px solid rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.4)}
  .reader-range:hover::-webkit-slider-thumb{filter:brightness(1.08)}
  .reader-range:hover::-moz-range-thumb{filter:brightness(1.08)}
      `}</style>

      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-white/90">Thiết lập hiển thị</div>
        <button
          onClick={resetPrefs}
          className="rounded-full border border-white/12 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 text-[12.5px] transition"
        >
          Mặc định
        </button>
      </div>

      <div className="space-y-3 text-[13px]">
        <div>
          <div className="mb-1 text-white/80">Cỡ chữ</div>
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
            <span className="w-10 text-right tabular-nums text-white/70">{fontSize}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-white/80">Giãn dòng</div>
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
            <span className="w-12 text-right tabular-nums text-white/70">{lineHeight.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-white/80">Độ rộng nội dung</div>
          <div className="relative rounded-full border border-white/10 bg-white/5 p-0.5">
            <div
              className="absolute inset-y-[3px] left-[3px] w-1/3 rounded-full bg-white/20 transition-transform"
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
                      active ? "text-white" : "text-white/80 hover:text-white",
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
          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 text-[12.5px] transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
