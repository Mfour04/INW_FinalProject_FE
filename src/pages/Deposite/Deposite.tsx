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
import { useMemo, useState } from "react";
import { Withdraw } from "./Withdraw/Withdraw";

const depositeCoinOptions: Coin[] = [
  { amount: 10, image: Coin20, price: 10000 },
  { amount: 50, image: Coin50, price: 50000 },
  { amount: 100, image: Coin100, price: 100000 },
  { amount: 500, image: Coin500, price: 500000 },
  { amount: 1000, image: Coin1000, price: 1000000 },
];

type tabType = "Deposite" | "Withdraw";

export const Deposite = () => {
  const { auth } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [tab, setTab] = useState<tabType>("Deposite");

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

  // 👉 Đổi layout nạp xu thành 3–2 ô
  const tabContent = useMemo(() => {
    if (tab === "Deposite") {
      return (
        <div className="mt-6 flex flex-col items-center gap-8">
          {/* Hàng trên (3 ô) */}
          <div className="flex justify-center gap-8">
            {depositeCoinOptions.slice(0, 3).map((coin, index) => (
              <div key={`top-${index}`} className="w-[180px] sm:w-[200px]">
                <CoinCard
                  coin={coin}
                  onBuyClick={() => handleBuyClick(coin.amount)}
                  isLoading={rechargeMutation.isPending && selectedAmount === coin.amount}
                />
              </div>
            ))}
          </div>
          {/* Hàng dưới (2 ô) */}
          <div className="flex justify-center gap-8">
            {depositeCoinOptions.slice(3, 5).map((coin, index) => (
              <div key={`bottom-${index}`} className="w-[180px] sm:w-[200px]">
                <CoinCard
                  coin={coin}
                  onBuyClick={() => handleBuyClick(coin.amount)}
                  isLoading={rechargeMutation.isPending && selectedAmount === coin.amount}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <Withdraw />;
  }, [tab, rechargeMutation.isPending, selectedAmount]);

   return (
    <div className="min-h-screen px-6 py-4 rounded-[10px] mx-[50px] bg-[#1e1e21] text-white">
      <header className="h-14 mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 p-[2px]">
            <div className="h-full w-full rounded-[10px] bg-neutral-900 grid place-items-center">
              <img className="h-6 w-6" src={Coin10} alt="InkWave" />
            </div>
          </div>

          <h2 className="text-base font-semibold leading-none">InkWave Giao dịch</h2>

          <nav className="ml-2">
            <div className="inline-flex rounded-xl bg-zinc-800/80 border border-zinc-700 p-1">
              <button
                onClick={() => setTab("Deposite")}
                className={[
                  "px-3 py-1.5 text-sm rounded-lg font-semibold transition",
                  tab === "Deposite"
                    ? "bg-white text-black shadow"
                    : "text-zinc-300 hover:text-white"
                ].join(" ")}
              >
                Nạp xu
              </button>
              <button
                onClick={() => setTab("Withdraw")}
                className={[
                  "px-3 py-1.5 text-sm rounded-lg font-semibold transition",
                  tab === "Withdraw"
                    ? "bg-white text-black shadow"
                    : "text-zinc-300 hover:text-white"
                ].join(" ")}
              >
                Rút xu
              </button>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#45454e] bg-zinc-900/60 px-3 py-1.5">
          <img className="h-6 w-6" src={Coin10} alt="coin" />
          <div className="text-lg tabular-nums">
            {(auth?.user?.coin ?? 0).toLocaleString("vi-VN")}
          </div>
        </div>
      </header>

      {tabContent}
    </div>
  );
};