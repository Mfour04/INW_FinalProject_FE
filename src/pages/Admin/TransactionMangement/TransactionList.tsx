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
  const startDate = "2025-08-01";
  const endDate = "2025-08-31";

  // API for summary cards
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["TransactionSummary", startDate, endDate],
    queryFn: () =>
      GetTransactionSummary(startDate, endDate).then((res) => res.data),
  });

  // API for chart data
  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["TransactionChart", range, startDate, endDate],
    queryFn: () =>
      GetTransactionChart(range, startDate, endDate).then((res) => res.data),
  });

  const data = {
    labels:
      isChartLoading || !chartData
        ? []
        : chartData.data.map((item) => item.label),
    datasets: [
      {
        label: "Số giao dịch nạp",
        data:
          isChartLoading || !chartData
            ? []
            : chartData.data.map((item) => item.rechargeCount),
        backgroundColor: "#ff4d4f",
      },
      {
        label: "Số giao dịch rút",
        data:
          isChartLoading || !chartData
            ? []
            : chartData.data.map((item) => item.withdrawCount),
        backgroundColor: "#16a34a",
      },
      {
        label: "Lợi nhuận (Coin)",
        data:
          isChartLoading || !chartData
            ? []
            : chartData.data.map((item) => item.profitCoins),
        backgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1a1a1c" : "#ffffff",
        titleColor: darkMode ? "#ffffff" : "#000000",
        bodyColor: darkMode ? "#ffffff" : "#000000",
        borderColor: darkMode ? "#4b4b4b" : "#d1d5db",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý giao dịch
        </h1>
        {/* <DarkModeToggler /> */}
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tổng giao dịch
          </h3>
          <p className="text-2xl font-bold text-[#ff4d4f]">
            {isSummaryLoading
              ? "Loading..."
              : summaryData?.data.totalTransactions ?? 0}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tổng coin nạp
          </h3>
          <p className="text-2xl font-bold text-[#ff4d4f]">
            {isSummaryLoading
              ? "Loading..."
              : summaryData?.data.totalRechargeCoins ?? 0}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tổng coin rút
          </h3>
          <p className="text-2xl font-bold text-[#ff4d4f]">
            {isSummaryLoading
              ? "Loading..."
              : summaryData?.data.totalWithdrawCoins ?? 0}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lợi nhuận (VND)
          </h3>
          <p className="text-2xl font-bold text-[#ff4d4f]">
            {isSummaryLoading
              ? "Loading..."
              : (summaryData?.data.profitVND ?? 0).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Thống kê giao dịch
          </h2>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "day" | "month")}
            className={`p-2 border rounded-md focus:ring-[#ff4d4f] focus:border-[#ff4d4f] ${
              darkMode
                ? "bg-[#1a1a1c] text-gray-100 border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <div style={{ height: "400px" }}>
            {isChartLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
              <Bar data={data} options={options} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionList;
