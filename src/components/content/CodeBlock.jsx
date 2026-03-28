import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const languageLabels = {
  bash: 'Bash',
  yaml: 'YAML',
  python: 'Python',
  json: 'JSON',
  javascript: 'JavaScript',
};

export default function CodeBlock({
  code,
  language = 'bash',
  title,
  copyable = true,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, [code]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 my-4 shadow-sm">
      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>
      )}

      {/* Code area */}
      <div className="relative group">
        {/* Language badge */}
        <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 select-none">
          {languageLabels[language] ?? language}
        </span>

        {/* Copy button */}
        {copyable && (
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className="absolute top-3 right-20 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}

        {/* Light theme block */}
        <div className="block dark:hidden">
          <SyntaxHighlighter
            language={language}
            style={oneLight}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.85rem',
              background: 'transparent',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Dark theme block */}
        <div className="hidden dark:block">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.85rem',
              background: 'transparent',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
