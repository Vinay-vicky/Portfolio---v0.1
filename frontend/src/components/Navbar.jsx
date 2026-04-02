import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight, FolderGit2, Home, Mail, Menu, UserRound, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/resume', label: 'Resume', icon: UserRound },
  { to: '/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/contact', label: 'Contact', icon: Mail },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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

  const desktopLinkClasses = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
    }`

  const mobileLinkClasses = ({ isActive }) =>
    `group flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
      isActive
        ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
        : 'border-slate-200/80 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/85 shadow-sm shadow-slate-200/60 backdrop-blur-lg">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="group truncate text-xs font-black tracking-[0.16em] text-blue-700 sm:text-sm md:text-base"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_5px_rgba(59,130,246,0.15)] transition group-hover:scale-110" />
              VIGNESH R V
            </span>
          </NavLink>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700 shadow-sm shadow-blue-100 transition hover:bg-blue-50 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <ul className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 p-1 md:flex md:gap-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={desktopLinkClasses}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close mobile navigation overlay"
              className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[2px] md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <div className="fixed inset-x-0 top-[62px] z-40 px-4 sm:px-6 md:hidden">
              <div
                id="mobile-nav"
                className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-[0_20px_55px_rgba(15,23,42,0.2)] backdrop-blur"
              >
                <div className="mb-3 rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700">Menu</p>
                  <p className="mt-0.5 text-xs text-slate-600">Explore sections with a cleaner mobile navigation.</p>
                </div>

                <ul className="grid max-h-[70vh] gap-2 overflow-auto">
                  {links.map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          className={mobileLinkClasses}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition group-hover:border-blue-200 group-hover:text-blue-700">
                              <Icon size={15} />
                            </span>
                            {link.label}
                          </span>
                          <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
