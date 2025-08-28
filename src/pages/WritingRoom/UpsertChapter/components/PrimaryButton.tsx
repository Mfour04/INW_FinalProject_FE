type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const PrimaryButton = ({ children, onClick, disabled, loading }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 h-8 px-4 rounded-full text-[14px] font-semibold transition",
        // Light
        "text-white ring-1 ring-zinc-300/50 shadow-sm shadow-zinc-300/50",
        // Dark
        "dark:ring-white/10 dark:shadow-black/10",
        // Brand gradient
        "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_45%,#ff9966_100%)]",
        disabled || loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:brightness-95",
      ].join(" ")}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
        </svg>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
