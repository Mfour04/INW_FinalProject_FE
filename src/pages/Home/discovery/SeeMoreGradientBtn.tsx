import { BRAND } from "../constant";

export type SeeMoreGradientBtnProps = { label: string; onClick: () => void };

export const SeeMoreGradientBtn = ({
  label,
  onClick,
}: SeeMoreGradientBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white",
      "bg-gradient-to-r",
      BRAND,
      "shadow-[0_6px_16px_rgba(255,103,64,0.35)]",
      "transition-transform active:scale-95 hover:brightness-110",
    ].join(" ")}
  >
    {label}
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M7 5l6 5-6 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  </button>
);
