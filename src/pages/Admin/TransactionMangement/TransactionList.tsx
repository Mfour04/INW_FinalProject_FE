import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DarkModeToggler } from "../../../components/DarkModeToggler";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionList = () => {
  const [range, setRange] = useState<"day" | "month">("day");
  const startDate = "2025-08-01";
  const endDate = "2025-08-31";

  // API cho card
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["TransactionSummary", startDate, endDate],
    queryFn: () =>
      GetTransactionSummary(startDate, endDate).then((res) => res.data),
  });

  // API cho chart
  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ["TransactionChart", range, startDate, endDate],
    queryFn: () =>
      GetTransactionChart(range, startDate, endDate).then((res) => res.data),
  });

  useEffect(() => {
    if (isSummaryLoading || isChartLoading) {
      console.log("Loading transaction data...");
    } else if (summaryError) {
      console.error("Error fetching summary data:", summaryError);
    } else if (chartError) {
      console.error("Error fetching chart data:", chartError);
    } else {
      console.log("Summary data:", summaryData);
      console.log("Chart data:", chartData);
    }
  }, [
    isSummaryLoading,
    isChartLoading,
    summaryError,
    chartError,
    summaryData,
    chartData,
  ]);

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
          color: "#ffffff",
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1c",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#4b4b4b",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#4b4b4b",
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#4b4b4b",
        },
        ticks: {
          color: "#ffffff",
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
        <DarkModeToggler />
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
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-gray-100 focus:ring-[#ff4d4f] focus:border-[#ff4d4f]"
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
