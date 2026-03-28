import { AlertTriangle } from 'lucide-react';

export default function WarningBlock({ title, children }) {
  return (
    <div className="my-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-red-100/60 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
        <AlertTriangle
          size={18}
          className="text-red-500 dark:text-red-400 shrink-0"
        />
        <span className="text-sm font-semibold text-red-800 dark:text-red-300">
          {title ?? 'Warning'}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 text-sm text-red-700 dark:text-red-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
