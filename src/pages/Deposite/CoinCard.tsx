import Button from "../../components/ButtonComponent";

export type Coin = {
  amount: number;
  image: string;
  price: number; 
};

export type CoinProps = {
  coin: Coin;
  onBuyClick?: () => void;
  isLoading?: boolean;
};

export const CoinCard = ({ coin, onBuyClick, isLoading }: CoinProps) => {
  return (
    <div
      className={[
        "group relative flex w-full cursor-default select-none",
        "flex-col items-center justify-between gap-3 rounded-xl p-5",
        "bg-gradient-to-b from-zinc-800 to-zinc-900",
        "border border-zinc-700 transition-all duration-200 ease-out",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
      ].join(" ")}
    >
      <div className="rounded-full bg-zinc-700/40 p-3.5 shadow-inner">
        <img
          src={coin.image}
          alt="coin"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow"
          draggable={false}
        />
      </div>

      <div className="text-center">
        <div className="text-white font-bold text-lg tracking-wide">
          {coin.amount.toLocaleString("vi-VN")} <span className="opacity-90">Xu</span>
        </div>
      </div>

      <Button
        onClick={onBuyClick}
        isLoading={isLoading}
        aria-label={`Nạp ${coin.amount} xu với giá ${coin.price.toLocaleString("vi-VN")} VND`}
        className={[
          "relative w-full rounded-full border-none text-white font-semibold",
          "text-sm px-4 py-1.5",
          "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
          "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
          "shadow-[0_10px_24px_rgba(255,103,64,0.45)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.60)]",
          "transition-colors duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/70",
          "overflow-hidden before:content-[''] before:absolute before:inset-0",
          "before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.22),transparent_55%)]",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        ].join(" ")}
      >
        {coin.price.toLocaleString("vi-VN")} VND
      </Button>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-xl bg-white/5 opacity-0" />
    </div>
  );
};
