import { NavLink } from 'react-router-dom'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Menu, X } from 'lucide-react'
import { cn } from '../utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const container = useRef()
  const [isOpen, setIsOpen] = useState(false)

  useGSAP(() => {
    gsap.from(container.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    
    gsap.from(".nav-item", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.3
    })
  }, { scope: container })

  return (
    <header ref={container} className="glass-nav sticky top-0 z-50">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-gradient hover:opacity-80 transition-opacity text-xl font-black tracking-widest uppercase">
          VIGNESH R V
        </NavLink>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex flex-wrap items-center gap-2 sm:gap-4">
          {links.map((link) => (
            <li key={link.to} className="nav-item">
              <NavLink
                to={link.to}
                className={({ isActive }) => cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Links */}
      {isOpen && (
        <div className="glass-nav absolute left-0 top-full w-full border-b border-t shadow-2xl md:hidden">
          <ul className="flex flex-col px-4 py-4 space-y-2">
             {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
                    isActive 
                      ? "bg-indigo-500/20 text-indigo-300" 
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
