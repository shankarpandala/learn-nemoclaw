import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ChevronDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { curriculum } from '../../subjects'
import useAppStore from '../../store/appStore'

export default function Sidebar() {
  const { subjectId, chapterId, sectionId } = useParams()
  const sidebarOpen = useAppStore(s => s.sidebarOpen)
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen)
  const completedSections = useAppStore(s => s.completedSections)
  const [expanded, setExpanded] = useState({})

  // Auto-expand current subject
  useEffect(() => {
    if (subjectId) {
      setExpanded(prev => ({ ...prev, [subjectId]: true }))
    }
  }, [subjectId])

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const getSubjectProgress = (subject) => {
    let total = 0
    let completed = 0
    for (const ch of subject.chapters) {
      for (const sec of ch.sections) {
        total++
        const path = `${subject.id}/${ch.id}/${sec.id}`
        if (completedSections.includes(path)) completed++
      }
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const sidebarContent = (
    <div className="p-4">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Navigation</span>
        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-1">
        {curriculum.map(sub => {
          const progress = getSubjectProgress(sub)
          const isActive = subjectId === sub.id
          const isExpanded = expanded[sub.id]

          return (
            <div key={sub.id}>
              <button
                onClick={() => toggleExpand(sub.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: sub.colorHex || '#76B900' }}
                />
                <span className="truncate flex-1 text-left">{sub.title}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-1">
                  {progress}%
                </span>
                {isExpanded ? (
                  <ChevronDown size={14} className="shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="shrink-0 text-gray-400" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700">
                      {sub.chapters.map(ch => {
                        const isChActive = chapterId === ch.id

                        return (
                          <div key={ch.id}>
                            <Link
                              to={`/subjects/${sub.id}/${ch.id}`}
                              onClick={closeSidebar}
                              className={`block text-xs px-3 py-1.5 rounded-r-md transition-colors ${
                                isChActive
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium border-l-2 -ml-[2px]'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                              style={isChActive ? { borderLeftColor: sub.colorHex || '#76B900' } : undefined}
                            >
                              {ch.title}
                            </Link>

                            <AnimatePresence initial={false}>
                              {isChActive && ch.sections && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-3 mt-0.5 space-y-0.5">
                                    {ch.sections.map(sec => {
                                      const secPath = `${sub.id}/${ch.id}/${sec.id}`
                                      const done = completedSections.includes(secPath)
                                      const isSecActive = sectionId === sec.id

                                      return (
                                        <Link
                                          key={sec.id}
                                          to={`/subjects/${sub.id}/${ch.id}/${sec.id}`}
                                          onClick={closeSidebar}
                                          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-md transition-colors ${
                                            isSecActive
                                              ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-800'
                                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                          }`}
                                        >
                                          <span
                                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                              done
                                                ? 'bg-green-500'
                                                : isSecActive
                                                  ? 'bg-[#76B900]'
                                                  : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                          />
                                          <span className="truncate">{sec.title}</span>
                                        </Link>
                                      )
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
