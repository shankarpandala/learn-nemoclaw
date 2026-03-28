/**
 * Application-wide constants for Learn NemoClaw.
 */

/** Site metadata */
export const SITE_TITLE = 'Learn NemoClaw'

export const SITE_DESCRIPTION =
  'An interactive learning platform for NVIDIA NemoClaw — the open-source reference stack for running AI agents safely with sandboxing, policies, and credential isolation.'

export const GITHUB_URL = 'https://github.com/shankarpandala/learn-nemoclaw'

/** NVIDIA brand color */
export const NVIDIA_GREEN = '#76B900'

/**
 * Color palette for each curriculum subject.
 * Keys match subject IDs from the curriculum data.
 */
export const SUBJECT_COLORS = {
  '01-foundations': { hex: '#76B900', name: 'NVIDIA Green' },
  '02-openclaw': { hex: '#4A90D9', name: 'OpenClaw Blue' },
  '03-nemoclaw-architecture': { hex: '#FF6600', name: 'NemoClaw Orange' },
  '04-policies': { hex: '#E53935', name: 'Policy Red' },
  '05-bare-metal': { hex: '#7B1FA2', name: 'Bare Metal Purple' },
  '06-cloud-setup': { hex: '#00897B', name: 'Cloud Teal' },
  '07-applications': { hex: '#F57C00', name: 'Applications Amber' },
  '08-advanced': { hex: '#1565C0', name: 'Advanced Blue' },
}

/**
 * Look up the hex color for a subject, falling back to gray.
 */
export function getSubjectColor(subjectId) {
  return SUBJECT_COLORS[subjectId]?.hex ?? '#6B7280'
}

/** localStorage key used by the Zustand persist middleware */
export const STORAGE_KEY = 'learn-nemoclaw-store'

/** Maximum search results returned by searchContent */
export const MAX_SEARCH_RESULTS = 20
