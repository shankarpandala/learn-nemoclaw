import { curriculum } from '../subjects/index.js'
import { MAX_SEARCH_RESULTS } from './constants.js'

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Find a subject by its ID.
 */
export function getSubjectById(id) {
  return curriculum.find((s) => s.id === id) ?? null
}

/**
 * Find a chapter within a subject.
 */
export function getChapterById(subjectId, chapterId) {
  const subject = getSubjectById(subjectId)
  return subject?.chapters.find((c) => c.id === chapterId) ?? null
}

/**
 * Find a section within a chapter.
 */
export function getSectionById(subjectId, chapterId, sectionId) {
  const chapter = getChapterById(subjectId, chapterId)
  return chapter?.sections.find((s) => s.id === sectionId) ?? null
}

// ---------------------------------------------------------------------------
// Flat list of all sections
// ---------------------------------------------------------------------------

/** Cached result so we only walk the tree once per page load. */
let _allSectionsCache = null

/**
 * Returns a flat array of every section in the curriculum, enriched with
 * contextual information (path, parent subject/chapter titles, color).
 */
export function getAllSections() {
  if (_allSectionsCache) return _allSectionsCache

  const sections = []

  for (const sub of curriculum) {
    for (const ch of sub.chapters) {
      for (const sec of ch.sections) {
        sections.push({
          ...sec,
          path: `${sub.id}/${ch.id}/${sec.id}`,
          subjectId: sub.id,
          subjectTitle: sub.title,
          subjectColor: sub.colorHex,
          chapterId: ch.id,
          chapterTitle: ch.title,
        })
      }
    }
  }

  _allSectionsCache = sections
  return sections
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

/**
 * Given a section's coordinates, returns the previous and next sections
 * across chapter and subject boundaries.
 *
 * @returns {{ prev: object|null, next: object|null }}
 */
export function getAdjacentSections(subjectId, chapterId, sectionId) {
  const all = getAllSections()
  const idx = all.findIndex(
    (s) =>
      s.subjectId === subjectId &&
      s.chapterId === chapterId &&
      s.id === sectionId,
  )

  if (idx === -1) return { prev: null, next: null }

  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}

/**
 * Resolve a path string ("subjectId/chapterId/sectionId") into its
 * constituent curriculum objects.
 */
export function getSectionByPath(path) {
  const [subjectId, chapterId, sectionId] = path.split('/')
  return {
    subject: getSubjectById(subjectId),
    chapter: getChapterById(subjectId, chapterId),
    section: getSectionById(subjectId, chapterId, sectionId),
  }
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Full-text search across subjects, chapters, and sections.
 * Matches against title and description fields (case-insensitive).
 * Returns at most MAX_SEARCH_RESULTS items, ordered subjects -> chapters -> sections.
 *
 * @param {string} query - Search term (minimum 2 characters).
 * @returns {Array<object>} Matching items annotated with `type` and `path`.
 */
export function searchContent(query) {
  if (!query || query.trim().length < 2) return []

  const q = query.toLowerCase().trim()
  const results = []

  for (const sub of curriculum) {
    if (
      sub.title.toLowerCase().includes(q) ||
      sub.description?.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'subject',
        id: sub.id,
        title: sub.title,
        description: sub.description,
        icon: sub.icon,
        colorHex: sub.colorHex,
        path: sub.id,
      })
    }

    for (const ch of sub.chapters) {
      if (
        ch.title.toLowerCase().includes(q) ||
        ch.description?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'chapter',
          id: ch.id,
          title: ch.title,
          description: ch.description,
          subjectId: sub.id,
          subjectTitle: sub.title,
          path: `${sub.id}/${ch.id}`,
        })
      }

      for (const sec of ch.sections) {
        if (
          sec.title.toLowerCase().includes(q) ||
          sec.description?.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'section',
            id: sec.id,
            title: sec.title,
            description: sec.description,
            subjectId: sub.id,
            subjectTitle: sub.title,
            chapterId: ch.id,
            chapterTitle: ch.title,
            path: `${sub.id}/${ch.id}/${sec.id}`,
          })
        }
      }
    }
  }

  return results.slice(0, MAX_SEARCH_RESULTS)
}

// ---------------------------------------------------------------------------
// Legacy aliases (backwards-compatible with earlier imports)
// ---------------------------------------------------------------------------

export const getSubject = getSubjectById
export const getChapter = getChapterById
export const getSection = getSectionById
export const searchCurriculum = searchContent
