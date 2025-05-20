import './App.css'
import { SearchBar } from './components/common/SearchBar/SearchBar';
import { SideBar } from './components/common/SideBar/SideBar';
import { Router } from './Router';

function App() {

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <SideBar />
      <main className="bg-amber-50 dark:bg-[#0f0f11]">
        <SearchBar />
        <Router />
      </main>
    </div>
  )
}

export default App
