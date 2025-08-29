import { useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import {
  GetTransactionSummary,
  GetTransactionChart,
} from "../../../api/Transaction/transaction.api";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionList = () => {
  const { darkMode } = useDarkMode();

  // NEW: thêm 'year'
  const [range, setRange] = useState<"day" | "month" | "year">("day");
  const startDate = "2025-08-01";
  const endDate = "2025-08-31";

  /* ================= Summary ================= */
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["TransactionSummary", startDate, endDate],
    queryFn: () => GetTransactionSummary(startDate, endDate).then((res) => res.data),
  });

  /* ================= Chart ================= */
  const { data: chartRes, isLoading: isChartLoading } = useQuery({
    queryKey: ["TransactionChart", range, startDate, endDate],
    queryFn: () => GetTransactionChart(range, startDate, endDate).then((res) => res.data),
  });

  const rows = isChartLoading || !chartRes ? [] : chartRes.data;

  const data = {
    labels: rows.map((item: any) => item.label),
    datasets: [
      {
        label: "Số giao dịch nạp",
        data: rows.map((item: any) => item.rechargeCount),
        backgroundColor: "#ff6a6e", // nhẹ hơn #ff4d4f
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 36,
      },
      {
        label: "Số giao dịch rút",
        data: rows.map((item: any) => item.withdrawCount),
        backgroundColor: "#34d399", // emerald-400
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 36,
      },
      {
        label: "Lợi nhuận (Coin)",
        data: rows.map((item: any) => item.profitCoins),
        backgroundColor: "#60a5fa", // blue-400
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 6 },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: darkMode ? "#e5e7eb" : "#111827",
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#0f1115" : "#ffffff",
        titleColor: darkMode ? "#ffffff" : "#111827",
        bodyColor: darkMode ? "#e5e7eb" : "#111827",
        borderColor: darkMode ? "#272b33" : "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => {
            const v = Number(ctx.raw) || 0;
            // Hiển thị có dấu phẩy ngăn cách
            return ` ${ctx.dataset.label}: ${v.toLocaleString("vi-VN")}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: darkMode ? "#e5e7eb" : "#111827",
          maxRotation: 0 as const,
          autoSkip: true,
          callback: (val: any, idx: number) => {
            // Nhãn gọn nếu quá dài
            const label = data.labels?.[idx] ?? "";
            return String(label).length > 12 ? String(label).slice(0, 12) + "…" : label;
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: darkMode ? "#e5e7eb" : "#111827",
          callback: (val: any) => Number(val).toLocaleString("vi-VN"),
        },
      },
    },
  };

  const StatCard = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm">
      <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,106,110,0.18),transparent_70%)]" />
      <div className="p-5 relative">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="mt-1 text-2xl font-bold text-[#ff4d4f]">{value}</div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-6 lg:p-8 min-h-screen bg-[linear-gradient(180deg,#fafafa,transparent)] dark:bg-[linear-gradient(180deg,#0b0f14,transparent)]"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý giao dịch
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Theo dõi số lượng giao dịch và lợi nhuận theo thời gian.
          </p>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Khoảng thời gian: <span className="font-medium text-zinc-700 dark:text-zinc-200">{startDate}</span> —{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-200">{endDate}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Tổng giao dịch"
          value={
            isSummaryLoading
              ? "…"
              : (summaryData?.data.totalTransactions ?? 0).toLocaleString("vi-VN")
          }
        />
        <StatCard
          title="Tổng coin nạp"
          value={
            isSummaryLoading
              ? "…"
              : (summaryData?.data.totalRechargeCoins ?? 0).toLocaleString("vi-VN")
          }
        />
        <StatCard
          title="Tổng coin rút"
          value={
            isSummaryLoading
              ? "…"
              : (summaryData?.data.totalWithdrawCoins ?? 0).toLocaleString("vi-VN")
          }
        />
        <StatCard
          title="Lợi nhuận (VND)"
          value={
            isSummaryLoading
              ? "…"
              : (summaryData?.data.profitVND ?? 0).toLocaleString("vi-VN")
          }
        />
      </div>

      {/* Chart Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm">
        <div className="px-5 pt-5 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thống kê giao dịch
          </h2>

          {/* Segmented control: Ngày / Tháng / Năm (KHÔNG đổi logic gọi API – chỉ set range) */}
          <div className="inline-flex rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/10 backdrop-blur overflow-hidden">
            {(["day", "month", "year"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setRange(g)}
                className={[
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  range === g
                    ? "text-white bg-[#ff4d4f]"
                    : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {g === "day" ? "Ngày" : g === "month" ? "Tháng" : "Năm"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[360px] sm:h-[400px] p-5">
          {isChartLoading ? (
            <div className="h-full rounded-xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
          ) : (
            <Bar data={data as any} options={options as any} />
          )}
        </div>

        {/* Gợi ý khi backend chưa có 'year' */}
        {range === "year" && !isChartLoading && rows.length === 0 && (
          <div className="px-5 pb-5 -mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Chưa có dữ liệu theo năm cho khoảng thời gian đã chọn.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionList;
