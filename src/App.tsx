import { useState } from "react";
import "./App.css";
import { SearchBar } from "./components/common/SearchBar/SearchBar";
import { SideBar } from "./components/common/SideBar/SideBar";
import { Router } from "./Routes/Router";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`lg:grid ${
        isSidebarOpen ? "lg:grid-cols-[250px_1fr]" : "lg:grid-cols-[0px_1fr]"
      } min-h-screen h-screen transition-all duration-300`}
    >
      {/* Sidebar luôn chiếm toàn bộ chiều cao */}
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main cũng phải h-full để cao bằng Sidebar */}
      <main className="h-full flex flex-col bg-amber-50 dark:bg-[#0f0f11] ">
        {/* Button toggle sidebar khi thu nhỏ */}
        {!isSidebarOpen && (
          <button
            className="fixed my-6 mx-2 p-2 bg-orange-500 text-white rounded lg:absolute"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        )}

        <SearchBar />

        {/* Nội dung Router chiếm phần còn lại */}
        <div className="flex-1 overflow-y-auto">
          <Router />
        </div>
      </main>
    </div>
  );
}

export default App;
