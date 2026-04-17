import { useMemo, useState } from 'react'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ArrowUpRight, ExternalLink, Search, SlidersHorizontal, Sparkles, XCircle } from 'lucide-react'
import usePageReveal from '../hooks/usePageReveal'

function ProjectsPage() {
  const { projects, loading, error } = usePortfolioData()
  const sectionRef = usePageReveal()
  const [query, setQuery] = useState('')
  const [activeTech, setActiveTech] = useState('All')
  const [liveOnly, setLiveOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  const normalizeProjectUrl = (rawUrl) => {
    if (!rawUrl) return null
    const value = rawUrl.trim()
    if (!value) return null
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return `https://${value}`
  }

  const projectRecords = useMemo(
    () =>
      projects.map((project) => {
        const liveUrl = normalizeProjectUrl(project.project_url)
        const techList = String(project.tech_stack || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)

        const searchText = [project.title, project.description, project.tech_stack]
          .join(' ')
          .toLowerCase()

        return {
          ...project,
          liveUrl,
          techList,
          searchText,
        }
      }),
    [projects],
  )

  const techOptions = useMemo(
    () => ['All', ...Array.from(new Set(projectRecords.flatMap((project) => project.techList)))],
    [projectRecords],
  )

  const totalLiveProjects = useMemo(
    () => projectRecords.filter((project) => Boolean(project.liveUrl)).length,
    [projectRecords],
  )

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projectRecords.filter((project) => {
      if (liveOnly && !project.liveUrl) return false
      if (activeTech !== 'All' && !project.techList.includes(activeTech)) return false
      if (normalizedQuery && !project.searchText.includes(normalizedQuery)) return false
      return true
    })
  }, [projectRecords, query, liveOnly, activeTech])

  const sortedProjects = useMemo(() => {
    const result = [...filteredProjects]

    if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title))
      return result
    }

    if (sortBy === 'za') {
      result.sort((a, b) => b.title.localeCompare(a.title))
      return result
    }

    if (sortBy === 'live-first') {
      result.sort((a, b) => {
        if (Boolean(a.liveUrl) === Boolean(b.liveUrl)) {
          return a.title.localeCompare(b.title)
        }

        return a.liveUrl ? -1 : 1
      })
      return result
    }

    return result
  }, [filteredProjects, sortBy])

  const spotlightProject = sortedProjects[0] || null
  const gridProjects = spotlightProject ? sortedProjects.slice(1) : []

  const hasActiveFilters = query.trim().length > 0 || activeTech !== 'All' || liveOnly || sortBy !== 'featured'

  const resetFilters = () => {
    setQuery('')
    setActiveTech('All')
    setLiveOnly(false)
    setSortBy('featured')
  }

  if (loading && projects.length === 0) {
    return (
      <section ref={sectionRef} className="space-y-8 sm:space-y-10">
        <div className="section-shell animate-pulse space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="h-8 w-40 rounded-full bg-slate-200/80" />
              <div className="h-4 w-72 rounded-full bg-slate-200/60" />
            </div>
            <div className="grid grid-cols-2 gap-3 self-start sm:min-w-[220px]">
              <div className="h-16 rounded-xl bg-slate-200/70" />
              <div className="h-16 rounded-xl bg-slate-200/60" />
            </div>
          </div>
        </div>

        <div className="section-shell-muted animate-pulse space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="h-11 rounded-2xl bg-slate-200/70" />
            <div className="h-11 w-full rounded-2xl bg-slate-200/60" />
            <div className="h-11 w-full rounded-2xl bg-slate-200/60" />
          </div>
          <div className="h-16 rounded-2xl bg-slate-200/60" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article key={`project-skeleton-${index}`} className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
              <div className="h-48 bg-slate-200/70" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 rounded-full bg-slate-200/80" />
                <div className="h-6 w-3/4 rounded-full bg-slate-200/70" />
                <div className="h-4 w-full rounded-full bg-slate-200/70" />
                <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="h-7 w-18 rounded-full bg-slate-200/70" />
                  <div className="h-7 w-20 rounded-full bg-slate-200/60" />
                  <div className="h-7 w-16 rounded-full bg-slate-200/60" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (error && projects.length === 0) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <section ref={sectionRef} className="space-y-8 sm:space-y-10">
      <div className="section-shell space-y-5" data-animate-intro>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-eyebrow border-cyan-200 bg-cyan-50 text-cyan-700">
              <Sparkles size={14} />
              Featured Work
            </p>
            <h1 className="section-title mt-3 text-gradient">Projects</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              A curated showcase of real-world projects with live demos, practical problem-solving, and polished user experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start sm:min-w-[220px]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
              <p className="text-xl font-black text-slate-900">{sortedProjects.length}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Showing</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-center">
              <p className="text-xl font-black text-blue-700">{totalLiveProjects}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">Demos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell-muted space-y-4" data-animate-reveal>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="soft-input pl-10"
              placeholder="Search by title, description, or tech stack"
              aria-label="Search projects"
            />
          </label>

          <button
            type="button"
            onClick={() => setLiveOnly((prev) => !prev)}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              liveOnly
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            aria-pressed={liveOnly}
          >
            Live demos only
          </button>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <XCircle size={14} />
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <ArrowUpDown size={14} />
            Sort projects
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="sr-only">Sort projects</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Sort projects"
            >
              <option value="featured">Featured order</option>
              <option value="live-first">Live demos first</option>
              <option value="az">Title A-Z</option>
              <option value="za">Title Z-A</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <SlidersHorizontal size={14} />
          Filter by tech stack
        </div>

        <div className="flex flex-wrap gap-2">
          {techOptions.map((tech) => {
            const isActive = activeTech === tech

            return (
              <button
                key={tech}
                type="button"
                onClick={() => setActiveTech(tech)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  isActive
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                }`}
                aria-pressed={isActive}
              >
                {tech}
              </button>
            )
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Filter summary</p>
          <p className="mt-1 text-sm text-slate-600">
            {hasActiveFilters
              ? `${sortedProjects.length} project${sortedProjects.length === 1 ? '' : 's'} matched your current filters.`
              : `Showing all ${projects.length} project${projects.length === 1 ? '' : 's'} in featured order.`}
          </p>
        </div>
      </div>

      {spotlightProject ? (
        <article className="section-shell" data-animate-reveal>
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {spotlightProject.image_url ? (
                <img
                  src={getAssetUrl(spotlightProject.image_url)}
                  alt={spotlightProject.title}
                  className="h-full max-h-[360px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-violet-100 text-sm font-semibold text-slate-600">
                  Featured preview
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-slate-900/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                Spotlight
              </span>
            </div>

            <div>
              <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">Top highlighted project</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{spotlightProject.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{spotlightProject.description}</p>

              {spotlightProject.techList.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {spotlightProject.techList.slice(0, 6).map((stack) => (
                    <span key={`spotlight-${spotlightProject.id}-${stack}`} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      {stack}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {spotlightProject.liveUrl ? (
                  <a
                    href={spotlightProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full gap-2 sm:w-auto"
                  >
                    Open Live Demo
                    <ExternalLink size={14} />
                  </a>
                ) : null}
                <Link to="/contact" className="btn-secondary w-full sm:w-auto">Discuss Similar Build</Link>
              </div>
            </div>
          </div>
        </article>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {gridProjects.map((project, index) => {
          const projectUrl = project.liveUrl
          const displayIndex = index + 2
          const cardClasses = `group overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(37,99,235,0.16)] ${
            projectUrl ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300' : ''
          }`

          const cardContent = (
            <>
              {project.image_url ? (
                <div className="relative block overflow-hidden">
                  <img
                    src={getAssetUrl(project.image_url)}
                    alt={project.title}
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/55 to-transparent" />
                  {projectUrl ? (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-slate-900/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      Live demo
                      <ExternalLink size={12} />
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-violet-100 text-sm font-semibold text-slate-600">
                  Preview coming soon
                </div>
              )}

              <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className={`text-lg font-black text-slate-900 transition sm:text-xl ${projectUrl ? 'group-hover:text-blue-700' : ''}`}>
                    {project.title}
                  </h2>

                  <span className="inline-flex shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    #{String(displayIndex).padStart(2, '0')}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techList
                    .slice(0, 4)
                    .map((stack) => (
                      <span key={`${project.id}-${stack}`} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {stack}
                      </span>
                    ))}
                </div>

                {projectUrl ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition group-hover:text-blue-600">
                    Open live project
                    <ArrowUpRight size={14} />
                  </span>
                ) : (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Link not available yet</p>
                )}
              </div>
            </>
          )

          if (projectUrl) {
            return (
              <a
                key={project.id}
                href={projectUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title} live project`}
                data-animate-reveal
                className={cardClasses}
              >
                {cardContent}
              </a>
            )
          }

          return (
            <article key={project.id} data-animate-reveal className={cardClasses}>
              {cardContent}
            </article>
          )
        })}

        {projects.length === 0 ? (
          <article className="glass-card sm:col-span-2 xl:col-span-3" data-animate-reveal>
            <p className="text-sm text-slate-600 sm:text-base">No projects available right now. Please check back soon.</p>
          </article>
        ) : null}

        {projects.length > 0 && sortedProjects.length === 0 ? (
          <article className="glass-card sm:col-span-2 xl:col-span-3" data-animate-reveal>
            <p className="text-sm text-slate-600 sm:text-base">No projects match your current filters. Try a different keyword or clear filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-secondary mt-4"
            >
              Reset filters
            </button>
          </article>
        ) : null}
      </div>

      <div className="section-shell overflow-hidden bg-gradient-primary-to-secondary px-5 py-8 text-center text-white shadow-lg shadow-cyan-200 sm:px-8 sm:py-10" data-animate-reveal>
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
