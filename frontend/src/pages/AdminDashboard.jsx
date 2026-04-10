import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import { fetchAdminMessages, runSmtpHealthCheck } from '../features/portfolio/portfolioApi'
import AdminProfile from './admin/AdminProfile'
import AdminExperiences from './admin/AdminExperiences'
import AdminEducation from './admin/AdminEducation'
import AdminSkills from './admin/AdminSkills'
import AdminProjects from './admin/AdminProjects'
import AdminMessages from './admin/AdminMessages'
import { LogOut, LayoutDashboard, User, Briefcase, GraduationCap, Code2, FolderGit2, MailCheck, Inbox, Bell, BellOff } from 'lucide-react'

function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, loading, error, refreshData } = usePortfolioData()
  const [activeTab, setActiveTab] = useState('profile')
  const [smtpStatus, setSmtpStatus] = useState({
    type: 'idle',
    message: '',
    details: '',
  })
  const [smtpReadiness, setSmtpReadiness] = useState({
    type: 'checking',
    label: 'Checking...',
    details: '',
  })
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [inboxSoundAlertsEnabled, setInboxSoundAlertsEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('adminInboxSoundAlerts') === 'true'
  })
  const unreadMessageRef = useRef(0)

  const playInboxAlertTone = () => {
    if (typeof window === 'undefined') return

    const WebAudioContext = window.AudioContext || window.webkitAudioContext
    if (!WebAudioContext) return

    try {
      const context = new WebAudioContext()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, context.currentTime)

      gainNode.gain.setValueAtTime(0.0001, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.14, context.currentTime + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.3)
      oscillator.onended = () => {
        context.close().catch(() => {})
      }
    } catch {
      // Ignore audio API errors (for example autoplay restrictions).
    }
  }

  const handleUnreadCountChange = (count) => {
    const normalizedCount = Number(count) || 0
    setUnreadMessageCount(normalizedCount)
    unreadMessageRef.current = normalizedCount
  }

  const handleToggleSoundAlerts = () => {
    const nextValue = !inboxSoundAlertsEnabled
    setInboxSoundAlertsEnabled(nextValue)

    if (nextValue) {
      playInboxAlertTone()
    }
  }

  const checkSmtpReadiness = async (options = {}) => {
    const { silent = false } = options

    if (!silent) {
      setSmtpReadiness({
        type: 'checking',
        label: 'Checking...',
        details: '',
      })
    }

    try {
      const response = await runSmtpHealthCheck({ sendTestEmail: false })
      const host = response?.connection?.host
      const port = response?.connection?.port

      setSmtpReadiness({
        type: 'ready',
        label: 'Ready',
        details: host && port ? `${host}:${port}` : 'SMTP connection verified',
      })
    } catch (err) {
      const responseData = err.response?.data
      const missingKeys = Array.isArray(responseData?.missingKeys) ? responseData.missingKeys : []

      setSmtpReadiness({
        type: 'warning',
        label: missingKeys.length > 0 ? 'Needs setup' : 'Issue detected',
        details:
          missingKeys.length > 0
            ? `Missing: ${missingKeys.join(', ')}`
            : responseData?.reason || responseData?.error || 'SMTP verification failed',
      })
    }
  }

  useEffect(() => {
    checkSmtpReadiness({ silent: true })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('adminInboxSoundAlerts', String(inboxSoundAlertsEnabled))
  }, [inboxSoundAlertsEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let isCancelled = false

    const syncUnreadCount = async (notifyOnIncrease = false) => {
      try {
        const response = await fetchAdminMessages({ status: 'unread', limit: 1 })
        if (isCancelled) return

        const nextUnread = Number(response?.stats?.unread ?? 0)
        const previousUnread = unreadMessageRef.current

        setUnreadMessageCount(nextUnread)
        unreadMessageRef.current = nextUnread

        if (notifyOnIncrease && inboxSoundAlertsEnabled && nextUnread > previousUnread) {
          playInboxAlertTone()
        }
      } catch {
        // Keep dashboard usable even if polling fails temporarily.
      }
    }

    syncUnreadCount(false)
    const intervalId = window.setInterval(() => {
      syncUnreadCount(true)
    }, 30000)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [inboxSoundAlertsEnabled])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSmtpTest = async () => {
    setSmtpStatus({
      type: 'loading',
      message: 'Checking SMTP connection and sending a probe email...',
      details: '',
    })
    setSmtpReadiness({
      type: 'checking',
      label: 'Checking...',
      details: '',
    })

    try {
      const response = await runSmtpHealthCheck({ sendTestEmail: true })
      setSmtpStatus({
        type: 'success',
        message: response.message || 'SMTP test completed successfully.',
        details: response.probe?.messageId ? `Message ID: ${response.probe.messageId}` : '',
      })
      setSmtpReadiness({
        type: 'ready',
        label: 'Ready',
        details: response.connection?.host && response.connection?.port
          ? `${response.connection.host}:${response.connection.port}`
          : 'SMTP connection verified',
      })
    } catch (err) {
      const responseData = err.response?.data
      const missingKeys = Array.isArray(responseData?.missingKeys) ? responseData.missingKeys : []

      setSmtpStatus({
        type: 'error',
        message: responseData?.reason || responseData?.error || 'SMTP test failed.',
        details: missingKeys.length > 0 ? `Missing: ${missingKeys.join(', ')}` : '',
      })

      setSmtpReadiness({
        type: 'warning',
        label: missingKeys.length > 0 ? 'Needs setup' : 'Issue detected',
        details:
          missingKeys.length > 0
            ? `Missing: ${missingKeys.join(', ')}`
            : responseData?.reason || responseData?.error || 'SMTP verification failed',
      })
    }
  }

  const smtpReadinessStyles =
    smtpReadiness.type === 'ready'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : smtpReadiness.type === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-blue-200 bg-blue-50 text-blue-700'

  const smtpReadinessDotStyles =
    smtpReadiness.type === 'ready'
      ? 'bg-emerald-500'
      : smtpReadiness.type === 'warning'
        ? 'bg-amber-500'
        : 'bg-blue-500'

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'experiences', label: 'Experiences', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'messages', label: 'Messages', icon: Inbox },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <AdminProfile profile={profile} onUpdated={refreshData} />
      case 'experiences': return <AdminExperiences />
      case 'education': return <AdminEducation />
      case 'skills': return <AdminSkills />
      case 'projects': return <AdminProjects />
      case 'messages': return <AdminMessages onUnreadCountChange={handleUnreadCountChange} />
      default: return null
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="w-full space-y-4">
        <div className="glass-card !p-4 sm:!p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-4">
            <LayoutDashboard className="text-blue-700" />
            <h2 className="text-lg font-black text-slate-900">Admin CMS</h2>
          </div>

          <div className={`mb-4 rounded-lg border px-3 py-2.5 ${smtpReadinessStyles}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide">SMTP status</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold">
                <span className={`h-2 w-2 rounded-full ${smtpReadinessDotStyles}`} />
                {smtpReadiness.label}
              </span>
            </div>
            {smtpReadiness.details ? (
              <p className="mt-2 break-words text-[11px] font-medium opacity-90">{smtpReadiness.details}</p>
            ) : null}
          </div>

          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:flex lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors sm:text-sm ${
                    isActive
                      ? 'border border-blue-200 bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-700' : ''} />
                  <span className="truncate">{tab.label}</span>
                  {tab.id === 'messages' && unreadMessageCount > 0 ? (
                    <span className={`ml-auto inline-flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'}`}>
                      {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Inbox sound alerts</p>
                <p className="mt-1 text-xs text-slate-600">
                  {inboxSoundAlertsEnabled
                    ? 'Enabled · plays a tone when unread messages increase.'
                    : 'Disabled · turn on to hear new-message alerts.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleSoundAlerts}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  inboxSoundAlertsEnabled
                    ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {inboxSoundAlertsEnabled ? <Bell size={13} /> : <BellOff size={13} />}
                {inboxSoundAlertsEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              onClick={handleSmtpTest}
              disabled={smtpStatus.type === 'loading'}
              className="mb-3 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-left text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="inline-flex items-center gap-2">
                {smtpStatus.type === 'loading' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-700" />
                ) : (
                  <MailCheck size={16} />
                )}
                {smtpStatus.type === 'loading' ? 'Testing SMTP...' : 'Test SMTP delivery'}
              </span>
            </button>

            {smtpStatus.type !== 'idle' ? (
              <div
                className={`mb-3 rounded-lg border px-3 py-2 text-xs ${
                  smtpStatus.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : smtpStatus.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-blue-200 bg-blue-50 text-blue-700'
                }`}
              >
                <p>{smtpStatus.message}</p>
                {smtpStatus.details ? <p className="mt-1 font-semibold">{smtpStatus.details}</p> : null}
              </div>
            ) : null}

            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <span className="inline-flex items-center gap-3">
                <LogOut size={18} />
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="glass-card min-h-[560px] !p-0">
          {error && <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
