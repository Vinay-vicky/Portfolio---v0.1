import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

const socialLinks = [
  {
    href: 'https://github.com/Vinay-vicky',
    label: 'GitHub',
    icon: FaGithub,
  },
  {
    href: 'https://www.facebook.com/vignesh.velan.52?mibextid=ZbWKwL',
    label: 'Facebook',
    icon: FaFacebook,
  },
  {
    href: 'https://instagram.com/vinay_vicky.2000',
    label: 'Instagram',
    icon: FaInstagram,
  },
]

function Footer() {
  return (
    <footer className="mt-10 px-3 pb-4 sm:px-4">
      <div className="site-footer-shell mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950 text-slate-100 shadow-[0_24px_65px_rgba(2,6,23,0.45)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.7fr_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Vignesh R V</p>
            <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">Designing and building modern web experiences.</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Frontend-first interfaces backed by scalable APIs, clean architecture, and polished user journeys.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Quick links</p>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link className="text-sm font-semibold text-slate-300 transition hover:text-white" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Connect</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-200"
                >
                  <Icon size={13} />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <Link className="inline-flex items-center gap-2 transition hover:text-cyan-200" to="/contact">
                <Mail size={14} className="text-cyan-300" />
                Message via Contact Form
              </Link>
              <a className="inline-flex items-center gap-2 transition hover:text-cyan-200" href="tel:+919361477185">
                <Phone size={14} className="text-cyan-300" />
                +91 93614 77185
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/90 px-6 py-4 text-center text-xs text-slate-400 sm:px-8 sm:text-sm">
          © {new Date().getFullYear()} Vignesh R V. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
