import { Clock, BarChart3 } from 'lucide-react';

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    color:
      'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  },
  intermediate: {
    label: 'Intermediate',
    color:
      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  advanced: {
    label: 'Advanced',
    color:
      'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  },
};

export default function SectionLayout({
  title,
  subtitle,
  difficulty,
  readingMinutes,
  children,
}) {
  const diff = difficultyConfig[difficulty] ?? difficultyConfig.beginner;

  return (
    <section className="my-8">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-gray-900 dark:to-purple-950/40 border border-b-0 border-gray-200 dark:border-gray-700 px-6 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {difficulty && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}
            >
              <BarChart3 size={12} />
              {diff.label}
            </span>
          )}
          {readingMinutes && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              {readingMinutes} min read
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content container */}
      <div className="rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-6">
        {children}
      </div>
    </section>
  );
}
