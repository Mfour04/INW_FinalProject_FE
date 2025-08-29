type Props = {
  children: React.ReactNode;
  error?: string;
};

export const Input = ({ children, error }: Props) => (
  <div className="space-y-1.5">
    <div
      className={[
        "relative rounded-xl transition focus-within:ring-1",
        "bg-white border border-zinc-200 focus-within:border-zinc-300 focus-within:ring-zinc-300",
        "dark:bg-[#0b0f14] dark:border-white/10 dark:focus-within:border-white/15 dark:focus-within:ring-white/15 dark:backdrop-blur-sm",
      ].join(" ")}
    >
      {children}
    </div>
    {error ? (
      <p className="ml-2 text-sm sm:text-[13px] text-red-600 dark:text-red-400">{error}</p>
    ) : null}
  </div>
);
