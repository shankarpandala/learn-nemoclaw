import CodeBlock from './CodeBlock'

export default function PolicyBlock({ title, yaml, explanation, type = 'network' }) {
  const colors = {
    network: { border: 'border-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/20', badge: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200' },
    filesystem: { border: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', badge: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' },
    custom: { border: 'border-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/20', badge: 'bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200' },
  }
  const c = colors[type] || colors.network

  return (
    <div className={`my-6 rounded-lg border-l-4 ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${c.badge}`}>{type} policy</span>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      </div>
      {yaml && <CodeBlock code={yaml} language="yaml" />}
      {explanation && (
        <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{explanation}</div>
      )}
    </div>
  )
}
