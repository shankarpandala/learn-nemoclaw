import { Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Built for learning NemoClaw — NVIDIA's AI agent security stack
        </p>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <a
            href="https://github.com/NVIDIA/NemoClaw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Github size={14} />
            GitHub
          </a>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <a
            href="https://docs.nvidia.com/nemoclaw/latest/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ExternalLink size={12} />
            NemoClaw Docs
          </a>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <a
            href="https://docs.openclaw.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ExternalLink size={12} />
            OpenClaw Docs
          </a>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center mt-4">
          &copy; {new Date().getFullYear()} Learn NemoClaw. Not affiliated with NVIDIA.
        </p>
      </div>
    </footer>
  )
}
