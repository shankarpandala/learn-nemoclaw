export default function ConceptBlock({ title, label, children, type = 'definition' }) {
  const colors = {
    definition: { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: '📖', label: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' },
    concept: { border: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', icon: '💡', label: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' },
    principle: { border: 'border-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: '⚡', label: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' },
  }
  const c = colors[type] || colors.definition

  return (
    <div className={`my-6 rounded-lg border-l-4 ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        {label && <span className={`text-xs font-semibold px-2 py-0.5 rounded ${c.label}`}>{label}</span>}
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-[0.95rem] leading-relaxed">
        {children}
      </div>
    </div>
  )
}
