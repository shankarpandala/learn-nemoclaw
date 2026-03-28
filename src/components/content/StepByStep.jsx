export default function StepByStep({ title, steps }) {
  return (
    <div className="my-6">
      {title && <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h4>}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#76B900] text-white flex items-center justify-center font-semibold text-sm">
              {i + 1}
            </div>
            <div className="flex-1 pt-1">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{step.title}</h5>
              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
