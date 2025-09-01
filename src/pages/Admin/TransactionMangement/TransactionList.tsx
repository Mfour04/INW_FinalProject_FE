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
import { SoftInput } from "../../AuthorAnalystics/components/AnalyticsUI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionList = () => {
  const { darkMode } = useDarkMode();
  const [range, setRange] = useState<"day" | "month">("day");
  const [startDate, setStartDate] = useState<string>("0001-01-01");
  const [endDate, setEndDate] = useState<string>("2999-12-31");
  const [displayStartDate, setDisplayStartDate] = useState<string>("");
  const [displayEndDate, setDisplayEndDate] = useState<string>("");

  // Helper function to format date as DD/MM/YYYY for UI
  const formatDateUI = (date: string | null) => {
    if (!date) return "…";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Helper function to format date as YYYY-MM-DD for /summary
  const formatDateSummary = (date: string) => {
    return date; // Already in YYYY-MM-DD
  };

  // Helper function to format date as DD-MM-YYYY for /chart
  const formatDateChart = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  // Handle start date change with validation
  const handleChangeFromDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    if (endDate && newStartDate && new Date(newStartDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không thể sau ngày kết thúc");
      return;
    }
    setStartDate(newStartDate || "0001-01-01");
    setDisplayStartDate(newStartDate || "");
  };

  // Handle end date change with validation
  const handleChangeToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    if (startDate && newEndDate && new Date(newEndDate) < new Date(startDate)) {
      alert("Ngày kết thúc không thể trước ngày bắt đầu");
      return;
    }
    setEndDate(newEndDate || "2999-12-31");
    setDisplayEndDate(newEndDate || "");
  };

  // Reset to default dates and clear UI inputs
  const handleResetDates = () => {
    setStartDate("0001-01-01");
    setEndDate("2999-12-31");
    setDisplayStartDate("");
    setDisplayEndDate("");
  };

  /* ================= Summary ================= */
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["TransactionSummary", startDate, endDate],
    queryFn: () =>
      GetTransactionSummary(
        formatDateSummary(startDate),
        formatDateSummary(endDate)
      ).then((res) => res.data),
  });

  /* ================= Chart ================= */
  const { data: chartRes, isLoading: isChartLoading } = useQuery({
    queryKey: ["TransactionChart", range, startDate, endDate],
    queryFn: () =>
      GetTransactionChart(
        range,
        formatDateChart(startDate),
        formatDateChart(endDate)
      ).then((res) => res.data),
  });

  const rows = isChartLoading || !chartRes ? [] : chartRes.data;

  const data = {
    labels: rows.map((item: any) => item.label),
    datasets: [
      {
        label: "Số giao dịch nạp",
        data: rows.map((item: any) => item.rechargeCount),
        backgroundColor: "#ff6a6e",
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 36,
      },
      {
        label: "Số giao dịch rút",
        data: rows.map((item: any) => item.withdrawCount),
        backgroundColor: "#34d399",
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 36,
      },
      {
        label: "Lợi nhuận (Coin)",
        data: rows.map((item: any) => item.profitCoins),
        backgroundColor: "#60a5fa",
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
            const label = data.labels?.[idx] ?? "";
            return String(label).length > 12
              ? String(label).slice(0, 12) + "…"
              : label;
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
        <motion.div
          className="mt-1 text-2xl font-bold text-[#ff4d4f]"
          key={typeof value === "string" ? value : value.toString()} // Force animation on value change
        >
          {isSummaryLoading ? (
            "…"
          ) : (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {typeof value === "string"
                ? value
                : value.toLocaleString("vi-VN")}
            </motion.span>
          )}
        </motion.div>
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
        <div className="flex items-center gap-2 flex-wrap">
          {/* From Date Input */}
          <div className="flex items-center gap-2 px-4 py-2 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition-all duration-200">
            <SoftInput
              type="date"
              value={displayStartDate}
              onChange={handleChangeFromDate}
              className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Separator */}
          <span className="text-gray-400 dark:text-gray-500 text-sm font-medium px-1">
            ──
          </span>

          {/* To Date Input */}
          <div className="flex items-center gap-2 px-4 py-2 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition-all duration-200">
            <SoftInput
              type="date"
              value={displayEndDate}
              onChange={handleChangeToDate}
              className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetDates}
            className="px-4 py-2 h-10 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800 rounded-xl shadow-sm hover:shadow-md active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đặt lại
            </span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Tổng giao dịch"
          value={
            isSummaryLoading ? "…" : summaryData?.data.totalTransactions ?? 0
          }
        />
        <StatCard
          title="Tổng coin nạp"
          value={
            isSummaryLoading ? "…" : summaryData?.data.totalRechargeCoins ?? 0
          }
        />
        <StatCard
          title="Tổng coin rút"
          value={
            isSummaryLoading ? "…" : summaryData?.data.totalWithdrawCoins ?? 0
          }
        />
        <StatCard
          title="Lợi nhuận (VND)"
          value={isSummaryLoading ? "…" : summaryData?.data.profitVND ?? 0}
        />
      </div>

      {/* Chart Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm">
        <div className="px-5 pt-5 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thống kê giao dịch
          </h2>
          <div className="inline-flex rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/10 backdrop-blur overflow-hidden">
            {(["day", "month"] as const).map((g) => (
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
                {g === "day" ? "Ngày" : "Tháng"}
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
      </div>
    </motion.div>
  );
};

export default TransactionList;
