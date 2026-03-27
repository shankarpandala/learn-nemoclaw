import { useMemo } from 'react'
import useAppStore from '../store/appStore'
import { curriculum } from '../subjects/index.js'
import { getAllSections } from '../utils/curriculum.js'

/**
 * Custom hook that exposes progress helpers for the curriculum.
 *
 * Returns:
 *   markComplete(path)     - mark a section as completed
 *   unmarkComplete(path)   - undo a completion
 *   isComplete(path)       - check whether a section is completed
 *   getProgress(subjectId) - { completed, total, percentage } for a subject
 *   totalCompleted         - number of sections completed across everything
 *   totalSections          - total number of sections in the curriculum
 *   overallPercentage      - overall completion percentage
 *   completedSections      - raw array of completed section paths
 */
export default function useProgress() {
  const completedSections = useAppStore((s) => s.completedSections)
  const markSectionComplete = useAppStore((s) => s.markSectionComplete)
  const unmarkSectionComplete = useAppStore((s) => s.unmarkSectionComplete)
  const getSubjectProgress = useAppStore((s) => s.getSubjectProgress)

  // Compute the total number of sections once (curriculum is static).
  const allSections = useMemo(() => getAllSections(), [])
  const totalSections = allSections.length

  // Derive overall counts from the current completedSections array.
  const totalCompleted = completedSections.length

  const overallPercentage = totalSections
    ? Math.round((totalCompleted / totalSections) * 100)
    : 0

  /**
   * Check whether a specific section path has been completed.
   */
  const isComplete = (sectionPath) =>
    completedSections.includes(sectionPath)

  /**
   * Get progress stats for a single subject.
   * Delegates to the store method which walks the curriculum.
   */
  const getProgress = (subjectId) => getSubjectProgress(subjectId)

  /**
   * Get progress for every subject at once.
   * Useful for dashboard / overview screens.
   */
  const getAllSubjectProgress = () =>
    curriculum.map((sub) => ({
      id: sub.id,
      title: sub.title,
      icon: sub.icon,
      colorHex: sub.colorHex,
      ...getSubjectProgress(sub.id),
    }))

  return {
    // Actions
    markComplete: markSectionComplete,
    unmarkComplete: unmarkSectionComplete,

    // Queries
    isComplete,
    getProgress,
    getAllSubjectProgress,

    // Aggregate stats
    totalCompleted,
    totalSections,
    overallPercentage,

    // Raw data (escape hatch)
    completedSections,
  }
}
