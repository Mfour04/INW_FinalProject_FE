export type Coin = {
  amount: number; 
  image: string;
  price: number; 
  note?: string;
};

type CoinProps = {
  coin: Coin;
  selected?: boolean;
  onClick?: () => void;    
  isLoading?: boolean;
};

const vnd = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

export const WithdrawCard = ({ coin, selected, onClick, isLoading }: CoinProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isLoading) onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-busy={isLoading || false}
      onClick={() => !isLoading && onClick?.()}
      onKeyDown={handleKeyDown}
      className={[
        "group relative w-full overflow-hidden cursor-pointer select-none",
        // >>> đảm bảo cao đều như CoinCard
        "h-full min-h-[184px] flex flex-col",
        "rounded-2xl p-4",
        "bg-white/60 dark:bg-zinc-900/60 backdrop-blur",
        "border border-white/50 dark:border-white/10",
        "shadow-[0_4px_18px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.35)]",
        "transition-all duration-300 ease-out hover:-translate-y-[6px]",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]",
        selected ? "ring-2 ring-[#ff6740]/80" : "",
        isLoading ? "pointer-events-none opacity-80" : ""
      ].join(" ")}
      style={{ transform: "translateZ(0)" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40 dark:ring-white/5" />

      <div
        className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(30rem 20rem at 110% 0%, rgba(255,103,64,0.18), transparent 60%)",
        }}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center rounded-xl p-2 ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5">
            <img
              src={coin.image}
              alt={`${coin.amount} VND`}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow"
              draggable={false}
            />
          </div>

          <div className="min-w-0">
            <div className="text-[13px] text-zinc-500 dark:text-zinc-400">Số tiền rút</div>
            <div className="text-zinc-900 dark:text-white font-extrabold text-base tracking-wide">
              {coin.amount.toLocaleString("vi-VN")} <span className="opacity-80">VND</span>
            </div>
          </div>

          {coin.note ? (
            <div className="ml-auto">
              <span className="inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-medium
                bg-white/70 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10 text-zinc-600 dark:text-zinc-300">
                {coin.note}
              </span>
            </div>
          ) : null}
        </div>

        <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="text-[12px] text-zinc-500 dark:text-zinc-400">Quy đổi</div>
            <div className="text-[15px] font-semibold text-zinc-900 dark:text-white tabular-nums">
              {coin.price.toLocaleString("vi-VN")} Xu
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) onClick?.();
            }}
            disabled={isLoading}
            className={[
              "relative inline-flex items-center justify-center rounded-full",
              "text-white font-semibold text-xs px-3.5 py-1.5 min-w-[96px]",
              "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
              "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
              "shadow-[0_6px_18px_rgba(255,103,64,0.35)] hover:shadow-[0_10px_28px_rgba(255,103,64,0.5)]",
              "transition-all duration-300 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#ff784f]/70",
              "disabled:opacity-70 disabled:cursor-not-allowed"
            ].join(" ")}
            aria-label={`Rút ${coin.amount.toLocaleString("vi-VN")} VND = ${coin.price.toLocaleString("vi-VN")} Xu`}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Đang rút…
              </span>
            ) : (
              "Rút ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
