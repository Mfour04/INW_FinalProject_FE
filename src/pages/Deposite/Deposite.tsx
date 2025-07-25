import { useMutation } from "@tanstack/react-query";
import { QRCheckIn } from "../../api/Transaction/transaction.api";

const coinOptions = [
  { amount: 10, image: "/images/coin.svg" },
  { amount: 100, image: "/images/coin.svg" },
  { amount: 1000, image: "/images/coin.svg" },
];

export const Deposite = () => {
  const rechargeMutation = useMutation({
    mutationFn: QRCheckIn,
    onSuccess: (data) => {
      window.open(data.data.checkoutUrl, "_self");
      //   console.log(data.data.checkoutUrl);
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-xl text-white font-semibold mb-4">Nạp xu</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-600 text-gray-300">
            <th className="p-2">Số lượng xu</th>
            <th className="p-2 w-[15%]">Thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {coinOptions.map((coin, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-2 flex items-center gap-2">
                <img src={coin.image} alt="coin" className="w-6 h-6" />
                <span>{coin.amount.toLocaleString()} xu</span>
              </td>
              <td className="p-2 w-[15%]">
                <button
                  onClick={() =>
                    rechargeMutation.mutate({ coinAmount: coin.amount })
                  }
                  className="bg-[#ff6740] text-white px-4 py-1 rounded hover:bg-orange-600 text-sm"
                >
                  Thanh toán
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
