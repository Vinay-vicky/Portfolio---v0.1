import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import usePageReveal from '../hooks/usePageReveal'

function ProjectsPage() {
  const { projects, loading, error } = usePortfolioData()
  const sectionRef = usePageReveal()

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error && projects.length === 0) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section ref={sectionRef} className="space-y-10 sm:space-y-12">
      <div className="space-y-2 text-center" data-animate-intro>
        <h1 className="section-title text-gradient">Projects</h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
          A collection of my recent work across web development, machine learning, and product interfaces.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} data-animate-reveal className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/80 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/70">
            {project.image_url ? (
              <img
                src={getAssetUrl(project.image_url)}
                alt={project.title}
                className="h-44 w-full object-cover sm:h-48"
              />
            ) : null}
            <div className="flex h-full flex-col p-5">
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">{project.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{project.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700 sm:text-sm">{project.tech_stack}</p>
              {project.project_url ? (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Visit project &rarr;
                </a>
              ) : null}
            </div>
          </article>
        ))}

        {projects.length === 0 ? (
          <article className="glass-card sm:col-span-2 xl:col-span-3" data-animate-reveal>
            <p className="text-sm text-slate-600 sm:text-base">No projects available right now. Please check back soon.</p>
          </article>
        ) : null}
      </div>

      <div className="rounded-2xl bg-gradient-primary-to-secondary px-5 py-8 text-center text-white shadow-lg shadow-cyan-200 sm:px-8 sm:py-10" data-animate-reveal>
        <h2 className="text-2xl font-black sm:text-3xl">Let&apos;s build something together</h2>
        <Link
          to="/contact"
          className="mt-5 inline-flex rounded-md border border-white px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
        >
          Contact me
        </Link>
      </div>
    </section>
  )
}

export default ProjectsPage
