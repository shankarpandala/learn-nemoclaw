import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import useAppStore from '../../store/appStore'

export default function ChapterCard({ chapter, subjectId, colorHex = '#76B900' }) {
  const completedSections = useAppStore(s => s.completedSections)

  const sectionCount = chapter.sections?.length || 0
  let completedCount = 0
  if (chapter.sections) {
    for (const sec of chapter.sections) {
      const path = `${subjectId}/${chapter.id}/${sec.id}`
      if (completedSections.includes(path)) completedCount++
    }
  }

  const progressPercent = sectionCount > 0 ? Math.round((completedCount / sectionCount) * 100) : 0
  const isComplete = completedCount === sectionCount && sectionCount > 0

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/subjects/${subjectId}/${chapter.id}`}
        className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-[#76B900] transition-colors leading-snug">
            {chapter.title}
          </h4>
          {isComplete && (
            <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
          )}
        </div>

        {chapter.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
            {chapter.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <FileText size={12} />
            {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
          </span>
          {chapter.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {chapter.estimatedMinutes} min
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: colorHex,
            }}
          />
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {completedCount}/{sectionCount}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
