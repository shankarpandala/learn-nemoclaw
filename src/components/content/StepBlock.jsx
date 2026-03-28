import CodeBlock from './CodeBlock';

export default function StepBlock({ title, steps = [] }) {
  return (
    <div className="my-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}

      <div className="relative pl-8">
        {/* Vertical connecting line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

        {steps.map((step, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            {/* Step number circle */}
            <div className="absolute -left-8 top-0 flex items-center justify-center w-[27px] h-[27px] rounded-full bg-indigo-500 dark:bg-indigo-600 text-white text-xs font-bold z-10">
              {i + 1}
            </div>

            {/* Step content */}
            <div className="pt-0.5">
              {step.title && (
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {step.title}
                </h4>
              )}

              {step.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  {step.content}
                </p>
              )}

              {step.code && (
                <CodeBlock
                  code={step.code}
                  language={step.language ?? 'bash'}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
