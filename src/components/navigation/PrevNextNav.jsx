import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PrevNextNav({ prev, next }) {
  if (!prev && !next) return null

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      {prev ? (
        <Link
          to={prev.path}
          className="flex-1 group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#76B900] hover:bg-[#76B900]/5 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-400 group-hover:text-[#76B900] shrink-0 transition-colors" />
          <div className="text-left min-w-0">
            <div className="text-xs text-gray-400 mb-0.5">Previous</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#76B900] truncate transition-colors">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}

      {next ? (
        <Link
          to={next.path}
          className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#76B900] hover:bg-[#76B900]/5 transition-colors"
        >
          <div className="text-right min-w-0">
            <div className="text-xs text-gray-400 mb-0.5">Next</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#76B900] truncate transition-colors">
              {next.title}
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-[#76B900] shrink-0 transition-colors" />
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}
    </div>
  )
}
