import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { curriculum } from '../subjects/index.js'
import { STORAGE_KEY } from '../utils/constants.js'

/**
 * Central application store powered by Zustand.
 *
 * Persisted to localStorage so that theme preference, completed sections,
 * and bookmarks survive page reloads.
 */
const useAppStore = create(
  persist(
    (set, get) => ({
      // ---------------------------------------------------------------
      // Theme
      // ---------------------------------------------------------------
      theme: 'dark',

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),

      // ---------------------------------------------------------------
      // Sidebar
      // ---------------------------------------------------------------
      sidebarOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ---------------------------------------------------------------
      // Completed sections
      // ---------------------------------------------------------------
      completedSections: [],

      markSectionComplete: (sectionPath) =>
        set((state) => ({
          completedSections: state.completedSections.includes(sectionPath)
            ? state.completedSections
            : [...state.completedSections, sectionPath],
        })),

      unmarkSectionComplete: (sectionPath) =>
        set((state) => ({
          completedSections: state.completedSections.filter(
            (s) => s !== sectionPath,
          ),
        })),

      isComplete: (sectionPath) =>
        get().completedSections.includes(sectionPath),

      // ---------------------------------------------------------------
      // Subject-level progress
      // ---------------------------------------------------------------
      getSubjectProgress: (subjectId) => {
        const subject = curriculum.find((s) => s.id === subjectId)
        if (!subject) return { completed: 0, total: 0, percentage: 0 }

        let total = 0
        let completed = 0

        for (const ch of subject.chapters) {
          for (const sec of ch.sections) {
            total++
            const path = `${subjectId}/${ch.id}/${sec.id}`
            if (get().completedSections.includes(path)) completed++
          }
        }

        return {
          completed,
          total,
          percentage: total ? Math.round((completed / total) * 100) : 0,
        }
      },

      // ---------------------------------------------------------------
      // Bookmarks
      // ---------------------------------------------------------------
      bookmarks: [],

      toggleBookmark: (sectionPath) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(sectionPath)
            ? state.bookmarks.filter((b) => b !== sectionPath)
            : [...state.bookmarks, sectionPath],
        })),

      isBookmarked: (sectionPath) =>
        get().bookmarks.includes(sectionPath),
    }),
    {
      name: STORAGE_KEY,

      /**
       * After rehydrating from localStorage, re-apply the dark class so
       * the page renders with the correct theme before React paints.
       */
      onRehydrate: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    },
  ),
)

export default useAppStore
