import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Briefcase, CalendarDays, Download, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import usePageReveal from '../hooks/usePageReveal'

function ResumePageResponsive() {
  const { profile, experiences, education, skills, loading, error } = usePortfolioData()
  const sectionRef = usePageReveal()

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const totalSkillCount = skills.length
  const skillCategoryCount = Object.keys(groupedSkills).length

  const resumeMetrics = [
    { label: 'Experience entries', value: experiences.length },
    { label: 'Education entries', value: education.length },
    { label: 'Skill categories', value: skillCategoryCount },
    { label: 'Total skills', value: totalSkillCount },
  ]

  if (loading && experiences.length === 0 && education.length === 0) {
    return (
      <section ref={sectionRef} className="space-y-8 sm:space-y-10">
        <div className="section-shell animate-pulse space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="h-8 w-36 rounded-full bg-slate-200/80" />
              <div className="h-4 w-72 rounded-full bg-slate-200/60" />
            </div>
            <div className="h-11 w-40 rounded-full bg-slate-200/70" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`resume-metric-${index}`} className="stat-tile space-y-3">
              <div className="h-3 w-28 rounded-full bg-slate-200/80" />
              <div className="h-8 w-16 rounded-full bg-slate-200/70" />
            </div>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-2 xl:gap-7">
          <div className="space-y-5">
            <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`resume-experience-${index}`} className="modern-panel space-y-3">
                  <div className="h-5 w-40 rounded-full bg-slate-200/80" />
                  <div className="h-4 w-28 rounded-full bg-slate-200/70" />
                  <div className="h-4 w-full rounded-full bg-slate-200/70" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`resume-education-${index}`} className="modern-panel space-y-3">
                  <div className="h-5 w-44 rounded-full bg-slate-200/80" />
                  <div className="h-4 w-32 rounded-full bg-slate-200/70" />
                  <div className="h-4 w-full rounded-full bg-slate-200/70" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-8 w-28 rounded-full bg-slate-200/80" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`resume-skills-${index}`} className="section-shell-muted space-y-3 animate-pulse">
                <div className="h-5 w-36 rounded-full bg-slate-200/80" />
                <div className="h-2 w-full rounded-full bg-slate-200/70" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-20 rounded-full bg-slate-200/70" />
                  <div className="h-7 w-24 rounded-full bg-slate-200/60" />
                  <div className="h-7 w-16 rounded-full bg-slate-200/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && experiences.length === 0 && education.length === 0) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section ref={sectionRef} className="space-y-8 sm:space-y-10">
      <div className="section-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" data-animate-intro>
        <div className="max-w-2xl">
          <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">Career snapshot</p>
          <h1 className="section-title mt-3 text-gradient">Resume</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            My experience, education, and technical strengths presented in a clean, modern timeline.
          </p>
        </div>

        {profile?.resume_pdf_url ? (
          <a
            href={getAssetUrl(profile.resume_pdf_url)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full gap-2 sm:w-auto"
          >
            <Download size={16} />
            Download Resume
          </a>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {resumeMetrics.map((item) => (
          <article key={item.label} className="stat-tile" data-animate-reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1.5 text-2xl font-black text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      {profile?.about_text ? (
        <article className="section-shell-muted" data-animate-reveal>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Professional Summary</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
            {profile.about_text}
          </p>
        </article>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-2 xl:gap-7">
        <div className="space-y-5">
          <div className="flex items-center gap-2" data-animate-reveal>
            <span className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Briefcase size={18} />
            </span>
            <h2 className="text-2xl font-black text-slate-900">Experience</h2>
          </div>

          {experiences.length > 0 ? (
            <ol className="timeline-stack">
              {experiences.map((item) => (
                <li key={item.id} className="timeline-item" data-animate-reveal>
                  <span className="timeline-dot bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.18)]" aria-hidden="true" />
                  <article className="modern-panel">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        {item.period_label || `${item.start_date} - ${item.end_date || 'Present'}`}
                      </p>
                      {item.location ? (
                        <p className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                          <MapPin size={13} />
                          {item.location}
                        </p>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-xl font-black text-slate-900">{item.position}</h3>
                    <p className="mt-1 text-sm text-slate-600 sm:text-base">
                      {item.company_url ? (
                        <a href={item.company_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:text-blue-600">
                          {item.company}
                        </a>
                      ) : (
                        <span className="font-semibold text-blue-700">{item.company}</span>
                      )}
                    </p>

                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <article className="section-shell-muted" data-animate-reveal>
              <p className="text-sm text-slate-600 sm:text-base">No experience entries available yet.</p>
            </article>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2" data-animate-reveal>
            <span className="rounded-lg bg-violet-100 p-2 text-violet-700">
              <GraduationCap size={18} />
            </span>
            <h2 className="text-2xl font-black text-slate-900">Education</h2>
          </div>

          {education.length > 0 ? (
            <ol className="timeline-stack">
              {education.map((item) => (
                <li key={item.id} className="timeline-item" data-animate-reveal>
                  <span className="timeline-dot bg-violet-500 shadow-[0_0_0_6px_rgba(139,92,246,0.18)]" aria-hidden="true" />
                  <article className="modern-panel">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">
                        <CalendarDays size={13} />
                        {item.years}
                      </p>
                      <p className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        <MapPin size={13} />
                        {item.location}
                      </p>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-slate-900">{item.institution}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{item.level}</span>
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{item.field}</span>
                    </div>

                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <article className="section-shell-muted" data-animate-reveal>
              <p className="text-sm text-slate-600 sm:text-base">No education entries available yet.</p>
            </article>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2" data-animate-reveal>
          <span className="rounded-lg bg-cyan-100 p-2 text-cyan-700">
            <Sparkles size={18} />
          </span>
          <h2 className="text-2xl font-black text-slate-900">Skills</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, entries]) => (
            <article key={category} className="section-shell-muted" data-animate-reveal>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-blue-700">{category}</h3>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                  {entries.length}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500"
                  style={{ width: `${Math.max(18, Math.round((entries.length / Math.max(totalSkillCount, 1)) * 100))}%` }}
                  aria-hidden="true"
                />
              </div>

              <ul className="mt-3 flex flex-wrap gap-2">
                {entries.map((entry) => (
                  <li key={entry.id} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:text-sm">
                    {entry.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResumePageResponsive
