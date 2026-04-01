import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'

function ProjectsPage() {
  const { projects, loading, error } = usePortfolioData()

  if (loading && projects.length === 0) {
    return <p className="text-slate-600">Loading projects...</p>
  }

  if (error && projects.length === 0) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section className="space-y-10">
      <h1 className="section-title text-gradient text-center">Projects</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {project.image_url ? (
              <img
                src={getAssetUrl(project.image_url)}
                alt={project.title}
                className="h-52 w-full object-cover"
              />
            ) : null}
            <div className="p-5">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="mt-2 text-slate-700">{project.description}</p>
            <p className="mt-3 text-sm text-blue-700">{project.tech_stack}</p>
            {project.project_url ? (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                Visit project ↗
              </a>
            ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-primary-to-secondary px-6 py-10 text-center text-white shadow-sm">
        <h2 className="text-3xl font-black">Let&apos;s build something together</h2>
        <a
          href="/contact"
          className="mt-5 inline-block rounded-md border border-white px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
        >
          Contact me
        </a>
      </div>
    </section>
  )
}

export default ProjectsPage
