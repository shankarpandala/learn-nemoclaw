import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Search, Menu, X, Moon, Sun, Github } from 'lucide-react'
import useAppStore from '../../store/appStore'

export default function Navbar() {
  const theme = useAppStore(s => s.theme)
  const toggleTheme = useAppStore(s => s.toggleTheme)
  const sidebarOpen = useAppStore(s => s.sidebarOpen)
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen)
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#76B900] flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100 hidden sm:inline">
              Learn NemoClaw
            </span>
          </Link>
        </div>

        {/* Center: search (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#76B900]/40 focus:border-[#76B900] transition-colors"
            />
          </form>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <a
            href="https://github.com/NVIDIA/NemoClaw"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar (expandable) */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#76B900]/40 focus:border-[#76B900] transition-colors"
            />
          </form>
        </div>
      )}
    </nav>
  )
}
