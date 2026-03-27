import { BookOpen } from 'lucide-react';

export default function DefinitionBlock({
  term,
  definition,
  example,
  seeAlso,
}) {
  return (
    <div className="my-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-700">
        <BookOpen size={18} className="text-slate-500 dark:text-slate-400" />
        <span className="text-base font-bold text-slate-800 dark:text-slate-200">
          {term}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {definition}
        </p>

        {example && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border border-gray-100 dark:border-gray-700">
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Example
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {example}
            </p>
          </div>
        )}

        {seeAlso && seeAlso.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              See also:
            </span>
            {seeAlso.map((item, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
