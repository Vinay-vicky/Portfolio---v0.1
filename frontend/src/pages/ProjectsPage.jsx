import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ExternalLink, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function ProjectsPage() {
  const { projects, loading, error } = usePortfolioData()
  const container = useRef()

  useGSAP(() => {
    if (loading || projects.length === 0) return;

    gsap.from(".page-title", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" })

    const cards = gsap.utils.toArray('.project-card')
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100px",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: i % 2 === 0 ? 0 : 0.2
      })
    })

    gsap.from(".cta-section", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top bottom-=50px",
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })

  }, { scope: container, dependencies: [loading, projects] })

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error && projects.length === 0) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <section ref={container} className="space-y-16 pb-10">
      <div className="text-center">
        <h1 className="page-title section-title text-gradient inline-block">Featured Projects</h1>
        <p className="page-title mt-4 text-slate-400 max-w-2xl mx-auto">A collection of my recent work, showcasing my skills in full-stack development, design, and problem-solving.</p>
      </div>
      
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="project-card group overflow-hidden rounded-3xl border border-white/10 bg-darkCard/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)]">
            <div className="relative h-60 overflow-hidden">
              {project.image_url ? (
                <img
                  src={getAssetUrl(project.image_url)}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-slate-800 flex items-center justify-center">
                   <span className="text-slate-500">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-darkCard to-transparent opacity-60"></div>
            </div>
            
            <div className="relative p-6 -mt-8 bg-darkCard/95 backdrop-blur-md rounded-t-3xl border-t border-white/5">
              <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech_stack.split(',').map((tech, i) => (
                  <span key={i} className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                    {tech.trim()}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 line-clamp-3">{project.description}</p>
              
              <div className="mt-6 flex items-center justify-between">
                {project.project_url ? (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-indigo-400"
                  >
                    View Project <ExternalLink size={16} />
                  </a>
                ) : <span className="text-sm text-slate-500">Private Repo</span>}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="cta-section relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white">Let&apos;s build something great</h2>
          <p className="mt-4 text-indigo-100 max-w-xl mx-auto">Have an idea in mind or need help with a project? I'm currently available for freelance work and open to new opportunities.</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            Get in touch <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage
