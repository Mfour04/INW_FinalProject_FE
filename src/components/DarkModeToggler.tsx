import { useDarkMode } from "../context/ThemeContext/ThemeContext"

export const DarkModeToggler = () => {
  const {darkMode, setDarkMode} = useDarkMode();
  return (
    <button onClick={() => setDarkMode(!darkMode)} className='px-6 py-2 bg-white'>
        { darkMode ? "Light" : "Dark" }
    </button>
  )
}
