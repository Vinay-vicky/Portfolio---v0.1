import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePageResponsive from './pages/HomePageResponsive'
import ResumePageResponsive from './pages/ResumePageResponsive'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'

function App() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col text-slate-800 selection:bg-blue-200">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Routes>
          <Route path="/" element={<HomePageResponsive />} />
          <Route path="/resume" element={<ResumePageResponsive />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
