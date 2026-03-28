import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowLeft } from 'lucide-react'
import curriculum from '../subjects/index.js'
import ChapterCard from '../components/navigation/ChapterCard'
import Breadcrumbs from '../components/navigation/Breadcrumbs'
import NotFoundPage from './NotFoundPage'

const difficultyBadge = {
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
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function SubjectPage() {
  const { subjectId } = useParams()
  const subject = curriculum.find((s) => s.id === subjectId)

  if (!subject) return <NotFoundPage />

  const color = subject.colorHex || '#76B900'
  const sectionCount = subject.chapters.reduce(
    (sum, ch) => sum + (ch.sections?.length || 0),
    0,
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: subject.title }]}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {subject.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-2xl">
              {subject.description}
            </p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {subject.chapters.length}{' '}
            {subject.chapters.length === 1 ? 'chapter' : 'chapters'}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {sectionCount} sections
          </span>
          {subject.estimatedHours && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {subject.estimatedHours} hours
            </span>
          )}
          {subject.difficulty && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                difficultyBadge[subject.difficulty] || difficultyBadge.beginner
              }`}
            >
              {subject.difficulty}
            </span>
          )}
        </div>

        {/* Colored bar */}
        <div
          className="h-1 rounded-full mt-5"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* Prerequisites */}
      {subject.prerequisites && subject.prerequisites.length > 0 && (
        <div className="mb-8 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
            Prerequisites
          </h3>
          <ul className="space-y-1">
            {subject.prerequisites.map((prereqId) => {
              const prereq = curriculum.find((s) => s.id === prereqId)
              return prereq ? (
                <li key={prereqId}>
                  <Link
                    to={`/subjects/${prereqId}`}
                    className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    {prereq.icon} {prereq.title}
                  </Link>
                </li>
              ) : null
            })}
          </ul>
        </div>
      )}

      {/* Chapters grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {subject.chapters.map((chapter) => (
          <motion.div key={chapter.id} variants={itemVariants}>
            <ChapterCard
              chapter={chapter}
              subjectId={subject.id}
              colorHex={color}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Back link */}
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#76B900] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to all subjects
        </Link>
      </div>
    </div>
  )
}
