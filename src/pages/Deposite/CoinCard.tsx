import Button from "../../components/ButtonComponent";

export type Coin = {
  amount: number;
  image: string;
  price: number; 
  bonus?: number; 
  highlight?: boolean;
  note?: string;
};

export type CoinProps = {
  coin: Coin;
  onBuyClick?: () => void;
  isLoading?: boolean;
};

const vnd = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND";

export const CoinCard = ({ coin, onBuyClick, isLoading }: CoinProps) => {
  return (
    <div
      className={[
        "group relative w-full overflow-hidden",
        "rounded-2xl p-4",
        "bg-white/60 dark:bg-zinc-900/60 backdrop-blur",
        "border border-white/50 dark:border-white/10",
        "shadow-[0_4px_18px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.35)]",
        "transition-all duration-300 ease-out hover:-translate-y-[6px]",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]",
      ].join(" ")}
      style={{ transform: "translateZ(0)" }}
    >
      {/* viền mờ bên trong */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40 dark:ring-white/5" />
      <div
        className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(30rem 20rem at 110% 0%, rgba(255,103,64,0.18), transparent 60%)",
        }}
      />

      {/* Header nhỏ: ảnh + meta */}
      <div className="flex items-center gap-3">
        <div className="grid place-items-center rounded-xl p-2 ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5">
          <img
            src={coin.image}
            alt={`${coin.amount} xu`}
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow"
            draggable={false}
          />
        </div>

        <div className="min-w-0">
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">Gói xu</div>

          <div className="text-zinc-900 dark:text-white font-extrabold text-base tracking-wide">
            {coin.amount.toLocaleString("vi-VN")}
            {typeof coin.bonus === "number" && coin.bonus > 0 && (
              <span
                className="ml-2 align-baseline text-sm font-extrabold text-emerald-500"
                aria-label={`Tặng thêm ${coin.bonus} xu`}
                title={`Tặng thêm ${coin.bonus} xu`}
              >
                +{coin.bonus}
              </span>
            )}
            <span className="opacity-80"> xu</span>
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

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[12px] text-zinc-500 dark:text-zinc-400">Giá</div>
          <div className="text-[15px] font-semibold text-zinc-900 dark:text-white tabular-nums">
            {vnd(coin.price)}
          </div>
        </div>

        <Button
          onClick={onBuyClick}
          isLoading={isLoading}
          aria-label={`Nạp ${coin.amount} xu${coin.bonus ? ` (+${coin.bonus})` : ""} với giá ${coin.price.toLocaleString("vi-VN")} VND`}
          className={[
            "relative rounded-full border-none text-white font-semibold",
            "text-xs px-3.5 py-1.5",
            "min-w-[90px] justify-center",
            "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
            "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
            "shadow-[0_6px_18px_rgba(255,103,64,0.35)] hover:shadow-[0_10px_28px_rgba(255,103,64,0.5)]",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/70",
          ].join(" ")}
        >
          Nạp ngay
        </Button>
      </div>
    </div>
  );
};
