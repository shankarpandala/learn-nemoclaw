import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Wrench,
  Shield,
  Briefcase,
  BookOpen,
  Layers,
  FileText,
  Clock,
} from 'lucide-react'
import curriculum from '../subjects/index.js'
import SubjectCard from '../components/navigation/SubjectCard'

const stats = [
  { label: 'Subjects', value: '8', icon: Layers },
  { label: 'Chapters', value: '40', icon: BookOpen },
  { label: 'Sections', value: '159', icon: FileText },
  { label: 'Est. Hours', value: '~49', icon: Clock },
]

const features = [
  {
    title: 'Progressive Learning',
    description:
      'Start from the foundations and build up to advanced topics. Each subject builds on what you already know.',
    icon: GraduationCap,
  },
  {
    title: 'Hands-On Setup Guides',
    description:
      'Step-by-step installation and configuration for bare-metal, cloud, and local environments.',
    icon: Wrench,
  },
  {
    title: 'Policy Deep Dives',
    description:
      'Master network, filesystem, and custom policies with real YAML examples and Landlock internals.',
    icon: Shield,
  },
  {
    title: 'Real-World Use Cases',
    description:
      'Build Telegram bots, CI/CD agents, multi-agent systems, and enterprise-grade deployments.',
    icon: Briefcase,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function HomePage() {
  const firstSubject = curriculum[0]

  return (
    <div className="min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* Hero */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#76B900] via-[#5a9200] to-[#3d6300] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHptMC0xMGg0djRoLTR6bTEwIDEwaDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
          >
            Learn NemoClaw
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/90 font-medium mb-3 max-w-2xl mx-auto"
          >
            Master AI agent security from the ground up
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            A progressive, interactive learning platform for NVIDIA NemoClaw
            &mdash; the open-source reference stack for running AI agents
            safely.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {firstSubject && (
              <Link
                to={`/subjects/${firstSubject.id}`}
                className="inline-flex items-center gap-2 bg-white text-[#3d6300] font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
              >
                Get Started
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Stats */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm"
            >
              <stat.icon
                size={20}
                className="mx-auto mb-2 text-[#76B900]"
              />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Subject Cards */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Curriculum
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Eight subjects covering every layer of the NemoClaw stack.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {curriculum.map((subject) => (
            <motion.div key={subject.id} variants={itemVariants}>
              <SubjectCard subject={subject} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Why Learn NemoClaw?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 text-center">
            Built for practitioners who want to deploy AI agents with
            confidence.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
              >
                <feature.icon
                  size={24}
                  className="text-[#76B900] mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
