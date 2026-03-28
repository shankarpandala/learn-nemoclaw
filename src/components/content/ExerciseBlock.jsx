import { useState } from 'react';
import { CircleHelp, CheckCircle2, XCircle } from 'lucide-react';

export default function ExerciseBlock({
  question,
  options = [],
  correctIndex,
  explanation,
}) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="my-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-violet-50 dark:bg-violet-950/30 border-b border-gray-200 dark:border-gray-700">
        <CircleHelp size={18} className="text-violet-500 dark:text-violet-400" />
        <span className="text-sm font-semibold text-violet-800 dark:text-violet-300">
          Exercise
        </span>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Question */}
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {options.map((option, i) => {
            let optionStyle =
              'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer';

            if (answered) {
              if (i === correctIndex) {
                optionStyle =
                  'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/40';
              } else if (i === selected && !isCorrect) {
                optionStyle =
                  'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/40';
              } else {
                optionStyle =
                  'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 opacity-50';
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${optionStyle} ${
                  answered ? 'cursor-default' : ''
                }`}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {option}
                </span>
                {answered && i === correctIndex && (
                  <CheckCircle2
                    size={16}
                    className="ml-auto text-green-500 shrink-0"
                  />
                )}
                {answered && i === selected && !isCorrect && i !== correctIndex && (
                  <XCircle
                    size={16}
                    className="ml-auto text-red-500 shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && explanation && (
          <div
            className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            <span className="font-semibold">
              {isCorrect ? 'Correct!' : 'Not quite.'}
            </span>{' '}
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
