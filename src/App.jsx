import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import useTheme from './hooks/useTheme'

const HomePage = lazy(() => import('./pages/HomePage'))
const SubjectPage = lazy(() => import('./pages/SubjectPage'))
const ChapterPage = lazy(() => import('./pages/ChapterPage'))
const SectionPage = lazy(() => import('./pages/SectionPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#76B900]/30 border-t-[#76B900] rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  useTheme()

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <Navbar />
        <Sidebar />

        <main className="flex-1 lg:ml-[280px] pt-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/subjects/:subjectId" element={<SubjectPage />} />
                <Route path="/subjects/:subjectId/:chapterId" element={<ChapterPage />} />
                <Route path="/subjects/:subjectId/:chapterId/:sectionId" element={<SectionPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </main>
      </div>
    </HashRouter>
  )
}
