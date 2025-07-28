import {
  getStatusLabel,
  getTypeLabel,
  type TransactionItem,
} from "../../api/Transaction/transaction.type";

type Props = {
  transaction?: TransactionItem;
};

export const TransactionCard = ({ transaction }: Props) => {
  if (!transaction) return null;
  const { paymentMethod, id, type, amount, status, completedAt } = transaction;

  const formattedDate = new Date(completedAt).toLocaleString();

  return (
    <div className="flex items-center justify-between bg-[#1e1e21] rounded-xl shadow-md p-4 w-full  gap-4">
      <div className="flex justify-between items-center text-sm w-full text-white">
        <div className="w-[85%] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex justify-between gap-10">
              <span className="font-semibold ">Mã giao dịch:</span>
              <span className="">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="">{formattedDate}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <span className="font-semibold ">Cổng thanh toán:</span>
            <span className="">{paymentMethod}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="">{getTypeLabel(type)}</span>

            <span className="text-green-600 font-bold">{amount} coin</span>
          </div>
        </div>

        <div className="w-[15%] flex justify-end items-start ">
          <span
            className={`font-semibold ${
              status === 1
                ? "text-green-600"
                : status === 0
                ? "text-yellow-500"
                : status === 3 || status === 4
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </div>
    </div>
  );
};
