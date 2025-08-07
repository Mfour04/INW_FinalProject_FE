export type Coin = {
  amount: number;
  image: string;
  price: number;
};

type CoinProps = {
  coin: Coin;
  selected?: boolean;
  onClick?: () => void;
};

export const WithdrawCard = ({ coin, selected, onClick }: CoinProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#2e2e2e] flex flex-col items-center justify-between gap-5 border rounded-xl p-4 shadow-sm w-1/5 cursor-pointer transition-all
        ${selected ? "border-2 border-[#ff6740]" : "border border-black"}
      `}
    >
      <img src={coin.image} alt="coin" className="w-23 h-23" />
      <span className="font-semibold text-white text-xl">
        {coin.amount.toLocaleString("vi-VN")} VND
      </span>
      <div className="bg-[#ff6740]  px-3 py-1.5 rounded-full text-xl font-semibold text-white border-none">
        {coin.price} Xu
      </div>
    </div>
  );
};
