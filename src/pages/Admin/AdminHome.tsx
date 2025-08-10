import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetHomeDashboard } from "../../api/Admin/Home/home.api";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu tĩnh cho các phần không có API
const staticStats = {
  reports: { pending: 5 },
  requests: { pending: 3 },
};

// Dữ liệu cho Pie Chart (tĩnh)
const transactionChartData = {
  labels: ["Thành công", "Chờ xử lý", "Thất bại"],
  datasets: [
    {
      label: "Trạng thái giao dịch",
      data: [70, 20, 10],
      backgroundColor: [
        "rgba(255, 77, 79, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(99, 102, 241, 0.7)",
      ],
      borderColor: ["#ff4d4f", "#ff9f40", "#6366f1"],
      borderWidth: 1,
    },
  ],
};

// Tùy chọn chung cho biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#ffffff",
      },
    },
    tooltip: {
      backgroundColor: "#1a1a1c",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
    },
  },
  scales: {
    x: {
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    y: {
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
      beginAtZero: true,
    },
  },
};

// Tùy chọn cho Pie Chart
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#ffffff",
      },
    },
    tooltip: {
      backgroundColor: "#1a1a1c",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
    },
  },
};

const AdminHome = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["HomeDashboard"],
    queryFn: () => GetHomeDashboard().then((res) => res.data),
  });

  useEffect(() => {
    if (isLoading) {
      console.log("Loading dashboard data...");
    } else if (error) {
      console.error("Error fetching dashboard data:", error);
    } else {
      console.log("Dashboard data:", data);
    }
  }, [isLoading, error, data]);

  // Dữ liệu cho biểu đồ Người dùng mới (Line Chart)
  const userChartData = {
    labels:
      isLoading || !data
        ? []
        : data.data.newUsersPerDay.map((item) => item.weekday),
    datasets: [
      {
        label: "Người dùng mới",
        data:
          isLoading || !data
            ? []
            : data.data.newUsersPerDay.map((item) => item.count),
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Dữ liệu cho biểu đồ Tiểu thuyết mới (Bar Chart)
  const novelChartData = {
    labels:
      isLoading || !data
        ? []
        : data.data.newNovelsPerDay.map((item) => item.weekday),
    datasets: [
      {
        label: "Tiểu thuyết mới",
        data:
          isLoading || !data
            ? []
            : data.data.newNovelsPerDay.map((item) => item.count),
        backgroundColor: "rgba(255, 77, 79, 0.5)",
        borderColor: "#ff4d4f",
        borderWidth: 1,
      },
    ],
  };

  // Ref để debug canvas
  const chartRefs = {
    line: useRef(null),
    bar: useRef(null),
    pie: useRef(null),
  };

  useEffect(() => {
    Object.values(chartRefs).forEach((ref) => {
      if (ref.current) {
        console.log("Chart canvas rendered:", ref);
      } else {
        console.warn("Chart canvas not found for ref:", ref);
      }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen"
    >
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Tổng quan Admin
      </h1>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/admin/users" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Người dùng
            </h2>
            <p className="text-2xl font-bold text-[#ff4d4f]">
              {isLoading ? "Loading..." : data?.data.totalUsers ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mới hôm nay:{" "}
              {isLoading ? "Loading..." : data?.data.newUsersToday ?? 0}
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/novels" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Tiểu thuyết
            </h2>
            <p className="text-2xl font-bold text-[#ff4d4f]">
              {isLoading ? "Loading..." : data?.data.totalNovels ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đang chờ duyệt: {staticStats.reports.pending}
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/reports" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Báo cáo
            </h2>
            <p className="text-2xl font-bold text-[#ff4d4f]">
              {staticStats.reports.pending}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa xử lý
            </p>
          </motion.div>
        </Link>
        <Link to="/admin/wallets" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Yêu cầu
            </h2>
            <p className="text-2xl font-bold text-[#ff4d4f]">
              {staticStats.requests.pending}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa xử lý
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-[#1a1a1c] p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Người dùng mới (Tuần hiện tại)
          </h2>
          <div className="h-[240px]">
            {isLoading ? (
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
        <div className="bg-white dark:bg-[#1a1a1c] p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Tiểu thuyết mới (Tuần hiện tại)
          </h2>
          <div className="h-[240px]">
            {isLoading ? (
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
        <div className="bg-white dark:bg-[#1a1a1c] p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Trạng thái giao dịch
          </h2>
          <div className="h-[240px]">
            <Pie
              ref={chartRefs.pie}
              data={transactionChartData}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white dark:bg-[#1a1a1c] p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Hoạt động gần đây
        </h2>
        <ul className="space-y-2">
          <li className="text-sm text-gray-600 dark:text-gray-400">
            <Link to="/admin/users" className="text-[#ff4d4f] hover:underline">
              Người dùng "user123" vừa đăng ký
            </Link>{" "}
            - 5 phút trước
          </li>
          <li className="text-sm text-gray-600 dark:text-gray-400">
            <Link to="/admin/novels" className="text-[#ff4d4f] hover:underline">
              Tiểu thuyết "Tên tiểu thuyết" được đăng
            </Link>{" "}
            - 10 phút trước
          </li>
          <li className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/admin/reports"
              className="text-[#ff4d4f] hover:underline"
            >
              Báo cáo vi phạm từ "user456"
            </Link>{" "}
            - 15 phút trước
          </li>
          <li className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/admin/wallets"
              className="text-[#ff4d4f] hover:underline"
            >
              Yêu cầu rút tiền từ "user789"
            </Link>{" "}
            - 20 phút trước
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AdminHome;
