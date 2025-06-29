import { useEffect, useState } from 'react';
import './App.css'
import { SearchBar } from './components/common/SearchBar/SearchBar';
import { SideBar } from './components/common/SideBar/SideBar';
import { Router } from './Router';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)  

  return (
    <div className={`lg:grid ${isSidebarOpen ? 'lg:grid-cols-[250px_1fr]' : 'lg:grid-cols-[0px_1fr]'} min-h-screen transition-all duration-300`}>
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="bg-amber-50 dark:bg-[#0f0f11]">
        {!isSidebarOpen && (
          <button
            className="fixed my-6 mx-2 p-2 bg-orange-500 text-white rounded lg:absolute"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        )}
        <SearchBar />
        <Router />
      </main>
    </div>
  )
}

export default App
