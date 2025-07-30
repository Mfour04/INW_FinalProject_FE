import { useMutation } from "@tanstack/react-query";
import { QRCheckIn } from "../../api/Transaction/transaction.api";
import Coin10 from "../../assets/img/Transaction/coin-10.png";
import Coin20 from "../../assets/img/Transaction/coin-20.png";
import Coin50 from "../../assets/img/Transaction/coin-50.png";
import Coin100 from "../../assets/img/Transaction/coin-100.png";
import Coin500 from "../../assets/img/Transaction/coin-500.png";
import Coin1000 from "../../assets/img/Transaction/coin-1000.png";
import { useAuth } from "../../hooks/useAuth";
import { CoinCard, type Coin } from "./CoinCard";
import { useState } from "react";

const coinOptions: Coin[] = [
  { amount: 10, image: Coin20, price: 10000 },
  { amount: 50, image: Coin50, price: 50000 },
  { amount: 100, image: Coin100, price: 100000 },
  { amount: 500, image: Coin500, price: 500000 },
  { amount: 1000, image: Coin1000, price: 1000000 },
];

export const Deposite = () => {
  const { auth } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const rechargeMutation = useMutation({
    mutationFn: QRCheckIn,
    onMutate: (data) => {
      setSelectedAmount(data.coinAmount);
    },
    onSuccess: (data) => {
      window.open(data.data.checkoutUrl, "_self");
    },
    onSettled: () => {
      setSelectedAmount(null);
    },
  });

  const handleBuyClick = (amount: number) => {
    rechargeMutation.mutate({ coinAmount: amount });
  };

  return (
    <div className="min-h-screen px-6 py-8 rounded-[10px] mx-[50px] bg-[#1e1e21] text-white">
      <div className="h-14 mb-2.5 flex items-center justify-between">
        <h2 className="text-xl  font-semibold mb-4">Nạp xu InkWave</h2>
        <div className="flex gap-2 items-center border rounded-4xl px-4 py-1 border-[#45454e]">
          <img className="h-10 w-10" src={Coin10} />
          <div className="text-2xl">{auth?.user.coin}</div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {coinOptions.map((coin, index) => (
          <CoinCard
            key={index}
            coin={coin}
            onBuyClick={() => handleBuyClick(coin.amount)}
            isLoading={
              rechargeMutation.isPending && selectedAmount === coin.amount
            }
          />
        ))}
      </div>
    </div>
  );
};
