import {
  FileText,
  Github,
  Newspaper,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';

const typeConfig = {
  docs: {
    icon: FileText,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  github: {
    icon: Github,
    color: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gray-50 dark:bg-gray-800/40',
  },
  article: {
    icon: Newspaper,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  video: {
    icon: PlayCircle,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
};

export default function ReferenceList({ references = [] }) {
  return (
    <div className="my-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        References
      </h3>

      {references.map((ref, i) => {
        const config = typeConfig[ref.type] ?? typeConfig.docs;
        const Icon = config.icon;

        return (
          <a
            key={i}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm ${config.bg}`}
          >
            <div
              className={`mt-0.5 shrink-0 ${config.color}`}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {ref.title}
                </span>
                <ExternalLink
                  size={12}
                  className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              {ref.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {ref.description}
                </p>
              )}
            </div>

            <span className="shrink-0 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">
              {ref.type}
            </span>
          </a>
        );
      })}
    </div>
  );
}
