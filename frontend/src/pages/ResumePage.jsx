import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Download, Briefcase, GraduationCap, Code2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function ResumePage() {
  const { profile, experiences, education, skills, loading, error } = usePortfolioData()
  const container = useRef()

  useGSAP(() => {
    if (loading || (!experiences.length && !education.length)) return;

    gsap.from(".page-header", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" })

    const sections = gsap.utils.toArray('.resume-section')
    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=100px",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      })
    })

    const items = gsap.utils.toArray('.timeline-item')
    items.forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=50px",
          toggleActions: "play none none reverse"
        },
        x: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: i * 0.1
      })
    })

    const skillCards = gsap.utils.toArray('.skill-card')
    skillCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=50px",
          toggleActions: "play none none reverse"
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.5)",
        delay: i * 0.1
      })
    })

  }, { scope: container, dependencies: [loading, experiences, education] })

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  if (loading && experiences.length === 0 && education.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error && experiences.length === 0 && education.length === 0) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <section ref={container} className="space-y-16 pb-10">
      <div className="page-header flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="section-title text-gradient">Resume & Experience</h1>
          <p className="mt-2 text-slate-400 max-w-xl">A detailed look at my professional journey, academic background, and technical skillset.</p>
        </div>
        {profile?.resume_pdf_url ? (
          <a
            href={getAssetUrl(profile.resume_pdf_url)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-6 py-3 font-semibold text-indigo-300 transition-colors hover:bg-indigo-500 hover:text-white"
          >
            <Download size={18} />
            Download PDF
          </a>
        ) : null}
      </div>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Experience Section */}
        <div className="resume-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400 border border-indigo-500/30">
              <Briefcase size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">Experience</h2>
          </div>
          
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-10">
            {experiences.map((item) => (
              <article key={item.id} className="timeline-item relative pl-8 before:absolute before:left-[-9px] before:top-1 before:h-4 before:w-4 before:rounded-full before:border-4 before:border-darkBg before:bg-indigo-500">
                <div className="glass-card !p-5 !rounded-2xl">
                  <p className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400">
                    {item.period_label || `${item.start_date} - ${item.end_date || 'Present'}`}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">{item.position}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-400 text-sm">
                    {item.company_url ? (
                      <a href={item.company_url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
                        {item.company}
                      </a>
                    ) : (
                      <span className="font-semibold text-indigo-300">{item.company}</span>
                    )}
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  <p className="mt-4 text-slate-300 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="resume-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400 border border-purple-500/30">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">Education</h2>
          </div>
          
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-10">
            {education.map((item) => (
              <article key={item.id} className="timeline-item relative pl-8 before:absolute before:left-[-9px] before:top-1 before:h-4 before:w-4 before:rounded-full before:border-4 before:border-darkBg before:bg-purple-500">
                <div className="glass-card !p-5 !rounded-2xl">
                  <p className="inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-purple-400">
                    {item.years}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">{item.institution}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">{item.level}</span>
                    <span>•</span>
                    <span>{item.field}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  <p className="mt-4 text-slate-300 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="resume-section pt-8 border-t border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/30">
            <Code2 size={24} />
          </div>
          <h2 className="text-2xl font-black text-white">Technical Skills</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, entries]) => (
            <article key={category} className="skill-card glass-card !p-6">
              <h3 className="text-lg font-bold text-indigo-300 mb-4 pb-2 border-b border-white/10">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {entries.map((entry) => (
                  <span key={entry.id} className="rounded-md bg-slate-800/80 px-3 py-1.5 text-sm text-slate-300 border border-white/5 transition-colors hover:border-indigo-500/30 hover:bg-slate-800">
                    {entry.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResumePage
