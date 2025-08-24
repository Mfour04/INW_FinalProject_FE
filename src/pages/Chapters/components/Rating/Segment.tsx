import Star from "@mui/icons-material/Star";

type SegmentedProps = {
  value: number | "all";
  onChange: (v: number | "all") => void;
};

export const Segmented = ({ value, onChange }: SegmentedProps) => {
  const base =
    "px-2.5 py-1 rounded-full text-[12px] transition border border-white/12";
  const active =
    "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]";
  const idle = "bg-white/5 text-white/80 hover:bg-white/10";
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/12">
      <button
        className={`${base} ${value === "all" ? active : idle}`}
        onClick={() => onChange("all")}
      >
        Tất cả
      </button>
      {[5, 4, 3, 2, 1].map((s) => (
        <button
          key={s}
          className={`${base} ${value === s ? active : idle}`}
          onClick={() => onChange(s)}
          title={`${s} sao`}
        >
          <span className="inline-flex items-center gap-1">
            <Star sx={{ width: 12, height: 12 }} className="text-yellow-400" />
            {s}
          </span>
        </button>
      ))}
    </div>
  );
};
