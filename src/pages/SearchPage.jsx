import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, FileText, BookOpen, Layers } from 'lucide-react'
import curriculum from '../subjects/index.js'
import { searchContent } from '../utils/curriculum.js'

const typeIcons = {
  subject: Layers,
  chapter: BookOpen,
  section: FileText,
}

const typeLabels = {
  subject: 'Subject',
  chapter: 'Chapter',
  section: 'Section',
}

function getResultLink(result) {
  switch (result.type) {
    case 'subject':
      return `/subjects/${result.id}`
    case 'chapter':
      return `/subjects/${result.subjectId}/${result.id}`
    case 'section':
      return `/subjects/${result.subjectId}/${result.chapterId}/${result.id}`
    default:
      return '/'
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => searchContent(query), [query])

  // Group results by subject
  const grouped = useMemo(() => {
    const groups = {}
    for (const result of results) {
      const subjectId =
        result.type === 'subject' ? result.id : result.subjectId
      if (!groups[subjectId]) {
        const subject = curriculum.find((s) => s.id === subjectId)
        groups[subjectId] = {
          subjectTitle: subject?.title || result.subjectTitle || subjectId,
          subjectIcon: subject?.icon || result.icon || '',
          colorHex: subject?.colorHex || result.colorHex || '#76B900',
          items: [],
        }
      }
      groups[subjectId].items.push(result)
    }
    return groups
  }, [results])

  const groupKeys = Object.keys(grouped)

  const handleInputChange = (e) => {
    const value = e.target.value
    if (value) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Search
        </h1>

        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search subjects, chapters, and sections..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#76B900]/50 focus:border-[#76B900] transition-colors"
            autoFocus
          />
        </div>
      </motion.div>

      {/* Results */}
      {query.length >= 2 && results.length > 0 && (
        <div className="space-y-8">
          {groupKeys.map((subjectId) => {
            const group = grouped[subjectId]
            return (
              <div key={subjectId}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{group.subjectIcon}</span>
                  <h2
                    className="font-semibold text-sm"
                    style={{ color: group.colorHex }}
                  >
                    {group.subjectTitle}
                  </h2>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    ({group.items.length})
                  </span>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {group.items.map((result) => {
                    const Icon = typeIcons[result.type] || FileText
                    return (
                      <motion.div key={result.path} variants={itemVariants}>
                        <Link
                          to={getResultLink(result)}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                        >
                          <Icon
                            size={16}
                            className="text-gray-400 mt-0.5 shrink-0 group-hover:text-[#76B900] transition-colors"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#76B900] transition-colors truncate">
                                {result.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                                {typeLabels[result.type]}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                {result.description}
                              </p>
                            )}
                            {result.type === 'section' && result.chapterTitle && (
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                {result.subjectTitle} &middot;{' '}
                                {result.chapterTitle}
                              </p>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            )
          })}
        </div>
      )}

      {/* No results */}
      {query.length >= 2 && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Search size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No results found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try a different search term or browse the{' '}
            <Link to="/" className="text-[#76B900] hover:underline">
              curriculum
            </Link>
            .
          </p>
        </motion.div>
      )}

      {/* Empty state - no query */}
      {query.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Search size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Search the curriculum
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Type at least 2 characters to search across all subjects, chapters,
            and sections.
          </p>
        </motion.div>
      )}
    </div>
  )
}
