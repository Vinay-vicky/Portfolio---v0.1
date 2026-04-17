import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authSlice'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AlertTriangle, CheckCircle2, Copy, Download, KeyRound, ShieldAlert, Sparkles, UserRound } from 'lucide-react'
import { fetchAuthRecoveryStatus } from '../features/portfolio/portfolioApi'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryStatus, setRecoveryStatus] = useState({
    loading: true,
    recoveryEnabled: false,
    error: null,
  })
  const [copyState, setCopyState] = useState({
    status: 'idle',
    message: '',
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const container = useRef(null)
  const copyResetTimer = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".login-card", { y: -30, opacity: 0, duration: 0.6, ease: "power3.out" })
      .from(".form-element", { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.3")
  }, { scope: container })

  useEffect(() => {
    let active = true

    const loadRecoveryStatus = async () => {
      try {
        const data = await fetchAuthRecoveryStatus()
        if (!active) return

        setRecoveryStatus({
          loading: false,
          recoveryEnabled: Boolean(data?.recoveryEnabled),
          error: null,
        })
      } catch (statusError) {
        if (!active) return

        setRecoveryStatus({
          loading: false,
          recoveryEnabled: false,
          error: statusError?.response?.data?.error || statusError?.message || 'Unable to verify recovery status.',
        })
      }
    }

    loadRecoveryStatus()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        window.clearTimeout(copyResetTimer.current)
      }
    }
  }, [])

  const buildRecoveryChecklist = () => {
    return [
      'Admin Recovery Checklist',
      '1) Set backend env vars: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_RECOVERY_KEY, JWT_SECRET',
      '2) Save admin credentials + recovery key in your password manager',
      '3) Local emergency reset:',
      '   npm run admin:reset -- --username <new-username> --password "<new-strong-password>"',
      '4) Hosted emergency reset endpoint:',
      '   POST /api/auth/recover  (body: { recoveryKey, username, newPassword })',
      '5) Verify safety check endpoint:',
      '   GET /api/auth/recovery-status',
      '',
      `Current recovery status: ${recoveryStatus.recoveryEnabled ? 'Configured ✅' : 'Not configured ⚠️'}`,
    ].join('\n')
  }

  const showChecklistFeedback = (status, message) => {
    setCopyState({ status, message })
    if (copyResetTimer.current) {
      window.clearTimeout(copyResetTimer.current)
    }

    copyResetTimer.current = window.setTimeout(() => {
      setCopyState({ status: 'idle', message: '' })
    }, 2800)
  }

  const copyRecoveryChecklist = async () => {
    const checklist = buildRecoveryChecklist()

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(checklist)
        showChecklistFeedback('success', 'Recovery checklist copied.')
        return
      }

      const fallbackTextArea = document.createElement('textarea')
      fallbackTextArea.value = checklist
      fallbackTextArea.setAttribute('readonly', '')
      fallbackTextArea.style.position = 'absolute'
      fallbackTextArea.style.left = '-9999px'
      document.body.appendChild(fallbackTextArea)
      fallbackTextArea.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(fallbackTextArea)

      if (copied) {
        showChecklistFeedback('success', 'Recovery checklist copied.')
      } else {
        showChecklistFeedback('error', 'Copy failed. Please copy manually.')
      }
    } catch {
      showChecklistFeedback('error', 'Copy failed. Please copy manually.')
    }
  }

  const downloadRecoveryChecklist = () => {
    try {
      const checklist = buildRecoveryChecklist()
      const fileName = `admin-recovery-checklist-${new Date().toISOString().slice(0, 10)}.txt`
      const checklistBlob = new Blob([checklist], { type: 'text/plain;charset=utf-8' })
      const objectUrl = window.URL.createObjectURL(checklistBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = objectUrl
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      window.URL.revokeObjectURL(objectUrl)
      showChecklistFeedback('success', `Recovery checklist downloaded (${fileName}).`)
    } catch {
      showChecklistFeedback('error', 'Download failed. Please copy checklist instead.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const resultAction = await dispatch(login({ username, password }))
    if (login.fulfilled.match(resultAction)) {
      navigate('/admin')
    }
  }

  return (
    <div ref={container} className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="login-card w-full max-w-5xl overflow-hidden section-shell">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-600 to-violet-600 p-8 text-white md:block">
            <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-white/15 blur-2xl" />
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
              <Sparkles size={12} />
              Secure access
            </p>
            <h2 className="mt-5 text-3xl font-black leading-tight">Portfolio Control Center</h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              Sign in to manage profile content, projects, skills, and inbox operations from a single dashboard.
            </p>

            <div
              className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
                recoveryStatus.loading
                  ? 'border-white/30 bg-white/10 text-blue-50'
                  : recoveryStatus.recoveryEnabled
                    ? 'border-emerald-200/60 bg-emerald-500/20 text-emerald-50'
                    : 'border-amber-200/70 bg-amber-500/20 text-amber-50'
              }`}
            >
              {recoveryStatus.loading ? (
                <p>Checking recovery safety...</p>
              ) : recoveryStatus.recoveryEnabled ? (
                <p className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Recovery key is configured. Admin lockout recovery is available.
                </p>
              ) : (
                <p className="inline-flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Recovery key is not configured yet. Set ADMIN_RECOVERY_KEY to avoid future lockouts.
                </p>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-sm text-blue-50">
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white" />Update portfolio data instantly</li>
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white" />Handle contact inbox efficiently</li>
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white" />Run SMTP checks and delivery tests</li>
            </ul>
          </aside>

          <div className="p-6 sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 shadow-[0_10px_24px_rgba(59,130,246,0.12)] sm:h-16 sm:w-16">
                <ShieldAlert size={30} />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
              <p className="mt-2 text-sm text-slate-600">Sign in to manage your portfolio</p>

              <div
                className={`mt-3 rounded-2xl border px-3 py-2 text-left text-xs shadow-sm ${
                  recoveryStatus.loading
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : recoveryStatus.recoveryEnabled
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {recoveryStatus.loading ? (
                  'Checking account recovery status...'
                ) : recoveryStatus.recoveryEnabled ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Recovery is enabled for this environment.
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    Recovery key not configured. Ask admin to set ADMIN_RECOVERY_KEY.
                  </span>
                )}

                {recoveryStatus.error ? (
                  <p className="mt-1 font-medium">Status check issue: {recoveryStatus.error}</p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyRecoveryChecklist}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    <Copy size={12} />
                    Copy recovery checklist
                  </button>

                  <button
                    type="button"
                    onClick={downloadRecoveryChecklist}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    <Download size={12} />
                    Download .txt checklist
                  </button>

                  {copyState.status !== 'idle' ? (
                    <span className={`text-[11px] font-semibold ${copyState.status === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {copyState.message}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-element space-y-2 relative">
                <label className="text-sm font-semibold text-slate-700" htmlFor="username">Username</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <UserRound size={18} />
                  </span>
                  <input
                    id="username"
                    type="text"
                    required
                    className="soft-input pl-10"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-element space-y-2 relative">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <KeyRound size={18} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    className="soft-input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="form-element rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="form-element pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
