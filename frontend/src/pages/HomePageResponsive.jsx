import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl, getResumeJsonUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Briefcase,
  Code2,
  Download,
  FolderKanban,
  Layers3,
  MapPin,
  MessageCircle,
  Sparkles,
  Zap,
} from 'lucide-react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import usePageReveal from '../hooks/usePageReveal'

const socialConfig = [
  {
    key: 'whatsapp_url',
    label: 'WhatsApp',
    icon: MessageCircle,
    className: 'border-emerald-200/70 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100',
  },
  {
    key: 'linkedin_url',
    label: 'LinkedIn',
    icon: FaLinkedin,
    className: 'border-sky-200/70 bg-sky-50/80 text-sky-700 hover:bg-sky-100',
  },
  {
    key: 'github_url',
    label: 'GitHub',
    icon: FaGithub,
    className: 'border-slate-200/80 bg-white/85 text-slate-700 hover:bg-slate-100',
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    icon: FaInstagram,
    className: 'border-fuchsia-200/70 bg-fuchsia-50/80 text-fuchsia-700 hover:bg-fuchsia-100',
  },
  {
    key: 'facebook_url',
    label: 'Facebook',
    icon: FaFacebook,
    className: 'border-blue-200/70 bg-blue-50/80 text-blue-700 hover:bg-blue-100',
  },
]

const featurePills = [
  { label: 'Motion-aware UI', icon: Sparkles },
  { label: 'Fast React builds', icon: Zap },
  { label: 'Accessible patterns', icon: BadgeCheck },
]

function HomePageResponsive() {
  const { profile, projects, skills, experiences, loading, error } = usePortfolioData()
  const sectionRef = usePageReveal()
  const resumeJsonUrl = getResumeJsonUrl()

  const heroMetrics = [
    {
      label: 'Projects shipped',
      value: projects.length,
      note: 'Live demos and production-ready builds',
      icon: FolderKanban,
      accent: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    {
      label: 'Experience roles',
      value: experiences.length,
      note: 'Product, frontend, and full-stack delivery',
      icon: Briefcase,
      accent: 'border-violet-200 bg-violet-50 text-violet-700',
    },
    {
      label: 'Skill groups',
      value: skills.length,
      note: 'Modern stack coverage and tooling',
      icon: Code2,
      accent: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    },
  ]

  const profileDetails = [
    {
      label: 'Role',
      value: profile?.role || 'Full Stack Developer',
    },
    {
      label: 'Email',
      value: profile?.email || 'Not shared',
      href: profile?.email ? `mailto:${profile.email}` : null,
    },
    {
      label: 'Phone',
      value: profile?.phone || 'Not shared',
      href: profile?.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : null,
    },
    {
      label: 'Location',
      value: profile?.location || 'Remote / Hybrid',
    },
  ]

  const collaborationSteps = [
    {
      title: 'Discovery and alignment',
      description: 'We map goals, scope, and audience expectations before a single pixel ships.',
    },
    {
      title: 'Design system and build',
      description: 'I turn the idea into reusable components, responsive layouts, and polished interactions.',
    },
    {
      title: 'Ship and refine',
      description: 'We tighten copy, responsiveness, and performance so the result feels effortless.',
    },
  ]

  const openInnovationLab = (
    <Link to="/innovation-lab" className="btn-secondary w-full gap-2 sm:w-auto">
      <BrainCircuit size={16} />
      Open Innovation Lab
    </Link>
  )

  if (loading && !profile) {
    return (
      <section className="space-y-8 pb-6 sm:space-y-10">
        <div className="section-shell overflow-hidden animate-pulse space-y-5">
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            <div className="h-8 w-28 rounded-full bg-slate-200/60" />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="h-8 w-48 rounded-full bg-slate-200/80" />
              <div className="h-16 w-full rounded-[1.5rem] bg-slate-200/70" />
              <div className="h-14 w-5/6 rounded-[1.75rem] bg-slate-200/70" />
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-11 w-32 rounded-full bg-slate-200/70" />
                <div className="h-11 w-32 rounded-full bg-slate-200/60" />
                <div className="h-11 w-32 rounded-full bg-slate-200/60" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="h-28 rounded-[1.5rem] bg-slate-200/70" />
                <div className="h-28 rounded-[1.5rem] bg-slate-200/60" />
                <div className="h-28 rounded-[1.5rem] bg-slate-200/60" />
              </div>
            </div>

            <div className="h-[520px] rounded-[2rem] bg-slate-200/70" />
          </div>
        </div>
      </section>
    )
  }

  if (error && !profile) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section ref={sectionRef} className="space-y-8 pb-6 sm:space-y-10">
      <div className="section-shell overflow-hidden" data-animate-intro>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
          <span className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          <span className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-violet-300/15 blur-3xl" />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div>
            <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700" data-animate-intro>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.14)]" />
              Modern portfolio studio
            </p>

            {profile?.quote ? (
              <div className="mt-4 rounded-3xl border border-blue-100 bg-white/70 px-4 py-3 text-sm italic text-slate-600 shadow-sm backdrop-blur-sm sm:text-base" data-animate-intro>
                &ldquo;{profile.quote}&rdquo;
              </div>
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

              {openInnovationLab}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5" data-animate-reveal>
              {featurePills.map(({ label, icon: Icon }) => (
                <span key={label} className="feature-chip">
                  <Icon size={13} className="text-blue-600" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map(({ label, value, note, icon: Icon, accent }) => (
                <article key={label} className="metric-card" data-animate-reveal>
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${accent}`}>
                    <Icon size={15} />
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">{note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl" data-animate-intro>
            <div className="hero-surface">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="feature-chip border-emerald-200/70 bg-emerald-50/80 text-emerald-700">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]" />
                  Open for select projects
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  <BadgeCheck size={12} className="text-blue-600" />
                  Portfolio 2026
                </span>
              </div>

              <div className="relative mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-slate-100 shadow-inner">
                {profile?.profile_image_url ? (
                  <img
                    src={getAssetUrl(profile.profile_image_url)}
                    alt={profile.full_name}
                    className="relative z-10 h-auto w-full object-cover"
                  />
                ) : (
                  <div className="relative z-10 flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-violet-100 text-sm font-semibold text-slate-600">
                    Profile image preview
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-3xl border border-white/70 bg-slate-950/75 p-4 text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">Current focus</p>
                      <p className="mt-1 text-sm font-semibold sm:text-base">{profile?.role || 'Full Stack Developer'}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/90">
                      <Sparkles size={12} />
                      Modern UI
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    Building fast, polished interfaces with clean APIs, motion-aware details, and a recruiter-friendly story.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link to="/innovation-lab" className="surface-card group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">Interactive showcase</p>
                      <h3 className="mt-1 text-lg font-black text-slate-900">Innovation Lab</h3>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                      <BrainCircuit size={17} />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Audience modes, proof cards, recruiter room, and AI interview simulator in one premium experience.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition group-hover:translate-x-0.5">
                    Open experience
                    <ArrowRight size={14} />
                  </span>
                </Link>

                <a href={resumeJsonUrl} target="_blank" rel="noreferrer" className="surface-card group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Machine-readable data</p>
                      <h3 className="mt-1 text-lg font-black text-slate-900">Resume JSON API</h3>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700">
                      <Code2 size={17} />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Clean structured data for ATS, integrations, and a more forward-thinking portfolio experience.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 transition group-hover:translate-x-0.5">
                    View API
                    <ArrowRight size={14} />
                  </span>
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.slice(0, 6).map((entry) => (
                  <span key={`skill-chip-${entry.id}`} className="feature-chip">
                    {entry.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="section-shell-muted" data-animate-reveal>
          <p className="section-eyebrow border-slate-200 bg-slate-50 text-slate-600">Personal profile</p>
          <h2 className="mt-3 text-gradient text-2xl font-black sm:text-3xl">{profile?.about_intro || 'About Me'}</h2>

          <div className="mt-4 space-y-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
            {profile?.about_text}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {profileDetails.map((item) => {
              const CardTag = item.href ? 'a' : 'article'

              return (
                <CardTag
                  key={item.label}
                  href={item.href || undefined}
                  className="surface-card"
                  {...(item.href ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 sm:text-base">{item.value}</p>
                </CardTag>
              )
            })}
          </div>

          <div className="mt-5 soft-divider" />

          <div className="mt-5 flex flex-wrap gap-2.5">
            {socialConfig.map(({ key, label, icon: Icon, className }) => {
              const url = profile?.[key]
              if (!url) return null

              return (
                <a
                  key={key}
                  data-animate-reveal
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 sm:text-sm ${className}`}
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

        <article className="section-shell-muted overflow-hidden" data-animate-reveal>
          <p className="section-eyebrow border-cyan-200 bg-cyan-50 text-cyan-700">Let&apos;s collaborate</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Need a modern web product?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            I design and build fast, responsive interfaces with scalable backend integrations. If you&apos;re planning a new product or refresh, let&apos;s talk.
          </p>

          <div className="mt-5 grid gap-3">
            {collaborationSteps.map((step, index) => (
              <div key={step.title} className="surface-card flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-sm font-black text-blue-700">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full gap-2 sm:w-auto">
              <MessageCircle size={16} />
              Start Conversation
            </Link>
            <Link to="/projects" className="btn-secondary w-full sm:w-auto">
              View Case Studies
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Strategy', 'UI system', 'Delivery'].map((item) => (
              <span key={item} className="feature-chip">
                <Layers3 size={13} className="text-blue-600" />
                {item}
              </span>
            ))}
          </div>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile?.full_name || 'Portfolio Owner',
            jobTitle: profile?.role || 'Software Developer',
            description: profile?.bio || profile?.about_text || 'Portfolio profile',
            email: profile?.email ? `mailto:${profile.email}` : undefined,
            telephone: profile?.phone || undefined,
            sameAs: [
              profile?.github_url,
              profile?.linkedin_url,
              profile?.instagram_url,
              profile?.facebook_url,
              profile?.whatsapp_url,
            ].filter(Boolean),
            knowsAbout: skills.map((entry) => entry.name),
          }),
        }}
      />
    </section>
  )
}

export default HomePageResponsive