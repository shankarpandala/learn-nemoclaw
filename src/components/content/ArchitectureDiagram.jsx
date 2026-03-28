import { motion } from 'framer-motion';

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-200',
    desc: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-800 dark:text-emerald-200',
    desc: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-800 dark:text-purple-200',
    desc: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-800 dark:text-orange-200',
    desc: 'text-orange-600 dark:text-orange-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-800 dark:text-red-200',
    desc: 'text-red-600 dark:text-red-400',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    desc: 'text-gray-600 dark:text-gray-400',
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ArchitectureDiagram({
  title,
  components = [],
  connections = [],
}) {
  return (
    <div className="my-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}

      <motion.div
        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Component boxes */}
        <div className="flex flex-wrap gap-4 justify-center">
          {components.map((comp) => {
            const c = colorMap[comp.color] ?? colorMap.gray;
            return (
              <motion.div
                key={comp.name}
                variants={itemVariants}
                className={`relative min-w-[140px] max-w-[220px] rounded-lg border-2 ${c.border} ${c.bg} px-4 py-3 text-center`}
              >
                <div className={`text-sm font-bold ${c.text}`}>
                  {comp.name}
                </div>
                {comp.description && (
                  <div className={`text-xs mt-1 ${c.desc}`}>
                    {comp.description}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Connections rendered as a simple list below the diagram */}
        {connections.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap gap-3 justify-center"
          >
            {connections.map((conn, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {conn.from}
                </span>
                <span aria-hidden="true">&rarr;</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {conn.to}
                </span>
                {conn.label && (
                  <span className="text-gray-400 dark:text-gray-500">
                    ({conn.label})
                  </span>
                )}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
