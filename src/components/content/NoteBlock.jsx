import { useState } from 'react';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

const variants = {
  info: {
    icon: Info,
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    iconColor: 'text-blue-500 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-300',
    defaultTitle: 'Info',
  },
  tip: {
    icon: Lightbulb,
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    titleColor: 'text-emerald-800 dark:text-emerald-300',
    defaultTitle: 'Tip',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-500 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-300',
    defaultTitle: 'Warning',
  },
  important: {
    icon: AlertCircle,
    border: 'border-red-400 dark:border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/40',
    iconColor: 'text-red-500 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-300',
    defaultTitle: 'Important',
  },
  historical: {
    icon: BookOpen,
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-purple-500 dark:text-purple-400',
    titleColor: 'text-purple-800 dark:text-purple-300',
    defaultTitle: 'Historical Context',
  },
};

export default function NoteBlock({
  type = 'info',
  title,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const v = variants[type] ?? variants.info;
  const Icon = v.icon;

  return (
    <div
      className={`my-4 rounded-xl border-l-4 ${v.border} ${v.bg} overflow-hidden`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-2 px-4 py-3 cursor-pointer select-none"
      >
        <Icon size={18} className={v.iconColor} />
        <span className={`text-sm font-semibold ${v.titleColor}`}>
          {title ?? v.defaultTitle}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto transition-transform ${v.iconColor} ${
            collapsed ? '-rotate-90' : ''
          }`}
        />
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
