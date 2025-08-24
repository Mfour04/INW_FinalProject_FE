// IncomeSummary.tsx
import type { IncomeSummaryRes } from "../../../api/AuthorIncome/income.type";

type Props = {
  summary: IncomeSummaryRes;
  title?: string;
};

const format = (n: number) => n?.toLocaleString?.("vi-VN") ?? String(n);

export const IncomeSummary = ({
  summary,
  title = "Tổng quan thu nhập",
}: Props) => {
  if (!summary) return;
  const items = [
    {
      key: "total",
      label: "Tổng xu nhận",
      value: format(summary.totalEarningsCoins),
      hint: "Tổng xu từ tất cả giao dịch",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
      suffix: "xu",
    },
    {
      key: "novelSalesCount",
      label: "Lượt mua truyện",
      value: format(summary.novelSalesCount),
      hint: "Tổng số lần mua truyện",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 4h9a3 3 0 0 1 3 3v13l-3-2-3 2-3-2-3 2V7a3 3 0 0 1 3-3z" />
        </svg>
      ),
    },
    {
      key: "chapterSalesCount",
      label: "Lượt mua chương",
      value: format(summary.chapterSalesCount),
      hint: "Tổng số lần mua chương",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
    {
      key: "novelCoins",
      label: "Xu từ truyện",
      value: format(summary.novelCoins),
      hint: "Doanh thu quy đổi từ truyện",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3v18M5 8h14M5 16h14" />
        </svg>
      ),
      suffix: "xu",
    },
    {
      key: "chapterCoins",
      label: "Xu từ chương",
      value: format(summary.chapterCoins),
      hint: "Doanh thu quy đổi từ chương",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      ),
      suffix: "xu",
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl text-white font-semibold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {items.map((it) => (
          <div
            key={it.key}
            className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
                {it.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">{it.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight">
                    {it.value}
                  </span>
                  {it.suffix && (
                    <span className="text-sm text-gray-500">{it.suffix}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{it.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
