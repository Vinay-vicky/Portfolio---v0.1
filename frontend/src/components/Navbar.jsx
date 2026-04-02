import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
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

  const linkClasses = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/85 shadow-sm shadow-slate-200/60 backdrop-blur-lg">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="truncate text-sm font-black tracking-[0.14em] text-blue-700 sm:text-base"
          >
            VIGNESH R V
          </NavLink>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-700 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <ul className="hidden items-center gap-2 md:flex md:gap-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClasses}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {menuOpen ? (
          <ul id="mobile-nav" className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg md:hidden">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={linkClasses}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
