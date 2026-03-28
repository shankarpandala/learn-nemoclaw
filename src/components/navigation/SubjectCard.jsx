import { Link } from 'react-router-dom'
import { BookOpen, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import useProgress from '../../hooks/useProgress'

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function SubjectCard({ subject }) {
  const { getSubjectProgress } = useProgress()
  const progress = getSubjectProgress(subject.id)
  const chapterCount = subject.chapters?.length || 0
  const color = subject.colorHex || '#76B900'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/subjects/${subject.id}`}
        className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Colored top border */}
        <div className="h-1.5" style={{ backgroundColor: color }} />

        <div className="p-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{subject.icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug">
                {subject.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
            </span>
            {subject.estimatedHours && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {subject.estimatedHours}h
              </span>
            )}
            {subject.difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${difficultyColors[subject.difficulty] || difficultyColors.beginner}`}>
                {subject.difficulty}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress.percent}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {progress.completed}/{progress.total} sections
              </span>
              <span className="text-[10px] font-medium" style={{ color }}>
                {progress.percent}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
