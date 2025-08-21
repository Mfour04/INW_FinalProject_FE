type Props = {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
};

export const TBtn = ({ onClick, active, label, children }: Props) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={[
      "inline-flex items-center justify-center h-8 w-8 rounded-lg ring-1 transition",
      active
        ? "ring-white/25 bg-white/[0.14] text-white"
        : "ring-white/10 bg-white/[0.06] hover:bg-white/[0.1] text-white/90",
    ].join(" ")}
  >
    {children}
  </button>
);
