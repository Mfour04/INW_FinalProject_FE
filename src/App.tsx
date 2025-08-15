import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/common/Header/Header";
import { SideBar } from "./components/common/SideBar/SideBar";
import { AdminSidebar } from "./components/common/SideBar/AdminSidebar";
import { Router } from "./Routes/Router";

const STORAGE_KEY = "inkwave.sidebarOpen"; // "1" | "0"
const LG = 1024; // breakpoint lg

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  // Tính trạng thái mặc định (khi chưa có localStorage)
  const defaultOpen = useMemo(
    () => !isAdminRoute && typeof window !== "undefined" && window.innerWidth >= LG,
    [isAdminRoute]
  );

  // Khởi tạo từ localStorage (nếu có), sau đó kẹp theo route + width hiện tại
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const savedBool = saved === "1";
    const hasSaved = saved === "1" || saved === "0";
    const initial = hasSaved ? savedBool : defaultOpen;
    // clamp theo ngữ cảnh hiện tại
    if (window.innerWidth < LG) return false;
    if (isAdminRoute) return false;
    return initial;
  });

  // Lưu vào localStorage khi user thay đổi (chỉ lưu preference của user)
  useEffect(() => {
    // Không lưu khi bị ép đóng do admin route hay mobile hẹp
    const isMobile = window.innerWidth < LG;
    if (!isAdminRoute && !isMobile) {
      window.localStorage.setItem(STORAGE_KEY, isSidebarOpen ? "1" : "0");
    }
  }, [isSidebarOpen, isAdminRoute]);

  // Auto-đóng khi resize xuống mobile; khi quay lại desktop thì GIỮ state hiện tại (không override)
  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < LG;
      if (isMobile && isSidebarOpen) setIsSidebarOpen(false);
      // Trở lại >= lg: giữ nguyên trạng thái hiện tại (đã có trong state/localStorage)
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isSidebarOpen]);

  // Mỗi lần đổi route → nếu vào /admin thì ép đóng; rời admin thì trả về preference người dùng (đã lưu)
  useEffect(() => {
    if (isAdminRoute) {
      setIsSidebarOpen(false);
    } else {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const hasSaved = saved === "1" || saved === "0";
      const prefer = hasSaved ? saved === "1" : defaultOpen;
      const isMobile = window.innerWidth < LG;
      setIsSidebarOpen(isMobile ? false : prefer);
    }
  }, [isAdminRoute, defaultOpen]);

  const gridColsClass = isSidebarOpen
    ? "lg:grid-cols-[250px_1fr] grid-cols-[250px_1fr]"
    : "lg:grid-cols-1 grid-cols-1";

  return (
    <div
      className={[
        "grid gap-0",
        gridColsClass,
        "min-h-screen h-screen",
        "transition-all duration-300",
        "overflow-x-hidden",
      ].join(" ")}
    >
      {isSidebarOpen && (
        <div className="lg:col-start-1 lg:row-start-1 lg:h-screen">
          <aside className="h-full w-full bg-white dark:bg-[#0f0f11] lg:static lg:overflow-y-auto">
            {isAdminRoute ? (
              <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            ) : (
              <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}
          </aside>
        </div>
      )}

      <main className="lg:col-start-2 h-full min-h-0 flex flex-col bg-amber-50 dark:bg-[#0f0f11]">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <Router />
        </div>
      </main>

      {!isSidebarOpen && !isAdminRoute && (
        <button
          aria-label="Open sidebar"
          onClick={() => setIsSidebarOpen(true)}
          className={[
            "fixed left-4 top-4 lg:left-6 lg:top-6 z-[60]",
            "flex items-center justify-center",
            "h-10 w-10 rounded-xl",
            "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
            "shadow-[0_6px_16px_rgba(255,103,64,0.45)]",
            "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
            "hover:shadow-[0_8px_20px_rgba(255,103,64,0.60)]",
            "transition-all duration-300 active:scale-95"
          ].join(" ")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;
