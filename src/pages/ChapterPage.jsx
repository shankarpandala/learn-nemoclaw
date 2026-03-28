import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import curriculum from '../subjects/index.js'
import Breadcrumbs from '../components/navigation/Breadcrumbs'
import useAppStore from '../store/appStore'
import NotFoundPage from './NotFoundPage'

const difficultyColors = {
  beginner:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced:
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams()
  const completedSections = useAppStore((s) => s.completedSections)

  const subject = curriculum.find((s) => s.id === subjectId)
  if (!subject) return <NotFoundPage />

  const chapter = subject.chapters.find((c) => c.id === chapterId)
  if (!chapter) return <NotFoundPage />

  const color = subject.colorHex || '#76B900'
  const sections = chapter.sections || []

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: subject.title, path: `/subjects/${subjectId}` },
          { label: chapter.title },
        ]}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {chapter.title}
        </h1>
        {chapter.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-4">
            {chapter.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FileText size={14} />
            {sections.length} {sections.length === 1 ? 'section' : 'sections'}
          </span>
          {chapter.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {chapter.estimatedMinutes} min
            </span>
          )}
        </div>

        <div
          className="h-1 rounded-full mt-5"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* Sections list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {sections.map((section, index) => {
          const sectionPath = `${subjectId}/${chapterId}/${section.id}`
          const isComplete = completedSections.includes(sectionPath)

          return (
            <motion.div key={section.id} variants={itemVariants}>
              <Link
                to={`/subjects/${subjectId}/${chapterId}/${section.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
              >
                {/* Section number / checkmark */}
                <div className="shrink-0">
                  {isComplete ? (
                    <CheckCircle size={22} className="text-green-500" />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold"
                      style={{ borderColor: color, color }}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#76B900] transition-colors">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {section.description}
                    </p>
                  )}
                </div>

                {/* Meta badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {section.difficulty && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        difficultyColors[section.difficulty] ||
                        difficultyColors.beginner
                      }`}
                    >
                      {section.difficulty}
                    </span>
                  )}
                  {section.readingMinutes && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                      <Clock size={10} />
                      {section.readingMinutes}m
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Back link */}
      <div className="mt-10">
        <Link
          to={`/subjects/${subjectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#76B900] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to {subject.title}
        </Link>
      </div>
    </div>
  )
}
