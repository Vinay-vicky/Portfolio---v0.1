import { Link } from 'react-router-dom'
import {
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ClipboardCopy,
  Database,
  ExternalLink,
  Globe2,
  LockKeyhole,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  TrendingUp,
  UserRound,
} from 'lucide-react'

function InnovationLabAdvancedPanels({
  interviewRoles,
  interviewRole,
  setInterviewRole,
  setQuestionIndex,
  showIdealAnswer,
  setShowIdealAnswer,
  candidateAnswer,
  setCandidateAnswer,
  answerFeedback,
  setAnswerFeedback,
  activeQuestion,
  moveQuestion,
  evaluateAnswer,
  projectRecords,
  selectedProjectIds,
  toggleProjectSelection,
  roomFeedback,
  copyStatus,
  decodedRoom,
  createRecruiterRoomLink,
  openRecruiterRoomPreview,
  clearRecruiterRoomPreview,
  roomProjects,
  trustPanelState,
  refreshTrustPanel,
  resumeEndpointUrl,
  copyResumeEndpoint,
  resumeLinkStatus,
  resumeJsonState,
  valuePlanRoles,
  valuePlanRole,
  setValuePlanRole,
  valuePlan,
}) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="section-shell space-y-4" data-animate-reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">AI Interview Simulator (Portfolio-trained)</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
              <Bot size={12} />
              Practice mode
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {interviewRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setInterviewRole(role.id)
                  setQuestionIndex(0)
                  setShowIdealAnswer(false)
                  setAnswerFeedback('')
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  interviewRole === role.id
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question focus</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{activeQuestion?.focus}</p>
            <p className="mt-3 text-sm text-slate-800">{activeQuestion?.question}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => moveQuestion('prev')} className="btn-secondary">Previous</button>
              <button type="button" onClick={() => moveQuestion('next')} className="btn-secondary">Next</button>
              <button
                type="button"
                onClick={() => setShowIdealAnswer((prev) => !prev)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                {showIdealAnswer ? 'Hide ideal answer' : 'Show ideal answer'}
              </button>
            </div>

            {showIdealAnswer ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                <p className="font-semibold">Ideal answer guide</p>
                <p className="mt-1">{activeQuestion?.idealAnswer}</p>
              </div>
            ) : null}
          </article>

          <div>
            <label htmlFor="candidateAnswer" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your answer draft
            </label>
            <textarea
              id="candidateAnswer"
              value={candidateAnswer}
              onChange={(event) => setCandidateAnswer(event.target.value)}
              className="soft-input mt-2 min-h-32"
              placeholder="Type your interview answer here..."
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={evaluateAnswer} className="btn-primary">Evaluate answer</button>
              {answerFeedback ? <p className="text-sm font-medium text-slate-700">{answerFeedback}</p> : null}
            </div>
          </div>
        </article>

        <article className="section-shell-muted space-y-4" data-animate-reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Private Recruiter Room</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-700">
              <UserRound size={12} />
              Shareable curation
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Create a private link with selected projects + active audience mode for company-specific review.
          </p>

          <div className="grid gap-2">
            {projectRecords.slice(0, 8).map((project) => {
              const checked = selectedProjectIds.includes(project.id)
              return (
                <label key={project.id} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProjectSelection(project.id)}
                  />
                  <span className="font-semibold">{project.title}</span>
                </label>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={createRecruiterRoomLink} className="btn-primary">
              <ClipboardCopy size={14} className="mr-1" />
              Copy recruiter room link
            </button>
            <button type="button" onClick={openRecruiterRoomPreview} className="btn-secondary">Open preview</button>
            {decodedRoom ? (
              <button type="button" onClick={clearRecruiterRoomPreview} className="btn-secondary">Exit preview</button>
            ) : null}
          </div>

          {roomFeedback ? (
            <p className={`text-sm font-semibold ${copyStatus === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>
              {roomFeedback}
            </p>
          ) : null}

          {decodedRoom ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-semibold">Recruiter room preview active</p>
              <p className="mt-1">
                Generated: {decodedRoom.generatedAt ? new Date(decodedRoom.generatedAt).toLocaleString() : 'Unknown'}
              </p>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Curated projects</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {roomProjects.map((project) => (
                <li key={`room-${project.id}`} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {project.title}
                </li>
              ))}
              {roomProjects.length === 0 ? <li>No projects selected.</li> : null}
            </ul>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="section-shell space-y-4" data-animate-reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Live Trust Panel</h2>
            <button
              type="button"
              onClick={refreshTrustPanel}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCcw size={13} />
              Refresh
            </button>
          </div>

          {trustPanelState.loading ? (
            <p className="text-sm text-slate-600">Loading trust telemetry...</p>
          ) : trustPanelState.error ? (
            <p className="text-sm text-red-700">{trustPanelState.error}</p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">API status</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    {trustPanelState.data?.api?.healthy ? 'Healthy' : 'Unknown'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Uptime: {trustPanelState.data?.api?.uptimeSeconds ?? 0}s</p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Database</p>
                  <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold ${trustPanelState.data?.database?.healthy ? 'text-emerald-700' : 'text-red-700'}`}>
                    <Database size={14} />
                    {trustPanelState.data?.database?.healthy ? 'Connected' : 'Connection issue'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Mode: {trustPanelState.data?.database?.mode || 'n/a'}</p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quality signal</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                    <TrendingUp size={14} />
                    Tests: {trustPanelState.data?.quality?.tests || 'unknown'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Lighthouse: {trustPanelState.data?.quality?.lighthouseScore ?? 'n/a'}</p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Safety controls</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <LockKeyhole size={14} />
                    Recovery: {trustPanelState.data?.alerts?.recoveryConfigured ? 'Configured' : 'Missing'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">SMTP: {trustPanelState.data?.alerts?.smtpConfigured ? 'Configured' : 'Missing'}</p>
                </article>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p className="font-semibold">Inbox telemetry</p>
                <p className="mt-1">Total: {trustPanelState.data?.contactInbox?.total ?? 0} • Unread: {trustPanelState.data?.contactInbox?.unread ?? 0} • Read: {trustPanelState.data?.contactInbox?.read ?? 0}</p>
              </div>
            </>
          )}
        </article>

        <article className="section-shell-muted space-y-4" data-animate-reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Machine-readable Resume API</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-700">
              <Globe2 size={12} />
              /resume-json
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Built for recruiters, ATS tooling, and AI assistants. Consume structured data directly from your portfolio backend.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Endpoint</p>
            <a href={resumeEndpointUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-blue-700 hover:text-blue-600">
              {resumeEndpointUrl}
              <ExternalLink size={13} />
            </a>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={copyResumeEndpoint} className="btn-secondary">Copy endpoint</button>
              <a href={resumeEndpointUrl} target="_blank" rel="noreferrer" className="btn-secondary">Open JSON</a>
            </div>
            {resumeLinkStatus ? <p className="mt-2 text-xs font-semibold text-emerald-700">{resumeLinkStatus}</p> : null}
          </div>

          {resumeJsonState.loading ? (
            <p className="text-sm text-slate-600">Loading resume JSON preview...</p>
          ) : resumeJsonState.error ? (
            <p className="text-sm text-red-700">{resumeJsonState.error}</p>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <p className="font-semibold">Payload snapshot</p>
              <ul className="mt-2 space-y-1.5">
                <li>Schema version: {resumeJsonState.data?.schemaVersion || 'n/a'}</li>
                <li>Generated at: {resumeJsonState.data?.generatedAt ? new Date(resumeJsonState.data.generatedAt).toLocaleString() : 'n/a'}</li>
                <li>Experience entries: {resumeJsonState.data?.experience?.length || 0}</li>
                <li>Projects entries: {resumeJsonState.data?.projects?.length || 0}</li>
                <li>JSON-LD present: {resumeJsonState.data?.jsonLd ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          )}
        </article>
      </div>

      <article className="section-shell space-y-4" data-animate-reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900">30 / 60 / 90-Day Value Plan Generator</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            <CalendarClock size={12} />
            Role-aligned execution plan
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {valuePlanRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setValuePlanRole(role.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                valuePlanRole === role.id
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Day 0–30</p>
            <ul className="mt-2 space-y-2 text-sm text-blue-900">
              {valuePlan.day30.map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Day 31–60</p>
            <ul className="mt-2 space-y-2 text-sm text-violet-900">
              {valuePlan.day60.map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Day 61–90</p>
            <ul className="mt-2 space-y-2 text-sm text-emerald-900">
              {valuePlan.day90.map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </article>

      <article className="section-shell-muted" data-animate-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">Execution notes</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">Want this personalized for one company?</h3>
            <p className="mt-2 text-sm text-slate-600">Use recruiter room links and switch audience mode before sharing.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/projects" className="btn-secondary">Open projects</Link>
            <Link to="/contact" className="btn-primary">Request custom walkthrough</Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><BrainCircuit size={12} /> Simulation</p>
            <p className="mt-1 text-sm text-slate-700">AI interview prompts tied to your real projects.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><ShieldCheck size={12} /> Trust</p>
            <p className="mt-1 text-sm text-slate-700">Live API/database/safety telemetry for credibility.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Rocket size={12} /> Delivery</p>
            <p className="mt-1 text-sm text-slate-700">Constraint-aware architecture and 90-day plan generation.</p>
          </article>
        </div>
      </article>
    </>
  )
}

export default InnovationLabAdvancedPanels
