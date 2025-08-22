import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/common/Header/Header";
import { SideBar } from "./components/common/SideBar/SideBar";
import { AdminSidebar } from "./components/common/SideBar/AdminSidebar";
import { Router } from "./Routes/Router";

const STORAGE_KEY = "inkwave.sidebarOpen"; // "1" | "0"
const ADMIN_STORAGE_KEY = "inkwave.adminSidebarOpen"; // "1" | "0"
const LG = 1024;

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const defaultOpen = useMemo(
    () => typeof window !== "undefined" && window.innerWidth >= LG,
    []
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;

    const isMobile = window.innerWidth < LG;
    if (isMobile) return false;

    if (isAdminRoute) {
      // Cho admin route, kiểm tra localStorage riêng
      const savedAdmin = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      return savedAdmin === "1"
        ? true
        : savedAdmin === "0"
        ? false
        : defaultOpen;
    } else {
      // Cho user route, kiểm tra localStorage user
      const savedUser = window.localStorage.getItem(STORAGE_KEY);
      return savedUser === "1" ? true : savedUser === "0" ? false : defaultOpen;
    }
  });

  // Lưu state vào localStorage
  useEffect(() => {
    const isMobile = window.innerWidth < LG;
    if (!isMobile) {
      if (isAdminRoute) {
        window.localStorage.setItem(
          ADMIN_STORAGE_KEY,
          isSidebarOpen ? "1" : "0"
        );
      } else {
        window.localStorage.setItem(STORAGE_KEY, isSidebarOpen ? "1" : "0");
      }
    }
  }, [isSidebarOpen, isAdminRoute]);

  // Handle resize
  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < LG;
      if (isMobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isSidebarOpen]);

  // Handle route change
  useEffect(() => {
    const isMobile = window.innerWidth < LG;
    if (isMobile) {
      setIsSidebarOpen(false);
      return;
    }

    if (isAdminRoute) {
      // Khi chuyển sang admin route, load state từ admin localStorage
      const savedAdmin = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      const preferAdmin =
        savedAdmin === "1" ? true : savedAdmin === "0" ? false : defaultOpen;
      setIsSidebarOpen(preferAdmin);
    } else {
      // Khi chuyển sang user route, load state từ user localStorage
      const savedUser = window.localStorage.getItem(STORAGE_KEY);
      const preferUser =
        savedUser === "1" ? true : savedUser === "0" ? false : defaultOpen;
      setIsSidebarOpen(preferUser);
    }
  }, [isAdminRoute, defaultOpen]);

  const gridColsClass = isSidebarOpen
    ? "lg:grid-cols-[250px_minmax(0,1fr)] grid-cols-[250px_minmax(0,1fr)]"
    : "lg:grid-cols-[minmax(0,1fr)] grid-cols-[minmax(0,1fr)]";

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
              <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            ) : (
              <SideBar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            )}
          </aside>
        </div>
      )}

      <main
        className={[
          isSidebarOpen ? "lg:col-start-2" : "lg:col-start-1",
          "col-start-1 h-full min-h-0 flex flex-col bg-amber-50 bg-white dark:bg-[#0f0f11]",
        ].join(" ")}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          isAdminRoute={isAdminRoute}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <div className="flex-1 overflow-y-auto scrollbar-strong scrollbar-neon">
          <Router />
        </div>
      </main>
    </div>
  );
}

export default App;
