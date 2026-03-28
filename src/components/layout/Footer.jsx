import { Link } from 'react-router-dom'
import { Shield, Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#76B900] flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Learn NemoClaw
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              An interactive learning platform for NVIDIA NemoClaw — the open-source
              reference stack for running AI agents safely.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/shankarpandala/learn-nemoclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  <Github size={14} /> GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="https://docs.nvidia.com/nemoclaw/latest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  <ExternalLink size={14} /> NemoClaw Docs
                </a>
              </li>
              <li>
                <a
                  href="https://docs.openclaw.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  <ExternalLink size={14} /> OpenClaw Docs
                </a>
              </li>
              <li>
                <Link
                  to="/progress"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  <ExternalLink size={14} /> My Progress
                </Link>
              </li>
            </ul>
          </div>

          {/* Built with */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Built with
            </h4>
            <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <li>React 19</li>
              <li>Tailwind CSS 4</li>
              <li>Framer Motion</li>
              <li>Vite</li>
              <li>Zustand</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            &copy; {year}{' '}
            <a
              href="https://www.pandala.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            >
              pandala.in
            </a>
            . Not affiliated with NVIDIA.
          </p>
        </div>
      </div>
    </footer>
  )
}
