import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BrainCircuit, ChevronRight, FolderGit2, Home, Mail, Menu, MoonStar, Sparkles, SunMedium, UserRound, X } from 'lucide-react'
import { useTheme } from '../app/themeContext'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/resume', label: 'Resume', icon: UserRound },
  { to: '/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/innovation-lab', label: 'Innovation', icon: BrainCircuit },
  { to: '/contact', label: 'Contact', icon: Mail },
]

function Navbar({ onPrefetchRoute }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const handlePrefetch = (path) => {
    if (typeof onPrefetchRoute === 'function') {
      onPrefetchRoute(path)
    }
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  const desktopLinkClasses = (isActive) =>
    `group inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
      isActive
        ? 'bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 text-blue-700 shadow-[0_8px_22px_rgba(59,130,246,0.12)]'
        : 'text-slate-600 hover:bg-white/90 hover:text-blue-700'
    }`

  const mobileLinkClasses = (isActive) =>
    `group flex items-center justify-between rounded-2xl border px-3.5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
      isActive
        ? 'border-blue-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 text-blue-700 shadow-[0_8px_22px_rgba(59,130,246,0.12)]'
        : 'border-slate-200/90 bg-white/95 text-slate-700 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700'
    }`

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav className="site-nav mx-auto w-full max-w-7xl rounded-[1.75rem] border border-slate-200/85 bg-white/80 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            onMouseEnter={() => handlePrefetch('/')}
            onFocus={() => handlePrefetch('/')}
            onTouchStart={() => handlePrefetch('/')}
            className="group flex min-w-0 items-center gap-3"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-violet-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition group-hover:-translate-y-0.5">
              <Sparkles size={15} />
            </span>

            <span className="min-w-0">
              <span className="block text-xs font-black tracking-[0.18em] text-blue-700 sm:text-sm">VIGNESH R V</span>
              <p className="mt-0.5 hidden text-[11px] font-semibold text-slate-500 sm:block">Digital Product Developer</p>
            </span>
          </NavLink>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunMedium size={13} className="text-amber-500" /> : <MoonStar size={13} className="text-blue-600" />}
              {isDark ? 'Light' : 'Dark'}
            </button>

            <ul className="flex items-center gap-1 rounded-full border border-slate-200/85 bg-white/85 p-1.5 shadow-sm">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full"
                      onMouseEnter={() => handlePrefetch(link.to)}
                      onFocus={() => handlePrefetch(link.to)}
                      onTouchStart={() => handlePrefetch(link.to)}
                    >
                      {({ isActive }) => (
                        <span className={desktopLinkClasses(isActive)}>
                          <Icon size={14} className={isActive ? 'text-blue-700' : 'text-slate-500 transition group-hover:text-blue-700'} />
                          {link.label}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>

            <NavLink
              to="/contact"
              onMouseEnter={() => handlePrefetch('/contact')}
              onFocus={() => handlePrefetch('/contact')}
              onTouchStart={() => handlePrefetch('/contact')}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
            >
              <Sparkles size={13} />
              Let&apos;s Talk
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200/80 bg-white/90 text-blue-700 shadow-sm shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-50 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close mobile navigation overlay"
              className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[2px] md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <div className="fixed inset-x-0 top-[78px] z-40 px-3 sm:px-4 md:hidden">
              <div
                id="mobile-nav"
                className="mx-auto w-full max-w-7xl rounded-[1.75rem] border border-slate-200/90 bg-white/96 p-4 shadow-[0_22px_55px_rgba(15,23,42,0.22)] backdrop-blur-xl"
              >
                <div className="mb-3 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 px-3 py-2.5 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700">Quick navigation</p>
                  <p className="mt-0.5 text-xs text-slate-600">Explore every page with a cleaner premium mobile layout.</p>
                </div>

                <ul className="grid max-h-[70vh] gap-2 overflow-auto">
                  {links.map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) => mobileLinkClasses(isActive)}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={() => handlePrefetch(link.to)}
                          onFocus={() => handlePrefetch(link.to)}
                          onTouchStart={() => handlePrefetch(link.to)}
                        >
                          {({ isActive }) => (
                            <>
                              <span className="inline-flex items-center gap-2.5">
                                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                  isActive
                                    ? 'border-blue-200 bg-white text-blue-700'
                                    : 'border-slate-200 bg-white text-slate-600 group-hover:border-blue-200 group-hover:text-blue-700'
                                }`}>
                                  <Icon size={15} />
                                </span>
                                {link.label}
                              </span>
                              <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                            </>
                          )}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>

                <NavLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => handlePrefetch('/contact')}
                  onFocus={() => handlePrefetch('/contact')}
                  onTouchStart={() => handlePrefetch('/contact')}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
                >
                  <Sparkles size={15} />
                  Start a Project
                </NavLink>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  {isDark ? <SunMedium size={15} className="text-amber-500" /> : <MoonStar size={15} className="text-blue-600" />}
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
