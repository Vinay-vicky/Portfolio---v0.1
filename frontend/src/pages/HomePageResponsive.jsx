import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Code2, Download, FolderKanban, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import usePageReveal from '../hooks/usePageReveal'

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
  const { profile, projects, skills, experiences, loading, error } = usePortfolioData()
  const sectionRef = usePageReveal()

  const quickStats = [
    {
      label: 'Projects',
      value: projects.length,
      icon: FolderKanban,
      tone: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      label: 'Experience roles',
      value: experiences.length,
      icon: Briefcase,
      tone: 'text-violet-700 bg-violet-50 border-violet-200',
    },
    {
      label: 'Skills',
      value: skills.length,
      icon: Code2,
      tone: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
  ]

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
    <section ref={sectionRef} className="space-y-8 pb-6 sm:space-y-10">
      <div className="section-shell" data-animate-intro>
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700" data-animate-intro>
              <Sparkles size={12} />
              {profile?.role || 'Full Stack Developer'}
            </p>

            {profile?.quote ? (
              <p className="mt-4 border-l-4 border-blue-400 pl-4 text-base italic text-slate-600 sm:text-lg" data-animate-intro>
                &quot;{profile.quote}&quot;
              </p>
            ) : null}

            <h1 className="type-display mt-5" data-animate-intro>
              <span className="mb-2 block text-slate-900">Hi, I&apos;m {profile?.full_name}</span>
              <span className="text-gradient">{profile?.tagline || 'Crafting Innovative Digital Experiences'}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg" data-animate-intro>
              {profile?.bio}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-animate-intro>
              <Link to="/resume" className="btn-primary w-full gap-2 sm:w-auto">
                Explore Resume
                <ArrowRight size={16} />
              </Link>

              <Link to="/projects" className="btn-secondary w-full gap-2 sm:w-auto">
                View Projects
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

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {quickStats.map(({ label, value, icon: Icon, tone }) => (
                <article key={label} className={`stat-tile border ${tone}`} data-animate-reveal>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{label}</p>
                    <Icon size={15} />
                  </div>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-lg" data-animate-intro>
            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white p-3 shadow-[0_24px_60px_rgba(37,99,235,0.18)] sm:p-4" data-animate-float>
              <div className="pointer-events-none absolute inset-x-4 top-0 h-28 rounded-b-full bg-gradient-to-r from-blue-200/45 to-cyan-200/45 blur-2xl" />

              {profile?.profile_image_url ? (
                <img
                  src={getAssetUrl(profile.profile_image_url)}
                  alt={profile.full_name}
                  className="relative z-10 h-auto w-full rounded-[1.5rem] object-cover"
                />
              ) : (
                <div className="relative z-10 flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-100 via-cyan-100 to-violet-100 text-sm font-semibold text-slate-600">
                  Profile image preview
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-lg backdrop-blur">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Based in</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <MapPin size={14} className="text-blue-600" />
                  {profile?.location || 'Remote / Hybrid'}
                </p>
                <p className="mt-1 text-xs text-slate-500">Building polished web experiences with performance-focused code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="section-shell" data-animate-reveal>
          <p className="section-eyebrow border-slate-200 bg-slate-50 text-slate-600">Personal profile</p>
          <h2 className="mt-3 text-gradient text-2xl font-black sm:text-3xl">{profile?.about_intro || 'About Me'}</h2>

          <div className="mt-4 space-y-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
            {profile?.about_text}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" data-animate-reveal>
              <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
              <p className="mt-1 font-semibold text-slate-800">{profile?.full_name}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" data-animate-reveal>
              <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
              <p className="mt-1 truncate font-semibold text-slate-800" title={profile?.email}>{profile?.email}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" data-animate-reveal>
              <p className="text-xs uppercase tracking-wider text-slate-500">Phone</p>
              <p className="mt-1 font-semibold text-slate-800">{profile?.phone}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" data-animate-reveal>
              <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-slate-800">{profile?.location}</p>
            </div>
          </div>

          <div className="mt-5 soft-divider" />

          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
            {socialConfig.map(({ key, label, icon: Icon, className }) => {
              const url = profile?.[key]
              if (!url) return null

              return (
                <a
                  key={key}
                  data-animate-reveal
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

        <article className="section-shell-muted" data-animate-reveal>
          <p className="section-eyebrow border-cyan-200 bg-cyan-50 text-cyan-700">Let&apos;s collaborate</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Need a modern web product?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            I design and build fast, responsive interfaces with scalable backend integrations. If you&apos;re planning a new product or refresh, let&apos;s talk.
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700">1</span>
              Discovery call and requirements mapping
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700">2</span>
              UI/UX prototype with modern component patterns
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700">3</span>
              Production-ready frontend + backend delivery
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full gap-2 sm:w-auto">
              <MessageCircle size={16} />
              Start Conversation
            </Link>
            <Link to="/projects" className="btn-secondary w-full sm:w-auto">View Case Studies</Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default HomePageResponsive
