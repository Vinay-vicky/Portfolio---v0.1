simport usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Briefcase, Download, GraduationCap, Sparkles } from 'lucide-react'

function ResumePage() {
  const { profile, experiences, education, skills, loading, error } = usePortfolioData()

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
    <section className="space-y-10 sm:space-y-12">
      <div className="glass-card flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-100 p-2 text-blue-700">
            <Briefcase size={18} />
          </span>
          <h2 className="text-2xl font-black text-slate-900">Experience</h2>
        </div>

        <div className="space-y-4">
          {experiences.map((item) => (
            <article key={item.id} className="glass-card">
              <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                {item.period_label || `${item.start_date} - ${item.end_date || 'Present'}`}
              </p>
              <h3 className="mt-3 text-xl font-black text-slate-900">{item.position}</h3>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                {item.company_url ? (
                  <a href={item.company_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:text-blue-600">
                    {item.company}
                  </a>
                ) : (
                  <span className="font-semibold text-blue-700">{item.company}</span>
                )}
                {item.location ? <span> &middot; {item.location}</span> : null}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-violet-100 p-2 text-violet-700">
            <GraduationCap size={18} />
          </span>
          <h2 className="text-2xl font-black text-slate-900">Education</h2>
        </div>

        <div className="space-y-4">
          {education.map((item) => (
            <article key={item.id} className="glass-card">
              <p className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">
                {item.years}
              </p>
              <h3 className="mt-3 text-xl font-black text-slate-900">{item.institution}</h3>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">{item.level} &middot; {item.field} &middot; {item.location}</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-cyan-100 p-2 text-cyan-700">
            <Sparkles size={18} />
          </span>
          <h2 className="text-2xl font-black text-slate-900">Skills</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, entries]) => (
            <article key={category} className="glass-card">
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

export default ResumePage
