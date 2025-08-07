import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { SearchBar } from "./components/common/SearchBar/SearchBar";
import { SideBar } from "./components/common/SideBar/SideBar";
import { AdminSidebar } from "./components/common/SideBar/AdminSidebar";
import { Router } from "./Routes/Router";

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsSidebarOpen(!isAdminRoute);
  }, [isAdminRoute]);

  // Đồng bộ isSidebarOpen khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Ẩn sidebar trên mobile
      } else {
        setIsSidebarOpen(true); // Mở sidebar trên laptop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi ngay khi mount để đồng bộ trạng thái ban đầu

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridColsClass = isSidebarOpen
    ? "lg:grid-cols-[250px_1fr] grid-cols-[250px_1fr]"
    : "lg:grid-cols-[60px_1fr] grid-cols-[0px_1fr]";

  return (
    <div
      className={`lg:grid ${gridColsClass} min-h-screen h-screen transition-all duration-300`}
    >
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

      <main className="h-full flex flex-col bg-amber-50 dark:bg-[#0f0f11] ">
        {!isSidebarOpen && (
          <button
            className="fixed my-6 mx-2 p-2 bg-orange-500 text-white rounded lg:absolute"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        )}

        <SearchBar />

        <div className="flex-1 overflow-y-auto">
          <Router />
        </div>
      </main>
    </div>
  );
}

export default App;
