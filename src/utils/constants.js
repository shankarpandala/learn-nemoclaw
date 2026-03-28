/**
 * Application-wide constants for Learn NemoClaw.
 */

/** Site metadata */
export const SITE_TITLE = 'Learn NemoClaw'

export const SITE_DESCRIPTION =
  'An interactive learning platform for NVIDIA NemoClaw — the AI agent security stack covering NeMo Guardrails, NeMo Retriever, NIM Security, and Agent Security patterns.'

export const GITHUB_URL = 'https://github.com/shankarpandala/learn-nemoclaw'

/** NVIDIA brand color */
export const NVIDIA_GREEN = '#76B900'

/**
 * Color palette for each curriculum subject.
 * Keys match subject IDs from the curriculum data.
 */
export const SUBJECT_COLORS = {
  'nemo-guardrails': {
    hex: '#76B900',
    name: 'NVIDIA Green',
    bg: 'bg-[#76B900]',
    bgLight: 'bg-[#76B900]/10',
    text: 'text-[#76B900]',
    border: 'border-[#76B900]',
    ring: 'ring-[#76B900]',
  },
  'nemo-retriever': {
    hex: '#0078D4',
    name: 'Azure Blue',
    bg: 'bg-[#0078D4]',
    bgLight: 'bg-[#0078D4]/10',
    text: 'text-[#0078D4]',
    border: 'border-[#0078D4]',
    ring: 'ring-[#0078D4]',
  },
  'nim-security': {
    hex: '#E53E3E',
    name: 'Security Red',
    bg: 'bg-[#E53E3E]',
    bgLight: 'bg-[#E53E3E]/10',
    text: 'text-[#E53E3E]',
    border: 'border-[#E53E3E]',
    ring: 'ring-[#E53E3E]',
  },
  'agent-security': {
    hex: '#9F7AEA',
    name: 'Agent Purple',
    bg: 'bg-[#9F7AEA]',
    bgLight: 'bg-[#9F7AEA]/10',
    text: 'text-[#9F7AEA]',
    border: 'border-[#9F7AEA]',
    ring: 'ring-[#9F7AEA]',
  },
}

/**
 * Default fallback color for unknown subjects.
 */
export const DEFAULT_SUBJECT_COLOR = {
  hex: '#6B7280',
  name: 'Gray',
  bg: 'bg-gray-500',
  bgLight: 'bg-gray-500/10',
  text: 'text-gray-500',
  border: 'border-gray-500',
  ring: 'ring-gray-500',
}

/**
 * Look up the color config for a subject, falling back to the default.
 */
export function getSubjectColor(subjectId) {
  return SUBJECT_COLORS[subjectId] ?? DEFAULT_SUBJECT_COLOR
}

/** localStorage key used by the Zustand persist middleware */
export const STORAGE_KEY = 'learn-nemoclaw-store'

/** Maximum search results returned by searchContent */
export const MAX_SEARCH_RESULTS = 20

/** Breakpoints (mirrors Tailwind defaults) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}
