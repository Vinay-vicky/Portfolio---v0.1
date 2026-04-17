import { Link } from 'react-router-dom'
import { Mail, Phone, Sparkles } from 'lucide-react'
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/projects', label: 'Projects' },
  { to: '/innovation-lab', label: 'Innovation Lab' },
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

const footerSignals = ['React 19', 'Tailwind UI', 'Motion design', 'API integrations']

function Footer() {
  return (
    <footer className="mt-10 px-3 pb-4 sm:px-4">
      <div className="site-footer-shell mx-auto w-full max-w-7xl overflow-hidden rounded-[2.25rem] border border-slate-800/90 bg-slate-950 text-slate-100 shadow-[0_24px_65px_rgba(2,6,23,0.45)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles size={12} />
              Portfolio / Product Studio
            </span>

            <h3 className="max-w-xl text-2xl font-black leading-tight text-white sm:text-3xl">
              Designing and building modern web experiences.
            </h3>

            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Frontend-first interfaces backed by scalable APIs, clean architecture, and polished user journeys.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {footerSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Quick links</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {quickLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-white"
                      to={item.to}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Connect</p>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-200"
                  >
                    <Icon size={13} />
                    {label}
                  </a>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <Link
                  className="inline-flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-200"
                  to="/contact"
                >
                  <Mail size={14} className="text-cyan-300" />
                  Message via Contact Form
                </Link>
                <a
                  className="inline-flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-200"
                  href="tel:+919361477185"
                >
                  <Phone size={14} className="text-cyan-300" />
                  +91 93614 77185
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>© {new Date().getFullYear()} Vignesh R V. All rights reserved.</p>
            <p>Built with modern UI, fast motion, and recruiter-friendly storytelling.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer