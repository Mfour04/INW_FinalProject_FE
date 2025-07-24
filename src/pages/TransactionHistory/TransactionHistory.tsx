import { useQuery } from "@tanstack/react-query";
import { GetUserHistory } from "../../api/Transaction/transaction.api";
import { TransactionCard } from "./TransactionCard";
import { useEffect, useMemo, useState } from "react";
import type { GetUserHistoryParams } from "../../api/Transaction/transaction.type";

const typeOptions = [
  { label: "Tất cả", value: undefined },
  { label: "Nạp coin", value: 0 },
  { label: "Rút coin", value: 1 },
  { label: "Mua tiểu thuyết", value: 2 },
  { label: "Mua chương truyện", value: 3 },
];

const sortOptions = [
  { label: "Mới nhất", value: "created_at:desc" },
  { label: "Số coin", value: "created_at:asc" },
];

export const TransactionHistory = () => {
  const [params, setParams] = useState<GetUserHistoryParams>({
    page: 0,
    limit: 10,
    sortBy: "created_at:desc",
  });

  const finalParams: GetUserHistoryParams = useMemo(() => {
    const { type, ...rest } = params;
    return {
      ...rest,
      ...(type !== undefined ? { type } : {}),
    };
  }, [params]);

  const { data, isLoading } = useQuery({
    queryKey: ["userHistory", finalParams],
    queryFn: () => GetUserHistory(finalParams).then((res) => res.data.data),
  });

  return (
    <div className="mx-12 my-5">
      <div className="flex gap-4 mb-4">
        <select
          value={params.type ?? ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              type: e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
          className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md text-sm"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={params.sortBy}
          onChange={(e) =>
            setParams((prev) => ({ ...prev, sortBy: e.target.value }))
          }
          className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-5">
        {Array.isArray(data) ? (
          data.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : isLoading ? (
          <div className="text-white">Đang tải...</div>
        ) : (
          <div className="text-white">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
};
