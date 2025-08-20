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
import { ReportStatus } from "../../api/Admin/Report/report.type";
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
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: { color: darkMode ? "#ffffff" : "#000000" },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        beginAtZero: true,
      },
    },
  };

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
  } = useQuery({
    queryKey: ["HomeDashboard"],
    queryFn: () => GetHomeDashboard().then((res) => res.data),
  });

  // Fetch reports data
  const {
    data: reportsData,
    isLoading: isLoadingReports,
    error: reportsError,
  } = useQuery({
    queryKey: ["Reports"],
    queryFn: () => GetReports(0, 100).then((res) => res.data),
  });

  // Fetch pending withdrawal requests data
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

  // Count total and pending reports and requests
  const totalReports = reportsData?.data?.length || 0;
  const pendingReports =
    reportsData?.data?.filter(
      (report) => report.status === ReportStatus.InProgress
    ).length || 0;
  const totalRequests = requestsData?.data?.length || 0;
  const pendingRequests =
    requestsData?.data?.filter(
      (request) => request.status === PaymentStatus.Pending
    ).length || 0;

  // Count novels created today
  const today = new Date();
  const todayWeekday = getVietnameseWeekday(today);
  const newNovelsToday =
    dashboardData?.data.newNovelsPerDay.find(
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-8 bg-gray-100 dark:bg-[#0f0f11] min-h-screen text-gray-900 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-8">Tổng quan Admin</h1>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/users" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Người dùng</h2>
            <p className="text-3xl font-bold text-[#ff4d4f]">
              {isLoadingDashboard
                ? "Loading..."
                : dashboardData?.data.totalUsers ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Mới hôm nay:{" "}
              {isLoadingDashboard
                ? "Loading..."
                : dashboardData?.data.newUsersToday ?? 0}
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/novels" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Tiểu thuyết</h2>
            <p className="text-3xl font-bold text-[#ff4d4f]">
              {isLoadingDashboard
                ? "Loading..."
                : dashboardData?.data.totalNovels ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Mới hôm nay:{" "}
              {isLoadingDashboard ? "Loading..." : newNovelsToday ?? 0}
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/reports" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Báo cáo</h2>
            <p className="text-3xl font-bold text-[#ff4d4f]">
              {isLoadingReports
                ? "Loading..."
                : reportsError
                ? "Error"
                : `${totalReports}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Chưa xử lý:{" "}
              {isLoadingReports ? "Loading..." : pendingReports ?? 0}
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/wallets" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Yêu cầu</h2>
            <p className="text-3xl font-bold text-[#ff4d4f]">
              {isLoadingRequests
                ? "Loading..."
                : requestsError
                ? "Error"
                : `${totalRequests}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Chưa xử lý:{" "}
              {isLoadingRequests ? "Loading..." : pendingRequests ?? 0}
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            Người dùng mới (Tuần hiện tại)
          </h2>
          <div className="h-[350px]">
            {isLoadingDashboard ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
              <Line
                ref={chartRefs.line}
                data={userChartData}
                options={chartOptions}
              />
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            Tiểu thuyết mới (Tuần hiện tại)
          </h2>
          <div className="h-[350px]">
            {isLoadingDashboard ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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

      {/* System Overview */}
      <div className="mt-8 bg-white dark:bg-[#1a1a1c] p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Tổng quan hệ thống</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Chào mừng bạn đến với bảng điều khiển Admin! Đây là nơi bạn có thể
          theo dõi và quản lý các hoạt động chính của hệ thống, bao gồm người
          dùng, tiểu thuyết, báo cáo và yêu cầu rút tiền. Sử dụng các thẻ thống
          kê và biểu đồ để nắm bắt nhanh tình hình hoạt động.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#e03c3f] transition-colors"
          >
            Quản lý người dùng
          </Link>
          <Link
            to="/admin/novels"
            className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#e03c3f] transition-colors"
          >
            Quản lý tiểu thuyết
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;
