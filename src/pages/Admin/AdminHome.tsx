import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetHomeDashboard } from "../../api/Admin/Home/home.api";
import { GetReports } from "../../api/Admin/Report/report.api";
import { GetPendingWithdrawRequests } from "../../api/Admin/Request/request.api";
import { PaymentStatus } from "../../api/Admin/Request/request.type";
import { useDarkMode } from "../../context/ThemeContext/ThemeContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to get Vietnamese weekday names
const getVietnameseWeekday = (date: Date): string => {
  const weekdays = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return weekdays[date.getDay()];
};

const AdminHome = () => {
  const { darkMode } = useDarkMode();

  // Theme-aware chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1a1a1c" : "#ffffff",
        titleColor: darkMode ? "#ffffff" : "#000000",
        bodyColor: darkMode ? "#ffffff" : "#000000",
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#ffffff" : "#000000" },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        },
      },
      y: {
        ticks: { color: darkMode ? "#ffffff" : "#000000" },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        },
        beginAtZero: true,
      },
    },
  };

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["HomeDashboard"],
    queryFn: () => GetHomeDashboard().then((res) => res.data),
  });

  const { data: reportsData, isLoading: reportLoading } = useQuery({
    queryKey: ["ReportsAdminHome"],
    queryFn: () => GetReports().then((res) => res.data.data),
  });

  const reports = reportsData?.reports ?? [];

  const pendingReports = reports.filter((report) => report.status === 0).length;

  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery({
    queryKey: ["PendingWithdrawRequests"],
    queryFn: () =>
      GetPendingWithdrawRequests({
        page: 0,
        limit: 100,
        sortBy: "createdAt:desc",
      }).then((res) => res.data),
  });

  const totalRequests = requestsData?.data?.length || 0;
  const pendingRequests =
    requestsData?.data?.filter(
      (request) => request.status === PaymentStatus.Pending
    ).length || 0;

  // Count novels created today
  const today = new Date();
  const todayWeekday = getVietnameseWeekday(today);
  const newNovelsToday =
    dashboardData?.data?.newNovelsPerDay?.find(
      (item: { weekday: string }) => item.weekday === todayWeekday
    )?.count || 0;

  // Data for New Users chart (Line Chart)
  const userChartData = {
    labels:
      isLoadingDashboard || !dashboardData
        ? []
        : dashboardData.data.newUsersPerDay.map(
            (item: { weekday: string }) => item.weekday
          ),
    datasets: [
      {
        label: "Người dùng mới",
        data:
          isLoadingDashboard || !dashboardData
            ? []
            : dashboardData.data.newUsersPerDay.map(
                (item: { count: number }) => item.count
              ),
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Data for New Novels chart (Bar Chart)
  const novelChartData = {
    labels:
      isLoadingDashboard || !dashboardData
        ? []
        : dashboardData.data.newNovelsPerDay.map(
            (item: { weekday: string }) => item.weekday
          ),
    datasets: [
      {
        label: "Tiểu thuyết mới",
        data:
          isLoadingDashboard || !dashboardData
            ? []
            : dashboardData.data.newNovelsPerDay.map(
                (item: { count: number }) => item.count
              ),
        backgroundColor: "rgba(255, 77, 79, 0.5)",
        borderColor: "#ff4d4f",
        borderWidth: 1,
      },
    ],
  };

  // Chart canvas refs
  const chartRefs = {
    line: useRef(null),
    bar: useRef(null),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-6 lg:p-8 min-h-screen bg-[linear-gradient(180deg,#fafafa,transparent)] dark:bg-[linear-gradient(180deg,#0b0f14,transparent)] text-gray-900 dark:text-white"
    >
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Tổng quan Admin
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Theo dõi nhanh người dùng, tiểu thuyết và yêu cầu thanh toán.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur hover:bg-white dark:hover:bg-white/15 transition"
          >
            Quản lý người dùng
          </Link>
          <Link
            to="/admin/novels"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-white bg-[#ff4d4f] hover:bg-[#e03c3f] shadow-sm transition"
          >
            Quản lý tiểu thuyết
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Users */}
        <Link to="/admin/users" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm group-hover:shadow-md transition-shadow">
            <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,77,79,0.18),transparent_70%)]" />
            <div className="p-5 relative">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Người dùng
              </div>
              <div className="mt-1 text-2xl font-bold text-[#ff4d4f]">
                {isLoadingDashboard ? "…" : dashboardData?.data.totalUsers ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Mới hôm nay:{" "}
                {isLoadingDashboard
                  ? "…"
                  : dashboardData?.data.newUsersToday ?? 0}
              </div>
            </div>
          </div>
        </Link>

        {/* Novels */}
        <Link to="/admin/novels" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm group-hover:shadow-md transition-shadow">
            <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,77,79,0.14),transparent_70%)]" />
            <div className="p-5 relative">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Tiểu thuyết
              </div>
              <div className="mt-1 text-2xl font-bold text-[#ff4d4f]">
                {isLoadingDashboard
                  ? "…"
                  : dashboardData?.data.totalNovels ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Mới hôm nay: {isLoadingDashboard ? "…" : newNovelsToday ?? 0}
              </div>
            </div>
          </div>
        </Link>

        {/* Reports (placeholder UI only, logic giữ nguyên phần bạn đã comment) */}
        <Link to="/admin/reports" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm group-hover:shadow-md transition-shadow">
            <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,77,79,0.10),transparent_70%)]" />
            <div className="p-5 relative">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Báo cáo
              </div>
              {!reportLoading ? (
                <>
                  <div className="mt-1 text-2xl font-bold text-[#ff4d4f]">
                    {(reports ?? []).length}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Chưa xử lý: {pendingReports}
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-1 h-8 w-24 rounded bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
                  <div className="mt-1 h-4 w-32 rounded bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Requests */}
        <Link to="/admin/wallets" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm group-hover:shadow-md transition-shadow">
            <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,77,79,0.12),transparent_70%)]" />
            <div className="p-5 relative">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Yêu cầu
              </div>
              <div className="mt-1 text-2xl font-bold text-[#ff4d4f]">
                {isLoadingRequests
                  ? "…"
                  : requestsError
                  ? "Error"
                  : `${totalRequests}`}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Chưa xử lý: {isLoadingRequests ? "…" : pendingRequests ?? 0}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="space-y-6 lg:space-y-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-semibold">
              Người dùng mới (Tuần hiện tại)
            </h2>
          </div>
          <div className="h-[320px] sm:h-[360px] p-5">
            {isLoadingDashboard ? (
              <div className="h-full rounded-xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
            ) : (
              <Line
                ref={chartRefs.line}
                data={userChartData}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131a]/80 backdrop-blur shadow-sm">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-semibold">
              Tiểu thuyết mới (Tuần hiện tại)
            </h2>
          </div>
          <div className="h-[320px] sm:h-[360px] p-5">
            {isLoadingDashboard ? (
              <div className="h-full rounded-xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
            ) : (
              <Bar
                ref={chartRefs.bar}
                data={novelChartData}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;
