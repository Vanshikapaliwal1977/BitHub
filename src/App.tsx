import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { projects as allProjects } from './data/content'
import { useUser } from './contexts/UserContext'
import { useContent } from './contexts/ContentContext'
import LoginPage from './components/LoginPage'
import ProjectsPage from './components/ProjectsPage'
import BlogsPage from './components/BlogsPage'
import WriteBlogPage from './components/WriteBlogPage'
import UserProfilePage from './components/UserProfilePage'
import FeedbackPage from './components/FeedbackPage'
import ChatPage from './components/ChatPage'
import AddProjectForm from './components/AddProjectForm'
import RegisterPage from './components/RegisterPage'
import BlogDetailPage from './components/BlogDetailPage'
import OpportunitiesPage from './components/OpportunitiesPage'

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -6, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
      exit={{ opacity: 0, rotate: 6, scale: 0.98, y: -20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const { currentUser, logout } = useUser()
  const [showTop, setShowTop] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutStep, setLogoutStep] = useState<1 | 2>(1)
  const [moreOpen, setMoreOpen] = useState(false)

  const [glass, setGlass] = useState(false)
  const [curtainVisible, setCurtainVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress: pageScroll } = useScroll()
  const cardScale = useTransform(pageScroll, [0, 1], [1, 0.985])
  const cardRadius = useTransform(pageScroll, [0, 1], [0, 18])
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    const onScroll = () => {
      setShowTop(window.scrollY > 600)
      setGlass(window.scrollY > 16)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const t = setTimeout(() => setCurtainVisible(false), 800)
    return () => clearTimeout(t)
  }, [])

  const location = useLocation()
  return (
    <div>
      <div className="fx-ambient" aria-hidden>
        <div className="blob purple" />
        <div className="blob teal" />
      </div>
      <div className="fx-noise" aria-hidden />
      {curtainVisible && <div className="fx-curtain fx-curtain--animate" aria-hidden />}
      <motion.div style={{ scaleX: pageScroll }} className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-teal-400 origin-left z-[60]" />
      <motion.div style={{ scale: cardScale, borderRadius: cardRadius }} className="relative z-[1] transition-[border-radius] duration-300">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors ${glass ? 'backdrop-blur bg-zinc-900/60 border-b border-zinc-800' : 'bg-transparent'}`}>
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 hover-float anim-fade-in" aria-label="Home">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="1" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <path d="M14 16 L34 16 L24 34 Z" stroke="url(#g1)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="16" r="3.5" fill="url(#g1)" />
              <circle cx="34" cy="16" r="3.5" fill="url(#g1)" />
              <circle cx="24" cy="34" r="3.5" fill="url(#g1)" />
            </svg>
            <span className="font-display text-xl font-semibold bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent">BitHub</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-200 flex-1 justify-center">
            <Link to="/" className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition ui-underline">Home</Link>
            <Link to="/write-blog" className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition ui-underline">Blog</Link>
            <Link to="/add-project" className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition ui-underline">Add Your Project</Link>

            <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
              <button
                onClick={() => setMoreOpen(v=>!v)}
                className="hover:text-white inline-flex items-center gap-1 px-4 py-3 rounded-md ui-underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                More <span>▾</span>
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-zinc-700 bg-zinc-900 shadow-lg py-1 text-zinc-200 anim-scale-in">
                  <Link onClick={()=>setMoreOpen(false)} to="/projects" className="block px-3 py-2 rounded-sm hover:bg-zinc-800 transition">Community</Link>
                  <Link onClick={()=>setMoreOpen(false)} to="/feedback" className="block px-3 py-2 rounded-sm hover:bg-zinc-800 transition">Feedback</Link>
                  <Link onClick={()=>setMoreOpen(false)} to="/chat" className="block px-3 py-2 rounded-sm hover:bg-zinc-800 transition">Discuss</Link>
                  <Link onClick={()=>setMoreOpen(false)} to="/opportunities" className="block px-3 py-2 rounded-sm hover:bg-zinc-800 transition">Opportunities</Link>
                </div>
              )}
            </div>
          </nav>

          {/* User and Social Section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User Greeting with Avatar */}
                <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-purple-500/15 to-teal-500/15 rounded-full px-4 py-2.5 border border-white/25 backdrop-blur-md shadow-lg">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full border-2 border-white/40 shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-medium leading-tight">Welcome back</span>
                    <span className="text-white/90 text-sm font-semibold">{currentUser.username}</span>
                  </div>
                </div>
                {/* User Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/10"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { setShowLogoutModal(true); setLogoutStep(1) }}
                    className="text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/10"
              >
                Login
              </Link>
            )}
            {/* Social Links */}
            <div className="hidden sm:flex items-center gap-3">
              <a aria-label="GitHub" className="text-white hover:opacity-80 hover-spin-once transition-all p-2 rounded-lg hover:bg-white/10" href="https://github.com/Vanshikapaliwal1977" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.19-3.37-1.19-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .85-.27 2.79 1.02A9.7 9.7 0 0 1 12 6.8c.86 0 1.72.12 2.53.35 1.93-1.29 2.78-1.02 2.78-1.02.56 1.38.21 2.4.1 2.65.64.7 1.03 1.58 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
              </a>
              <a aria-label="LinkedIn" className="text-[#0A66C2] hover:opacity-80 hover-spin-once transition-all p-2 rounded-lg hover:bg-white/10" href="https://www.linkedin.com/in/vanshikapaliwal" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.57 0-2.96 2-2.96 4.06V24h-3.88V8z"/></svg>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 p-2 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Toggle mobile menu"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm anim-fade-in" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover-float">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                    <defs>
                      <linearGradient id="g1-mobile" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#a855f7" />
                        <stop offset="1" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
              <path d="M14 16 L34 16 L24 34 Z" stroke="url(#g1-mobile)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="14" cy="16" r="3.5" fill="url(#g1-mobile)" />
                    <circle cx="34" cy="16" r="3.5" fill="url(#g1-mobile)" />
                    <circle cx="24" cy="34" r="3.5" fill="url(#g1-mobile)" />
                  </svg>
                  <span className="font-display text-xl font-semibold bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent">BitHub</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 p-2"
                  aria-label="Close mobile menu"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="pt-20 px-4 pb-4 space-y-4">
              <nav className="flex flex-col space-y-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Home</Link>
                <a href="#work" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Projects</a>
                <Link to="/write-blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Blog</Link>
                <Link to="/add-project" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Add Your Project</Link>
                <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Community</Link>
                <Link to="/feedback" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Feedback</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Discuss</Link>
                <Link to="/opportunities" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Opportunities</Link>
              </nav>
              <div className="border-t border-zinc-700 pt-4 space-y-4">
                {currentUser ? (
                  <div className="space-y-2">
                    <span className="text-white/90 block">Hi, {currentUser.username}</span>
                    <Link to={`/profile/${currentUser.id}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Profile</Link>
                    <button
                      onClick={() => { setShowLogoutModal(true); setLogoutStep(1); setMobileMenuOpen(false) }}
                      className="w-full text-left px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 transition">Login</Link>
                )}
                <div className="flex items-center gap-3">
                  <a aria-label="GitHub" className="text-white hover:opacity-80 hover-spin-once" href="https://github.com/Vanshikapaliwal1977" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.19-3.37-1.19-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .85-.27 2.79 1.02A9.7 9.7 0 0 1 12 6.8c.86 0 1.72.12 2.53.35 1.93-1.29 2.78-1.02 2.78-1.02.56 1.38.21 2.4.1 2.65.64.7 1.03 1.58 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
                  </a>
                  <a aria-label="LinkedIn" className="text-[#0A66C2] hover:opacity-80 hover-spin-once" href="https://www.linkedin.com/in/vanshikapaliwal" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.57 0-2.96 2-2.96 4.06V24h-3.88V8z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>



      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="font-display text-xl text-white mb-2">{logoutStep === 1 ? 'Confirm Logout' : 'Please Confirm Again'}</h3>
            <p className="text-zinc-300 mb-6">
              {logoutStep === 1
                ? 'Are you sure you want to logout?'
                : 'This is a second confirmation to logout from your account.'}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowLogoutModal(false); setLogoutStep(1) }}
                className="px-4 py-2 rounded border border-zinc-700 text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"
              >
                Cancel
              </button>
              {logoutStep === 1 ? (
                <button
                  onClick={() => setLogoutStep(2)}
                  className="px-4 py-2 rounded bg-white text-black font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"
                >
                  Yes, Logout
                </button>
              ) : (
                <button
                  onClick={() => { logout(); setShowLogoutModal(false); setLogoutStep(1) }}
                  className="px-4 py-2 rounded bg-white text-black font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"
                >
                  Confirm Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="/add-project" element={<PageTransition><AddProjectPage /></PageTransition>} />
            <Route path="/blogs" element={<PageTransition><BlogsPage /></PageTransition>} />
            <Route path="/blog/:blogId" element={<PageTransition><BlogDetailPage /></PageTransition>} />
            <Route path="/write-blog" element={<PageTransition><WriteBlogPage /></PageTransition>} />
            <Route path="/profile/:userId" element={<PageTransition><UserProfilePage /></PageTransition>} />
            <Route path="/feedback" element={<PageTransition><FeedbackPage /></PageTransition>} />
            <Route path="/chat" element={<PageTransition><ChatPage /></PageTransition>} />
            <Route path="/opportunities" element={<PageTransition><OpportunitiesPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-400"> {new Date().getFullYear()} BitHub</footer>

      {showTop && (
        <button
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-zinc-900 text-white shadow-lg hover:opacity-90 animate-pulse-slow hover-spin-once transition-transform hover:scale-105"
        >
          ↑
        </button>
      )}
      </motion.div>
    </div>
  )
}

// Project filter components
type Filter = 'All' | 'Angular' | 'Spring Boot' | 'Full‑stack'

// Simple context to share filter between components
const FilterCtx = createContext<ReturnType<typeof useProjectFilter> | null>(null)

function useProjectFilter() {
  const [filter, setFilter] = useState<Filter>('All')
  const [items, setItems] = useState(allProjects)
  const filtered = useMemo(() => {
    if (filter === 'All') return items
    return items.filter(p => p.tags.includes(filter))
  }, [filter, items])
  const addProject = (p: { title: string; blurb: string; link?: string; tags: string[]; image?: string; isPublic?: boolean }) => {
    setItems(prev => [{ title: p.title, blurb: p.blurb, link: p.link, tags: p.tags, image: p.image, isPublic: p.isPublic ?? true }, ...prev])
  }
  return { filter, setFilter, filtered, addProject }
}

function useProjectFilterContext() {
  const ctx = useContext(FilterCtx)
  if (!ctx) throw new Error('useProjectFilterContext must be used within ProjectProvider')
  return ctx
}

function ProjectProvider({ children }: { children: React.ReactNode }) {
  const value = useProjectFilter()
  return <FilterCtx.Provider value={value}>{children}</FilterCtx.Provider>
}

function ProjectFilters() {
  const { filter, setFilter } = useProjectFilterContext()
  const chips: Filter[] = ['All', 'Angular', 'Spring Boot', 'Full‑stack']
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <motion.button
          key={c}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setFilter(c)}
          className={
            'px-3 py-1 rounded-full border text-sm transition ' +
            (filter === c
              ? 'bg-accent.purple text-white border-transparent'
              : 'bg-white/5 border-white/15 hover:border-white/30')
          }
        >
          {c}
        </motion.button>
      ))}
    </div>
  )
}

function ProjectGrid() {
  const { filtered } = useProjectFilterContext()
  return (
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="bg-white/5 border border-white/10 rounded overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
        >
          {p.image ? (
            <img src={p.image} alt={p.title} className="w-full aspect-video object-contain" />
          ) : (
            <div className="aspect-video bg-black/30" />
          )}
          <div className="p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-foreground/70">{p.blurb}</div>
            {p.link && (
              <a className="mt-2 inline-block text-accent.teal hover:underline" href={p.link} target="_blank" rel="noreferrer">View Project</a>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/15 transition-transform hover:scale-105">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Routed pages
function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <>
      <section id="home" className="relative min-h-[70vh] flex items-center anim-slide-up overflow-hidden">
        {/* Parallax gradient blobs */}
        <motion.div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-30 bg-purple-500/40" style={{ y: y1 }} />
        <motion.div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-teal-400/40" style={{ y: y2 }} />
        <div ref={heroRef} className="container relative">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-[0.95]"
            >
              Welcome to
              <br />
              BitHub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 text-lg text-zinc-300"
            >A vibrant community platform where developers, designers, and creators share projects, write blogs, and exchange ideas. Connect with like-minded individuals, showcase your work, and inspire collaboration in the tech community.            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex gap-4"
            >
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                 Join the Community
              </Link>
              <Link
                to="/opportunities"
                className="px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                 Explore Opportunities
              </Link>
            </motion.div>
          </div>
        </div>
      </section>









      

      <section id="platform-features" className="py-24 border-t border-white/10 anim-slide-up">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl md:text-5xl mb-10 text-center"
          >
            Why Choose BitHub?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm"
            >
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-3">Code Together</h3>
              <p className="text-zinc-300">Collaborate on open-source projects, share code snippets, and learn from fellow developers in real-time.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm"
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Create & Innovate</h3>
              <p className="text-zinc-300">Build amazing applications, share your creations, and get inspired by innovative projects from our community.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Connect & Network</h3>
              <p className="text-zinc-300">Network with like-minded developers, find collaborators, and build lasting professional relationships.</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-300 mb-6">Have questions about the platform or want to contribute? Reach out to us!</p>
            <div className="flex justify-center gap-6">
              <a href="mailto:support@devconnect.com" className="text-accent.teal hover:underline">support@devconnect.com</a>
              <a href="https://github.com/Vanshikapaliwal1977" target="_blank" rel="noreferrer" className="text-accent.teal hover:underline">GitHub</a>
              <a href="https://www.linkedin.com/in/vanshikapaliwal" target="_blank" rel="noreferrer" className="text-accent.teal hover:underline">LinkedIn</a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function AddProjectPage() {
  return (
    <section className="py-24">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl mb-6">Add Your Project</h1>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <AddProjectForm />
        </div>
      </div>
    </section>
  )
}


export default App
