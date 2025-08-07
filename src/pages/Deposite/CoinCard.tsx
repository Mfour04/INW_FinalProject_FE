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
    <div className="bg-[#2e2e2e] flex items-center justify-between border border-black rounded-xl px-4 py-3 shadow-sm w-full">
      <div className="flex items-center gap-2">
        <img src={coin.image} alt="coin" className="w-23 h-23" />
        <span className="font-semibold text-white text-2xl">{coin.amount}</span>
      </div>
      <Button
        onClick={onBuyClick}
        isLoading={isLoading}
        className="bg-[#ff6740] hover:bg-orange-600 px-3 py-1.5 rounded-full text-2xl font-semibold text-white border-none cursor-pointer"
      >
        {coin.price.toLocaleString("vi-VN")} VND
      </Button>
    </div>
  );
};
