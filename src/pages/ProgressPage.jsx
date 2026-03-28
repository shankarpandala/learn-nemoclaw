import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, CheckCircle, BookOpen } from 'lucide-react'
import curriculum from '../subjects/index.js'
import useProgress from '../hooks/useProgress'
import { getSectionByPath } from '../utils/curriculum.js'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function ProgressPage() {
  const {
    totalCompleted,
    totalSections,
    overallPercentage,
    getAllSubjectProgress,
    completedSections,
  } = useProgress()

  const subjectProgress = getAllSubjectProgress()

  // Build a list of recently completed sections (most recent first)
  const recentlyCompleted = [...completedSections]
    .reverse()
    .slice(0, 10)
    .map((path) => {
      const { subject, chapter, section } = getSectionByPath(path)
      return { path, subject, chapter, section }
    })
    .filter((item) => item.section)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={28} className="text-[#76B900]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Progress
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track your learning journey across all subjects.
        </p>
      </motion.div>

      {/* Overall progress card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-10 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Overall Progress
          </h2>
          <span className="text-2xl font-bold text-[#76B900]">
            {overallPercentage}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full bg-[#76B900]"
            initial={{ width: 0 }}
            animate={{ width: `${overallPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle size={12} />
            {totalCompleted} completed
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {totalSections} total sections
          </span>
        </div>
      </motion.div>

      {/* Per-subject progress */}
      <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        By Subject
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 mb-12"
      >
        {subjectProgress.map((sp) => {
          const subject = curriculum.find((s) => s.id === sp.id)
          const color = sp.colorHex || '#76B900'
          const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0

          return (
            <motion.div key={sp.id} variants={itemVariants}>
              <Link
                to={`/subjects/${sp.id}`}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{sp.icon}</span>
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {sp.title}
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold shrink-0"
                    style={{ color }}
                  >
                    {pct}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>

                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 text-right">
                  {sp.completed}/{sp.total} sections
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recently completed */}
      {recentlyCompleted.length > 0 && (
        <>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recently Completed
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {recentlyCompleted.map((item) => (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  to={`/subjects/${item.path}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
                >
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.section.title}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                      {item.subject?.title} &middot; {item.chapter?.title}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Empty state */}
      {totalCompleted === 0 && (
        <div className="text-center py-12">
          <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No progress yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Start learning and your progress will appear here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#76B900] text-white font-medium rounded-lg hover:bg-[#5a9200] transition-colors"
          >
            Browse Curriculum
          </Link>
        </div>
      )}
    </div>
  )
}
