import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import AdminProfile from './admin/AdminProfile'
import AdminExperiences from './admin/AdminExperiences'
import AdminEducation from './admin/AdminEducation'
import AdminSkills from './admin/AdminSkills'
import AdminProjects from './admin/AdminProjects'
import { LogOut, LayoutDashboard, User, Briefcase, GraduationCap, Code2, FolderGit2 } from 'lucide-react'

function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, loading, error, refreshData } = usePortfolioData()
  const [activeTab, setActiveTab] = useState('profile')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'experiences', label: 'Experiences', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <AdminProfile profile={profile} onUpdated={refreshData} />
      case 'experiences': return <AdminExperiences />
      case 'education': return <AdminEducation />
      case 'skills': return <AdminSkills />
      case 'projects': return <AdminProjects />
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
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
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
