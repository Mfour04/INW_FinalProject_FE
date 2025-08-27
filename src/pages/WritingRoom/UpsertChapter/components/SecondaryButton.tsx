type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const SecondaryButton = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full text-[14px] font-semibold",
        "inline-flex items-center justify-center gap-2 h-8 px-4",
        "bg-white/10 hover:bg-white/18",
        "ring-1 ring-white/12 text-white/90",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        "transition",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
