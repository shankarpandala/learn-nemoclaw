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
  const { getProgress } = useProgress()
  const progress = getProgress(subject.id)
  const chapterCount = subject.chapters?.length || 0
  const color = subject.colorHex || '#76B900'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link
        to={`/subjects/${subject.id}`}
        className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Colored top border */}
        <div className="h-1.5 shrink-0" style={{ backgroundColor: color }} />

        <div className="flex flex-col flex-1 p-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="h-11 w-11 shrink-0 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}20` }}
            >
              {subject.icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug">
              {subject.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>

          {/* Push everything below to the bottom */}
          <div className="mt-auto">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {chapterCount} chapters
              </span>
              {subject.estimatedHours && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {subject.estimatedHours}h
                </span>
              )}
              {subject.difficulty && (
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${difficultyColors[subject.difficulty] || difficultyColors.beginner}`}>
                  {subject.difficulty}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress.percentage || 0}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {progress.completed}/{progress.total} sections
              </span>
              <span className="text-[10px] font-medium" style={{ color }}>
                {progress.percentage || 0}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
