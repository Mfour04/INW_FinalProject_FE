// WithdrawCard.tsx
export type Coin = {
  amount: number; // VND
  image: string;
  price: number;  // Xu
};

type CoinProps = {
  coin: Coin;
  selected?: boolean;
  onClick?: () => void;
};

export const WithdrawCard = ({ coin, selected, onClick }: CoinProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={[
        "group relative flex w-full cursor-pointer select-none flex-col items-center justify-between gap-3 rounded-xl p-5",
        // Light base
        "bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out",
        // Dark override
        "dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 dark:border-zinc-700",
        selected ? "ring-2 ring-[#ff6740]/80" : ""
      ].join(" ")}
    >
      <div className="rounded-full bg-zinc-100 p-3.5 shadow-inner dark:bg-zinc-700/40">
        <img
          src={coin.image}
          alt="coin"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow"
          draggable={false}
        />
      </div>

      <div className="text-center">
        <div className="text-gray-900 font-bold text-lg tracking-wide dark:text-white">
          {coin.amount.toLocaleString("vi-VN")} <span className="opacity-90">VND</span>
        </div>
      </div>

      <div
        className={[
          "relative inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5",
          "text-white font-semibold text-sm border-none select-none",
          "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
          "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
          "shadow-[0_10px_24px_rgba(255,103,64,0.45)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.60)]",
          "transition-colors duration-300",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff784f]/60",
          "overflow-hidden before:content-[''] before:absolute before:inset-0",
          "before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]",
          "before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300",
          selected ? "shadow-[0_14px_36px_rgba(255,103,64,0.65)]" : ""
        ].join(" ")}
      >
        <span>{coin.price.toLocaleString("vi-VN")} Xu</span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-xl bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-white/5" />
    </div>
  );
};
