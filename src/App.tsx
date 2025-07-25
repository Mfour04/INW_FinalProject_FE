import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { SearchBar } from "./components/common/SearchBar/SearchBar";
import { SideBar } from "./components/common/SideBar/SideBar";
import { Router } from "./Routes/Router";

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isAdminRoute) {
      setIsSidebarOpen(false);
    }
  }, [isAdminRoute]);

  const gridColsClass = isAdminRoute
    ? "lg:grid-cols-[0px_1fr]"
    : isSidebarOpen
    ? "lg:grid-cols-[250px_1fr]"
    : "lg:grid-cols-[0px_1fr]";

  return (
    <div
      className={`lg:grid ${gridColsClass} min-h-screen h-screen transition-all duration-300`}
    >
      {!isAdminRoute && (
        <SideBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="h-full flex flex-col bg-amber-50 dark:bg-[#0f0f11] ">
        {!isAdminRoute && !isSidebarOpen && (
          <button
            className="fixed my-6 mx-2 p-2 bg-orange-500 text-white rounded lg:absolute"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        )}

        {!isAdminRoute && <SearchBar />}

        <div className="flex-1 overflow-y-auto">
          <Router />
        </div>
      </main>
    </div>
  );
}

export default App;
