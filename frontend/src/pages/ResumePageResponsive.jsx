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

  if (loading && experiences.length === 0 && education.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error && experiences.length === 0 && education.length === 0) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section ref={sectionRef} className="space-y-10 sm:space-y-12">
      <div className="glass-card flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" data-animate-intro>
        <div className="max-w-2xl">
          <h1 className="section-title text-gradient">Resume</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            My professional experience, academic background, and core skills in one place.
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

      {profile?.about_text ? (
        <article className="glass-card" data-animate-reveal>
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
            <article className="glass-card" data-animate-reveal>
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
            <article className="glass-card" data-animate-reveal>
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
            <article key={category} className="glass-card" data-animate-reveal>
              <h3 className="text-lg font-black text-blue-700">{category}</h3>
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
