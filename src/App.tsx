import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/common/Header/Header";
import { SideBar } from "./components/common/SideBar/SideBar";
import { AdminSidebar } from "./components/common/SideBar/AdminSidebar";
import { Router } from "./Routes/Router";

const STORAGE_KEY = "inkwave.sidebarOpen"; // "1" | "0"
const LG = 1024;

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const defaultOpen = useMemo(
    () => !isAdminRoute && typeof window !== "undefined" && window.innerWidth >= LG,
    [isAdminRoute]
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const savedBool = saved === "1";
    const hasSaved = saved === "1" || saved === "0";
    const initial = hasSaved ? savedBool : defaultOpen;
    if (window.innerWidth < LG) return false;
    if (isAdminRoute) return false;
    return initial;
  });

  useEffect(() => {
    const isMobile = window.innerWidth < LG;
    if (!isAdminRoute && !isMobile) {
      window.localStorage.setItem(STORAGE_KEY, isSidebarOpen ? "1" : "0");
    }
  }, [isSidebarOpen, isAdminRoute]);

  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < LG;
      if (isMobile && isSidebarOpen) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isSidebarOpen]);

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
              <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            ) : (
              <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}
          </aside>
        </div>
      )}

      <main
        className={[
          isSidebarOpen ? "lg:col-start-2" : "lg:col-start-1",
          "col-start-1 h-full min-h-0 flex flex-col bg-amber-50 dark:bg-[#0f0f11]",
        ].join(" ")}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          isAdminRoute={isAdminRoute}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />
        <div className="flex-1 overflow-y-auto scrollbar-strong scrollbar-neon">
          <Router />
        </div>
      </main>
    </div>
  );
}

export default App;
