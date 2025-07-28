import { useQuery } from "@tanstack/react-query";
import { GetUserHistory } from "../../api/Transaction/transaction.api";
import { TransactionCard } from "./TransactionCard";
import { useState } from "react";
import type { GetUserHistoryParams } from "../../api/Transaction/transaction.type";
import ArrowLeft02 from "../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg";
import ArrowRight02 from "../../assets/svg/Novels/arrow-right-02-stroke-rounded.svg";

const typeOptions = [
  { label: "Tất cả", value: undefined },
  { label: "Nạp coin", value: 0 },
  { label: "Rút coin", value: 1 },
  { label: "Mua tiểu thuyết", value: 2 },
  { label: "Mua chương truyện", value: 3 },
];

const sortOptions = [
  { label: "Mới nhất", value: "completed_at:desc" },
  { label: "Lâu nhất", value: "completed_at:asc" },
  { label: "Nhiều coin nhất", value: "amount:asc" },
  { label: "Ít coin nhất", value: "amount:asc" },
];

export const TransactionHistory = () => {
  const [params, setParams] = useState<GetUserHistoryParams>({
    page: 0,
    limit: 10,
    type: undefined,
    sortBy: "created_at:desc",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["userHistory", params],
    queryFn: () =>
      GetUserHistory({
        page: params.page,
        limit: params.limit,
        ...(params.type ? { type: params.type } : {}),
        sortBy: params.sortBy,
      }).then((res) => res.data.data),
  });

  return (
    <div className="mx-12 my-5">
      <div className="flex gap-4 mb-4">
        <select
          value={params.type ?? ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              page: 0,
              type: e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
          className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md text-sm"
        >
          {typeOptions.map((option, index) => (
            <option key={index} value={option.value}>
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
          {sortOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-5">
        {Array.isArray(data?.items) ? (
          data.items.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : isLoading ? (
          <div className="text-white">Đang tải...</div>
        ) : (
          <div className="text-white">Không có dữ liệu</div>
        )}
      </div>
      <div className="mt-[30px] flex justify-center items-center gap-[25px] h-[50px]">
        <button
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              page: (prev.page ?? 0) - 1,
            }))
          }
          disabled={params.page === 0}
          className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
        >
          <img src={ArrowLeft02} />
        </button>
        <div className="w-[200px] h-[50px] flex items-center justify-center bg-[#ff6740] rounded-[25px]">
          <span className="text-sm">
            Trang{" "}
            <span className="border-1 rounded-[5px] px-2.5">
              {(params.page ?? 0) + 1}
            </span>{" "}
            /{data?.totalPage}
          </span>
        </div>
        <button
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              page: (prev.page ?? 0) + 1,
            }))
          }
          disabled={params.page === (data?.totalPage ?? 1) - 1}
          className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
        >
          <img src={ArrowRight02} />
        </button>
      </div>
    </div>
  );
};
