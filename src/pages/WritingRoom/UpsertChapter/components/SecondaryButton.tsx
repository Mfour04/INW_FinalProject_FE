type Props = { children: React.ReactNode; onClick?: () => void; disabled?: boolean };

export const SecondaryButton = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full text-[14px] font-semibold inline-flex items-center justify-center gap-2 h-8 px-4 transition",
        // Light
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 ring-1 ring-zinc-200",
        // Dark
        "dark:bg-white/10 dark:hover:bg-white/18 dark:text-white/90 dark:ring-white/12",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
