import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ExternalLink,
  Gauge,
  GitBranch,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import { fetchResumeJson, fetchTrustPanel, getResumeJsonUrl } from '../features/portfolio/portfolioApi'
import usePageReveal from '../hooks/usePageReveal'

const InnovationLabAdvancedPanels = lazy(() => import('../components/innovation/InnovationLabAdvancedPanels'))

const audienceModes = [
  { id: 'recruiter', label: 'Recruiter', focus: 'Proof of impact, outcomes, and role fit' },
  { id: 'engineering-manager', label: 'Engineering Manager', focus: 'Architecture quality, trade-offs, and reliability' },
  { id: 'founder', label: 'Founder', focus: 'Speed to value, business impact, and ownership' },
]

const interviewRoles = [
  { id: 'frontend', label: 'Frontend Engineer' },
  { id: 'fullstack', label: 'Full-Stack Engineer' },
  { id: 'product', label: 'Product-Minded Engineer' },
]

const valuePlanRoles = [
  { id: 'frontend', label: 'Frontend Engineer' },
  { id: 'fullstack', label: 'Full-Stack Engineer' },
  { id: 'lead', label: 'Technical Lead' },
]

const architectureScaleOptions = [
  { id: 'prototype', label: 'Prototype' },
  { id: 'growth', label: 'Growth' },
  { id: 'high-scale', label: 'High scale' },
]

const architectureSecurityOptions = [
  { id: 'standard', label: 'Standard' },
  { id: 'hardened', label: 'Hardened' },
  { id: 'enterprise', label: 'Enterprise' },
]

const architectureBudgetOptions = [
  { id: 'lean', label: 'Lean' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'premium', label: 'Premium' },
]

const decodeRoomToken = (token) => {
  if (!token) return null

  try {
    const decoded = decodeURIComponent(window.atob(token))
    const parsed = JSON.parse(decoded)

    if (!Array.isArray(parsed?.projectIds) || typeof parsed?.audience !== 'string') {
      return null
    }

    return {
      audience: parsed.audience,
      projectIds: parsed.projectIds.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0),
      generatedAt: parsed.generatedAt || null,
    }
  } catch {
    return null
  }
}

const encodeRoomToken = (payload) => {
  try {
    return window.btoa(encodeURIComponent(JSON.stringify(payload)))
  } catch {
    return null
  }
}

const normalizeProjectUrl = (rawUrl) => {
  if (!rawUrl) return null
  const value = String(rawUrl).trim()
  if (!value) return null
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `https://${value}`
}

const buildArchitecturePlan = ({ scale, security, budget }) => {
  const edgeCaching = scale === 'high-scale' || budget !== 'lean'
  const hardenedAuth = security === 'hardened' || security === 'enterprise'
  const enterpriseControls = security === 'enterprise'

  const backendRuntime =
    scale === 'prototype' && budget === 'lean'
      ? 'Single region API service with autosleep-safe health checks'
      : scale === 'high-scale'
        ? 'Horizontally scaled API with queue-friendly architecture'
        : 'Always-on API with regional failover roadmap'

  const databasePlan = scale === 'high-scale'
    ? 'Managed libSQL/Turso with read replicas + backup retention'
    : 'Managed libSQL/Turso with daily backup snapshots'

  return {
    frontend: edgeCaching
      ? 'Edge-cached static frontend with route-level prefetching and lazy hydration'
      : 'Standard CDN delivery with route-level code splitting',
    backend: backendRuntime,
    database: databasePlan,
    observability: [
      'API latency + error-rate dashboard',
      'Release marker per deployment',
      'Contact form delivery and recovery endpoint heartbeat',
      edgeCaching ? 'Synthetic checks from 2+ geographies' : 'Single-region uptime monitor',
    ],
    securityControls: [
      hardenedAuth ? 'Short-lived JWT + credential recovery controls' : 'JWT auth + credential rotation policy',
      enterpriseControls ? 'Audit logging + signed admin action trails' : 'Basic security events + alerting',
      security === 'enterprise' ? 'Secret vault and key rotation schedule' : 'Environment-variable secret management',
    ],
    risks: [
      scale === 'high-scale' ? 'Cross-region consistency and cache invalidation' : 'Content freshness and cache stampede on spikes',
      budget === 'lean' ? 'Limited observability depth during incidents' : 'Monitoring alert fatigue without tuning',
      security === 'enterprise' ? 'Higher delivery complexity and governance overhead' : 'Operational discipline needed for credential hygiene',
    ],
  }
}

function InnovationLabPageOptimized() {
  const sectionRef = usePageReveal()
  const { profile, projects, skills } = usePortfolioData()
  const [searchParams, setSearchParams] = useSearchParams()

  const audienceFromQuery = String(searchParams.get('audience') || '').toLowerCase()
  const defaultAudience = audienceModes.some((item) => item.id === audienceFromQuery) ? audienceFromQuery : 'recruiter'

  const [audienceMode, setAudienceMode] = useState(defaultAudience)
  const [selectedProjectIds, setSelectedProjectIds] = useState([])
  const [roomFeedback, setRoomFeedback] = useState('')
  const [copyStatus, setCopyStatus] = useState('idle')
  const [trustPanelState, setTrustPanelState] = useState({ loading: true, error: null, data: null })
  const [resumeJsonState, setResumeJsonState] = useState({ loading: true, error: null, data: null })
  const [scaleTarget, setScaleTarget] = useState('growth')
  const [securityTarget, setSecurityTarget] = useState('hardened')
  const [budgetTarget, setBudgetTarget] = useState('balanced')
  const [interviewRole, setInterviewRole] = useState('fullstack')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showIdealAnswer, setShowIdealAnswer] = useState(false)
  const [candidateAnswer, setCandidateAnswer] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState('')
  const [valuePlanRole, setValuePlanRole] = useState('fullstack')
  const [resumeLinkStatus, setResumeLinkStatus] = useState('')

  const decodedRoom = useMemo(() => decodeRoomToken(searchParams.get('room')), [searchParams])

  const projectRecords = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        liveUrl: normalizeProjectUrl(project.project_url),
        techList: String(project.tech_stack || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })),
    [projects],
  )

  useEffect(() => {
    if (projectRecords.length === 0) return

    if (decodedRoom?.projectIds?.length) {
      const validProjectIdSet = new Set(projectRecords.map((item) => item.id))
      const fromRoom = decodedRoom.projectIds.filter((id) => validProjectIdSet.has(id))

      if (fromRoom.length > 0) {
        setSelectedProjectIds(fromRoom)
      } else {
        setSelectedProjectIds(projectRecords.slice(0, 3).map((item) => item.id))
      }

      if (audienceModes.some((item) => item.id === decodedRoom.audience)) {
        setAudienceMode(decodedRoom.audience)
      }

      return
    }

    setSelectedProjectIds((current) => {
      if (current.length > 0) return current
      return projectRecords.slice(0, 3).map((item) => item.id)
    })
  }, [projectRecords, decodedRoom])

  const refreshTrustPanel = async () => {
    setTrustPanelState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await fetchTrustPanel()
      setTrustPanelState({ loading: false, error: null, data })
    } catch (error) {
      setTrustPanelState({
        loading: false,
        error: error?.response?.data?.error || error?.message || 'Unable to load trust panel.',
        data: null,
      })
    }
  }

  useEffect(() => {
    let active = true

    const loadResumeJson = async () => {
      try {
        const data = await fetchResumeJson()
        if (!active) return

        setResumeJsonState({ loading: false, error: null, data })
      } catch (error) {
        if (!active) return

        setResumeJsonState({
          loading: false,
          error: error?.response?.data?.error || error?.message || 'Unable to load resume JSON.',
          data: null,
        })
      }
    }

    refreshTrustPanel()
    loadResumeJson()

    return () => {
      active = false
    }
  }, [])

  const selectedProjects = useMemo(
    () => projectRecords.filter((item) => selectedProjectIds.includes(item.id)),
    [projectRecords, selectedProjectIds],
  )

  const audienceSummary = useMemo(() => {
    if (audienceMode === 'engineering-manager') {
      return 'This view prioritizes architecture quality, maintainability, and reliability decisions.'
    }

    if (audienceMode === 'founder') {
      return 'This view prioritizes speed-to-value, ownership, and measurable product outcomes.'
    }

    return 'This view prioritizes business impact, role fit, and evidence-backed delivery.'
  }, [audienceMode])

  const claimEvidenceItems = useMemo(() => {
    const baseProjects = selectedProjects.length > 0 ? selectedProjects : projectRecords.slice(0, 3)

    return baseProjects.slice(0, 4).map((project, index) => {
      const complexityLevel = project.techList.length >= 5 ? 'high' : project.techList.length >= 3 ? 'medium' : 'focused'
      const roleContext =
        audienceMode === 'founder'
          ? 'validated execution speed and delivery ownership'
          : audienceMode === 'engineering-manager'
            ? 'demonstrated maintainable structure and scalable choices'
            : 'proved end-to-end delivery with measurable scope'

      return {
        id: project.id,
        claim: `${project.title} ${roleContext}.`,
        metric: `${project.techList.length || 1} core technologies in a ${complexityLevel} complexity build`,
        evidence: [
          project.liveUrl
            ? { label: 'Project link', value: 'Open demo/repository', href: project.liveUrl }
            : { label: 'Project link', value: 'Link available on request' },
          { label: 'Tech stack', value: project.tech_stack },
          {
            label: 'Portfolio role',
            value: index === 0 ? 'Spotlight project with highest narrative weight' : `Evidence node #${index + 1}`,
          },
        ],
      }
    })
  }, [selectedProjects, projectRecords, audienceMode])

  const decisionTimeline = useMemo(
    () => [
      {
        title: 'Dynamic migration over static pages',
        decision: 'Move portfolio content into API-backed tables and Redux data flow.',
        tradeoff: 'Higher initial complexity, but edits become scalable and production-safe.',
        impact: 'Unlocked admin-managed content and future automation features.',
      },
      {
        title: 'Route-level lazy loading + adaptive prefetch',
        decision: 'Use lazy routes with prefetch that adapts to network and memory conditions.',
        tradeoff: 'Slightly more routing logic in exchange for faster perceived performance.',
        impact: 'Reduced initial load cost while keeping navigation responsive.',
      },
      {
        title: 'Credential resilience over env-only auth',
        decision: 'Shift to DB-backed hashed credentials with recovery key + reset workflow.',
        tradeoff: 'Added auth lifecycle complexity to prevent lockout risk.',
        impact: 'Operational continuity and safer long-term admin management.',
      },
      {
        title: 'Evidence-first portfolio storytelling',
        decision: 'Introduce claim-to-evidence model and audience-tailored views.',
        tradeoff: 'Requires more structured project metadata than standard galleries.',
        impact: 'Increases credibility and relevance for each visitor type.',
      },
    ],
    [],
  )

  const failureVault = useMemo(
    () => [
      {
        title: 'Admin lockout risk',
        whatBroke: 'Password drift caused admin sign-in loss in prior iteration.',
        rootCause: 'Credential lifecycle relied on static environment comparisons only.',
        fix: 'Implemented DB-hashed credentials, recovery key flow, and reset CLI.',
        prevention: 'Recovery status surfaced in login UI + operator checklist copy/download tools.',
      },
      {
        title: 'Navigation jank on transitions',
        whatBroke: 'Page swaps felt abrupt under heavier content and animation timings.',
        rootCause: 'Enter transitions fired without coordinated exit staging.',
        fix: 'Added displayed-location route staging for smooth exit → enter flow.',
        prevention: 'Respect reduced-motion preferences and adaptive prefetch behavior.',
      },
      {
        title: 'Contact pipeline visibility gap',
        whatBroke: 'No immediate confidence signal for mail delivery readiness.',
        rootCause: 'SMTP status lived only in backend logs.',
        fix: 'Added admin SMTP health probe and trust signals in portfolio architecture.',
        prevention: 'Periodic health checks and trust panel surfacing operational state.',
      },
    ],
    [],
  )

  const architecturePlan = useMemo(
    () =>
      buildArchitecturePlan({
        scale: scaleTarget,
        security: securityTarget,
        budget: budgetTarget,
      }),
    [scaleTarget, securityTarget, budgetTarget],
  )

  const interviewQuestionBank = useMemo(() => {
    const anchorProject = selectedProjects[0] || projectRecords[0]
    const backupProject = selectedProjects[1] || projectRecords[1]
    const skillHighlights = skills.slice(0, 5).map((item) => item.name)

    const roleAngle =
      interviewRole === 'frontend'
        ? 'frontend architecture and UX reliability'
        : interviewRole === 'product'
          ? 'product outcomes and customer impact'
          : 'end-to-end system design and delivery ownership'

    return [
      {
        focus: roleAngle,
        question: `Walk me through how you would improve ${anchorProject?.title || 'a production project'} for better reliability over the next quarter.`,
        idealAnswer: `I would start with baseline metrics (latency, error rate, user journey drop-off), then prioritize quick wins and structural upgrades. For ${anchorProject?.title || 'the project'}, that means route performance tuning, observability instrumentation, and risk-based hardening. I would ship in small releases with rollback-ready checkpoints and quantify the outcome after each milestone.`,
        keywords: ['metrics', 'baseline', 'observability', 'rollback', 'milestone'],
      },
      {
        focus: 'trade-off communication',
        question: 'Describe a technical trade-off where speed and quality were in tension. How did you decide?',
        idealAnswer: 'I frame options by impact, risk, and reversibility. I choose the smallest reversible solution that ships value quickly, then schedule a reliability pass once signal confirms traction. This keeps delivery momentum while protecting long-term maintainability.',
        keywords: ['impact', 'risk', 'reversible', 'maintainability'],
      },
      {
        focus: 'project storytelling',
        question: `What makes ${backupProject?.title || 'your portfolio work'} a credible example of your engineering level?`,
        idealAnswer: `It shows complete lifecycle ownership: requirement framing, implementation, deployment, and iteration. I can point to concrete evidence (tech choices, runtime behavior, and measurable delivery scope) rather than only visuals.`,
        keywords: ['ownership', 'deployment', 'evidence', 'scope'],
      },
      {
        focus: 'team collaboration',
        question: 'How would you align with design, product, and stakeholders in the first month of joining?',
        idealAnswer: 'I set a shared weekly loop: clarify priorities, convert goals into scoped deliverables, and maintain visible checkpoints. I document decisions with context and alternatives to keep the team aligned and reduce rework.',
        keywords: ['priorities', 'deliverables', 'checkpoints', 'document'],
      },
      {
        focus: 'skill depth',
        question: `Which of your current skills (${skillHighlights.join(', ') || 'core stack'}) would you lean on first for immediate impact?`,
        idealAnswer: 'I would lead with the skills that de-risk delivery early: architecture setup, feature slicing, and instrumentation. Once the foundation is stable, I expand into optimization and quality automation to sustain velocity.',
        keywords: ['de-risk', 'feature slicing', 'instrumentation', 'automation'],
      },
    ]
  }, [selectedProjects, projectRecords, skills, interviewRole])

  const activeQuestion = interviewQuestionBank[questionIndex] || interviewQuestionBank[0]

  const valuePlan = useMemo(() => {
    const topProject = selectedProjects[0]?.title || projectRecords[0]?.title || 'portfolio platform'
    const topSkillSet = skills.slice(0, 4).map((item) => item.name).join(', ') || 'React, API design, delivery management'

    const audienceDirective =
      audienceMode === 'founder'
        ? 'prioritize speed-to-learning and business outcomes'
        : audienceMode === 'engineering-manager'
          ? 'prioritize code health, reliability, and team leverage'
          : 'prioritize visibility, impact, and role alignment'

    return {
      day30: [
        `Audit current architecture and delivery flow for ${topProject}.`,
        `Establish baseline metrics and ${audienceDirective}.`,
        `Ship one low-risk improvement using ${topSkillSet}.`,
      ],
      day60: [
        'Complete two medium-scope improvements with measurable outcomes.',
        'Harden observability and incident response habits.',
        'Document technical decisions with trade-offs for team reuse.',
      ],
      day90: [
        `Lead a strategic initiative aligned to ${valuePlanRole} expectations.`,
        'Introduce repeatable quality gates for releases and performance budgets.',
        'Present before/after metrics and roadmap recommendations for next quarter.',
      ],
    }
  }, [selectedProjects, projectRecords, skills, audienceMode, valuePlanRole])

  const roomProjects = useMemo(
    () => projectRecords.filter((item) => selectedProjectIds.includes(item.id)),
    [projectRecords, selectedProjectIds],
  )

  const currentAudience = audienceModes.find((item) => item.id === audienceMode) || audienceModes[0]
  const resumeEndpointUrl = getResumeJsonUrl()

  const toggleProjectSelection = (id) => {
    setSelectedProjectIds((current) => {
      if (current.includes(id)) {
        if (current.length <= 1) return current
        return current.filter((value) => value !== id)
      }

      return [...current, id]
    })
  }

  const copyText = async (text, onSuccessMessage) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setCopyStatus('success')
        setRoomFeedback(onSuccessMessage)
        return
      }

      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'absolute'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (copied) {
        setCopyStatus('success')
        setRoomFeedback(onSuccessMessage)
      } else {
        setCopyStatus('error')
        setRoomFeedback('Could not copy automatically. Please copy manually.')
      }
    } catch {
      setCopyStatus('error')
      setRoomFeedback('Could not copy automatically. Please copy manually.')
    }
  }

  const createRecruiterRoomLink = async () => {
    const payload = {
      audience: audienceMode,
      projectIds: selectedProjectIds,
      generatedAt: new Date().toISOString(),
    }

    const token = encodeRoomToken(payload)
    if (!token) {
      setCopyStatus('error')
      setRoomFeedback('Could not generate recruiter room token.')
      return
    }

    const url = `${window.location.origin}/innovation-lab?room=${encodeURIComponent(token)}`
    await copyText(url, 'Recruiter room link copied.')
  }

  const openRecruiterRoomPreview = () => {
    const payload = {
      audience: audienceMode,
      projectIds: selectedProjectIds,
      generatedAt: new Date().toISOString(),
    }

    const token = encodeRoomToken(payload)
    if (!token) {
      setCopyStatus('error')
      setRoomFeedback('Could not generate recruiter room preview link.')
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set('room', token)
    params.set('audience', audienceMode)
    setSearchParams(params)
    setRoomFeedback('Recruiter room preview enabled for this page.')
  }

  const clearRecruiterRoomPreview = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('room')
    params.set('audience', audienceMode)
    setSearchParams(params)
    setRoomFeedback('Recruiter room preview cleared.')
  }

  const evaluateAnswer = () => {
    const answer = candidateAnswer.trim().toLowerCase()

    if (!answer) {
      setAnswerFeedback('Write a short answer first, then run feedback.')
      return
    }

    const keywords = activeQuestion?.keywords || []
    const hits = keywords.filter((word) => answer.includes(word.toLowerCase())).length
    const ratio = keywords.length === 0 ? 1 : hits / keywords.length

    if (ratio >= 0.8) {
      setAnswerFeedback('Strong answer: clear structure and relevant depth.')
      return
    }

    if (ratio >= 0.45) {
      setAnswerFeedback('Good start: add more evidence, metrics, and decision context.')
      return
    }

    setAnswerFeedback('Improve by adding trade-offs, metrics, and concrete execution steps.')
  }

  const copyResumeEndpoint = async () => {
    await copyText(resumeEndpointUrl, 'Machine-readable resume endpoint copied.')
    setResumeLinkStatus('Endpoint copied to clipboard.')
    window.setTimeout(() => setResumeLinkStatus(''), 2600)
  }

  const moveQuestion = (direction) => {
    setQuestionIndex((current) => {
      const next = direction === 'next' ? current + 1 : current - 1
      if (next < 0) return interviewQuestionBank.length - 1
      if (next >= interviewQuestionBank.length) return 0
      return next
    })
    setShowIdealAnswer(false)
    setAnswerFeedback('')
  }

  return (
    <section ref={sectionRef} className="space-y-8 sm:space-y-10">
      <div className="section-shell" data-animate-intro>
        <p className="section-eyebrow border-violet-200 bg-violet-50 text-violet-700">
          <Sparkles size={13} />
          Innovation Lab • 10 differentiator features
        </p>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="section-title text-gradient">Next-gen Portfolio Intelligence</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              This page implements your full differentiator stack: audience personalization, proof graphs, architecture simulation,
              private recruiter rooms, machine-readable resume APIs, trust telemetry, interview simulation, and 30/60/90 planning.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Active mode: <span className="text-blue-700">{currentAudience.label}</span> — {currentAudience.focus}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700">
              <Target size={13} />
              Audience mode summary
            </p>
            <p className="mt-2 text-sm text-blue-900">{audienceSummary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {audienceModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setAudienceMode(mode.id)
                    const params = new URLSearchParams(searchParams)
                    params.set('audience', mode.id)
                    setSearchParams(params)
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    audienceMode === mode.id
                      ? 'border-blue-300 bg-white text-blue-700'
                      : 'border-blue-200 bg-blue-100/70 text-blue-800 hover:bg-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="section-shell space-y-4" data-animate-reveal>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Claim → Evidence Graph</h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Credibility Layer
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Every claim is anchored to specific evidence artifacts. No fluff, only verifiable narrative.
          </p>

          <ol className="space-y-3">
            {claimEvidenceItems.map((item, index) => (
              <li key={item.id} className="relative rounded-2xl border border-slate-200 bg-white p-4">
                {index < claimEvidenceItems.length - 1 ? (
                  <span aria-hidden="true" className="absolute left-[1.1rem] top-[3.15rem] h-10 w-[2px] bg-gradient-to-b from-blue-300 to-cyan-300" />
                ) : null}

                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-black text-blue-700">
                  {index + 1}
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">{item.claim}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">{item.metric}</p>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {item.evidence.map((entry, evidenceIndex) => (
                    <div key={`${item.id}-${evidenceIndex}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      <p className="font-bold uppercase tracking-wide text-slate-500">{entry.label}</p>
                      {entry.href ? (
                        <a href={entry.href} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-600">
                          {entry.value}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <p className="mt-1 text-slate-700">{entry.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="section-shell-muted space-y-4" data-animate-reveal>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Decision Timeline</h2>
            <GitBranch size={17} className="text-violet-600" />
          </div>

          <ol className="space-y-3">
            {decisionTimeline.map((entry) => (
              <li key={entry.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-black text-slate-900">{entry.title}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Decision</p>
                <p className="text-sm text-slate-600">{entry.decision}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Trade-off</p>
                <p className="text-sm text-slate-600">{entry.tradeoff}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Impact</p>
                <p className="text-sm text-slate-600">{entry.impact}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <article className="section-shell space-y-4" data-animate-reveal>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900">Failure Vault / Postmortems</h2>
          <TriangleAlert size={17} className="text-amber-600" />
        </div>

        <p className="text-sm text-slate-600">A transparent track record of what failed, why it failed, and how the system was hardened afterward.</p>

        <div className="grid gap-4 lg:grid-cols-3">
          {failureVault.map((entry) => (
            <article key={entry.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-black text-slate-900">{entry.title}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-700">What broke</p>
              <p className="text-sm text-slate-600">{entry.whatBroke}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Root cause</p>
              <p className="text-sm text-slate-600">{entry.rootCause}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Fix</p>
              <p className="text-sm text-slate-600">{entry.fix}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Prevention</p>
              <p className="text-sm text-slate-600">{entry.prevention}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="section-shell-muted space-y-4" data-animate-reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900">Interactive Architecture Playground</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-700">
            <Network size={12} />
            Constraint-driven planning
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scale</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {architectureScaleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setScaleTarget(option.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    scaleTarget === option.id
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Security</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {architectureSecurityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSecurityTarget(option.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    securityTarget === option.id
                      ? 'border-violet-300 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {architectureBudgetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBudgetTarget(option.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    budgetTarget === option.id
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
              <Rocket size={13} />
              Suggested architecture
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold">Frontend:</span> {architecturePlan.frontend}</li>
              <li><span className="font-semibold">Backend:</span> {architecturePlan.backend}</li>
              <li><span className="font-semibold">Database:</span> {architecturePlan.database}</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
              <ShieldCheck size={13} />
              Security controls
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {architecturePlan.securityControls.map((entry) => (
                <li key={entry} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-cyan-700">
              <Gauge size={13} />
              Observability
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {architecturePlan.observability.map((entry) => (
                <li key={entry} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
              <TriangleAlert size={13} />
              Risk watch
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {architecturePlan.risks.map((entry) => (
                <li key={entry} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {entry}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </article>

      <Suspense fallback={(
        <div className="section-shell-muted flex min-h-[28rem] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      )}>
        <InnovationLabAdvancedPanels
          interviewRoles={interviewRoles}
          interviewRole={interviewRole}
          setInterviewRole={setInterviewRole}
          setQuestionIndex={setQuestionIndex}
          showIdealAnswer={showIdealAnswer}
          setShowIdealAnswer={setShowIdealAnswer}
          candidateAnswer={candidateAnswer}
          setCandidateAnswer={setCandidateAnswer}
          answerFeedback={answerFeedback}
          setAnswerFeedback={setAnswerFeedback}
          activeQuestion={activeQuestion}
          moveQuestion={moveQuestion}
          evaluateAnswer={evaluateAnswer}
          projectRecords={projectRecords}
          selectedProjectIds={selectedProjectIds}
          toggleProjectSelection={toggleProjectSelection}
          roomFeedback={roomFeedback}
          copyStatus={copyStatus}
          decodedRoom={decodedRoom}
          createRecruiterRoomLink={createRecruiterRoomLink}
          openRecruiterRoomPreview={openRecruiterRoomPreview}
          clearRecruiterRoomPreview={clearRecruiterRoomPreview}
          roomProjects={roomProjects}
          trustPanelState={trustPanelState}
          refreshTrustPanel={refreshTrustPanel}
          resumeEndpointUrl={resumeEndpointUrl}
          copyResumeEndpoint={copyResumeEndpoint}
          resumeLinkStatus={resumeLinkStatus}
          resumeJsonState={resumeJsonState}
          valuePlanRoles={valuePlanRoles}
          valuePlanRole={valuePlanRole}
          setValuePlanRole={setValuePlanRole}
          valuePlan={valuePlan}
        />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            resumeJsonState?.data?.jsonLd || {
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile?.full_name || 'Portfolio Owner',
              jobTitle: profile?.role || 'Software Developer',
              knowsAbout: skills.slice(0, 8).map((item) => item.name),
            },
          ),
        }}
      />
    </section>
  )
}

export default InnovationLabPageOptimized
