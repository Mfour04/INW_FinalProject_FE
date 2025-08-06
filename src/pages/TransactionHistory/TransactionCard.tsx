import { useMemo } from "react";
import {
  getStatusLabel,
  getTypeLabel,
  type TransactionItem,
} from "../../api/Transaction/transaction.type";
import Coin10 from "../../assets/img/Transaction/coin-10.png";
import Novel from "../../assets/img/Transaction/novel.png";
import Chapter from "../../assets/img/Transaction/chapter.png";
import Withdraw from "../../assets/img/Transaction/withdraw.png";
import { formatVietnamTimeFromTicks } from "../../utils/date_format";

type Props = {
  transaction?: TransactionItem;
};

export const TransactionCard = ({ transaction }: Props) => {
  if (!transaction) return null;
  const { id, type, amount, status, createdAt } = transaction;

  const icon = useMemo(() => {
    switch (type) {
      case 0:
        return Coin10;
      case 1:
        return Withdraw;
      case 2:
        return Novel;
      default:
        return Chapter;
    }
  }, [type]);

  const formattedDate = formatVietnamTimeFromTicks(createdAt);

  return (
    <div className="flex items-center justify-between bg-[#45454e] rounded-xl shadow-md p-4 w-full  gap-4">
      <img className="h-15 w-15" src={icon} />
      <div className="flex justify-between items-center text-sm w-full text-white">
        <div className="w-[85%] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex justify-between gap-10">
              <span className="font-semibold text-xl">
                {getTypeLabel(type)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-md">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">{id}</span>

            <span className="text-yellow-400 font-bold">{amount} coin</span>
          </div>
        </div>

        <div className="ml-20 w-[200px] h-[35px] text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
          <span
            className={`h-2 w-2 rounded-full inline-block ${
              status === 1
                ? "bg-green-600"
                : status === 0
                ? "bg-yellow-500"
                : status === 3 || status === 4
                ? "bg-red-600"
                : "bg-gray-500"
            }`}
          />
          <span className="flex-1 text-center">{getStatusLabel(status)}</span>
        </div>
      </div>
    </div>
  );
};
