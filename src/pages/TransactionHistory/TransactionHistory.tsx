import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetUserHistory } from "../../api/Transaction/transaction.api";
import type {
  GetUserHistoryParams,
  TransactionItem,
} from "../../api/Transaction/transaction.type";
import { TransactionCard } from "./TransactionCard";
import { Loader2, ChevronLeft } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

const TYPE_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Nạp coin", value: 0 },
  { label: "Rút coin", value: 1 },
  { label: "Mua tiểu thuyết", value: 2 },
  { label: "Mua chương", value: 3 },
];

const SORT_SIMPLE = [
  { label: "Mới nhất", value: "created_at:desc" },
  { label: "Cũ nhất", value: "created_at:asc" },
];

export const TransactionHistory = () => {
  const [params, setParams] = useState<GetUserHistoryParams>({
    page: 0,
    limit: 12,
    type: undefined,
    sortBy: "created_at:desc",
  });
  const [items, setItems] = useState<TransactionItem[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["userHistory_customSelect", params],
    queryFn: () =>
      GetUserHistory({
        page: params.page,
        limit: params.limit,
        ...(params.type !== undefined ? { type: params.type } : {}),
        sortBy: params.sortBy,
      }).then((res) => res.data.data),
  });

  const totalPage = data?.totalPage ?? 1;
  const currentPage = params.page ?? 0;
  const canLoadMore = currentPage < totalPage - 1;
  4;

  useEffect(() => {
    console.log(params);
  }, [params]);

  useEffect(() => {
    if (!data?.items) {
      setItems([]);
      return;
    }

    if (currentPage === 0) {
      setItems(data.items);
    } else {
      const seen = new Set(items.map((i) => i.id));
      setItems((prev) => [
        ...prev,
        ...data.items.filter((x) => !seen.has(x.id)),
      ]);
    }
  }, [data?.items, currentPage]);

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="py-3 px-1 flex items-center gap-10">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 grid place-items-center rounded-lg 
                            bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                            dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.12]"
              title="Quay lại"
              aria-label="Quay lại"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
              Lịch sử giao dịch
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={params.type}
              onChange={(v) =>
                setParams((old) => ({
                  ...old,
                  page: 0,
                  type: v,
                }))
              }
              options={TYPE_OPTIONS}
              className="w-[180px]"
            />
            <CustomSelect
              value={params.sortBy}
              onChange={(v) =>
                setParams((old) => ({
                  ...old,
                  page: 0,
                  sortBy: v,
                }))
              }
              options={SORT_SIMPLE}
              className="w-[160px]"
            />
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-500 dark:text-white/60" />
            ) : null}
          </div>
        </div>

        <div
          className={[
            "rounded-2xl p-4 md:p-5",
            "bg-white ring-1 ring-slate-200",
            "dark:bg-[#0a0f16]/60 dark:ring-white/10",
          ].join(" ")}
        >
          {isLoading && items.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-white/60">
              <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
              Đang tải...
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-white/60">
              Chưa có giao dịch nào.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-4 grid place-items-center">
              <button
                onClick={() =>
                  setParams((old) => ({ ...old, page: (old.page ?? 0) + 1 }))
                }
                disabled={!canLoadMore || isFetching}
                className={[
                  "h-9 px-4 rounded-md text-sm transition",
                  "bg-slate-100 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200 disabled:opacity-60",
                  "dark:bg-white/5 dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {isFetching
                  ? "Đang tải..."
                  : canLoadMore
                  ? "Xem thêm"
                  : "Hết dữ liệu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
