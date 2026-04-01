import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, MessageCircle } from 'lucide-react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'

const socialConfig = [
  {
    key: 'whatsapp_url',
    label: 'WhatsApp',
    icon: MessageCircle,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  },
  {
    key: 'linkedin_url',
    label: 'LinkedIn',
    icon: FaLinkedin,
    className: 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100',
  },
  {
    key: 'github_url',
    label: 'GitHub',
    icon: FaGithub,
    className: 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200',
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    icon: FaInstagram,
    className: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100',
  },
  {
    key: 'facebook_url',
    label: 'Facebook',
    icon: FaFacebook,
    className: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
  },
]

function HomePageResponsive() {
  const { profile, loading, error } = usePortfolioData()

  if (loading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error && !profile) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section className="space-y-10 pb-6 sm:space-y-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
            {profile?.role || 'Full Stack Developer'}
          </p>
          <p className="mt-4 border-l-4 border-blue-400 pl-4 text-base italic text-slate-600 sm:text-lg">&quot;{profile?.quote}&quot;</p>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            <span className="mb-2 block text-slate-900">Hi, I&apos;m {profile?.full_name}</span>
            <span className="text-gradient">{profile?.tagline || 'Crafting Innovative Digital Experiences'}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{profile?.bio}</p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link to="/resume" className="btn-primary w-full gap-2 sm:w-auto">
              Resume
              <ArrowRight size={16} />
            </Link>

            {profile?.resume_pdf_url ? (
              <a
                href={getAssetUrl(profile.resume_pdf_url)}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full gap-2 sm:w-auto"
              >
                <Download size={16} />
                Download CV
              </a>
            ) : null}
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-md lg:order-2">
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-3 shadow-xl shadow-blue-100/80 sm:p-4">
            <div className="pointer-events-none absolute inset-x-3 top-0 h-24 rounded-b-full bg-gradient-to-r from-blue-200/40 to-cyan-200/40 blur-2xl" />
            {profile?.profile_image_url ? (
              <img
                src={getAssetUrl(profile.profile_image_url)}
                alt={profile.full_name}
                className="relative z-10 h-auto w-full rounded-2xl object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>

      <article className="glass-card">
        <h2 className="text-gradient text-2xl font-black sm:text-3xl">{profile?.about_intro || 'About Me'}</h2>
        <div className="mt-4 space-y-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
          {profile?.about_text}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
            <p className="mt-1 font-semibold text-slate-800">{profile?.full_name}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
            <p className="mt-1 truncate font-semibold text-slate-800" title={profile?.email}>{profile?.email}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Phone</p>
            <p className="mt-1 font-semibold text-slate-800">{profile?.phone}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
            <p className="mt-1 font-semibold text-slate-800">{profile?.location}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
          {socialConfig.map(({ key, label, icon: Icon, className }) => {
            const url = profile?.[key]
            if (!url) return null

            return (
              <a
                key={key}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${className}`}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={14} />
                {label}
              </a>
            )
          })}
        </div>
      </article>
    </section>
  )
}

export default HomePageResponsive
