import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageSquare } from 'lucide-react';

export default function PolicyViewer({
  title,
  policy,
  annotations = [],
}) {
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  // Build a set of annotated line numbers for quick lookup
  const annotatedLines = new Set(annotations.map((a) => a.line));
  const annotationMap = Object.fromEntries(
    annotations.map((a) => [a.line, a.text]),
  );

  const lines = policy.split('\n');

  return (
    <div className="my-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400">
            YAML
          </span>
        </div>
      )}

      <div className="relative">
        {/* Syntax highlighted YAML */}
        <div className="block dark:hidden">
          <SyntaxHighlighter
            language="yaml"
            style={oneLight}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => {
              const isAnnotated = annotatedLines.has(lineNumber);
              return {
                style: {
                  backgroundColor: isAnnotated
                    ? 'rgba(99, 102, 241, 0.1)'
                    : undefined,
                  display: 'block',
                  cursor: isAnnotated ? 'pointer' : undefined,
                },
                onClick: isAnnotated
                  ? () =>
                      setActiveAnnotation(
                        activeAnnotation === lineNumber ? null : lineNumber,
                      )
                  : undefined,
              };
            }}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.85rem',
              background: 'transparent',
            }}
          >
            {policy}
          </SyntaxHighlighter>
        </div>

        <div className="hidden dark:block">
          <SyntaxHighlighter
            language="yaml"
            style={oneDark}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => {
              const isAnnotated = annotatedLines.has(lineNumber);
              return {
                style: {
                  backgroundColor: isAnnotated
                    ? 'rgba(99, 102, 241, 0.15)'
                    : undefined,
                  display: 'block',
                  cursor: isAnnotated ? 'pointer' : undefined,
                },
                onClick: isAnnotated
                  ? () =>
                      setActiveAnnotation(
                        activeAnnotation === lineNumber ? null : lineNumber,
                      )
                  : undefined,
              };
            }}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.85rem',
              background: 'transparent',
            }}
          >
            {policy}
          </SyntaxHighlighter>
        </div>

        {/* Active annotation callout */}
        {activeAnnotation !== null && annotationMap[activeAnnotation] && (
          <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-3 py-2">
            <MessageSquare
              size={14}
              className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 dark:text-indigo-500">
                Line {activeAnnotation}
              </span>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                {annotationMap[activeAnnotation]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Annotation markers legend */}
      {annotations.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Click highlighted lines to view annotations ({annotations.length}{' '}
            {annotations.length === 1 ? 'annotation' : 'annotations'})
          </span>
        </div>
      )}
    </div>
  );
}
