const headerColors = [
  'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300',
  'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300',
  'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
];

export default function ComparisonTable({
  title,
  headers = [],
  rows = [],
  highlightDiffs = false,
}) {
  return (
    <div className="my-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {title}
        </h3>
      )}

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-left font-semibold ${
                    headerColors[i % headerColors.length]
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isOdd = ri % 2 === 1;
              return (
                <tr
                  key={ri}
                  className={
                    isOdd
                      ? 'bg-gray-50 dark:bg-gray-800/40'
                      : 'bg-white dark:bg-gray-900'
                  }
                >
                  {row.map((cell, ci) => {
                    const isDiff =
                      highlightDiffs &&
                      ci > 0 &&
                      cell !== row[0];
                    return (
                      <td
                        key={ci}
                        className={`px-4 py-3 text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 ${
                          isDiff
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 font-medium'
                            : ''
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="sm:hidden space-y-3">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`px-4 py-2 ${
                  ci === 0
                    ? 'bg-gray-50 dark:bg-gray-800/60 font-medium text-gray-800 dark:text-gray-200'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                } ${ci > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
              >
                <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-0.5">
                  {headers[ci]}
                </span>
                <span className="text-sm">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
