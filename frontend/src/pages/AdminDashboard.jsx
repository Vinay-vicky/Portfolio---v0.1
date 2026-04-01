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
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="glass-card !p-5 sticky top-24 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 mb-4 border-b border-white/10 pb-4">
            <LayoutDashboard className="text-indigo-400" />
            <h2 className="font-bold text-white text-lg">Admin CMS</h2>
          </div>
          
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="glass-card min-h-[600px]">
          {error && <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
