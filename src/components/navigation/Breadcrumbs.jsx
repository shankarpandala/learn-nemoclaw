import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap"
    >
      <Link
        to="/"
        className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Home"
      >
        <Home size={14} />
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1

        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
            {isLast || !item.path ? (
              <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-gray-700 dark:hover:text-gray-200 truncate max-w-[200px] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
