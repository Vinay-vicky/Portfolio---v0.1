import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authSlice'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ShieldAlert, KeyRound, UserRound } from 'lucide-react'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const container = useRef()

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".login-card", { y: -30, opacity: 0, duration: 0.6, ease: "power3.out" })
      .from(".form-element", { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.3")
  }, { scope: container })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const resultAction = await dispatch(login({ username, password }))
    if (login.fulfilled.match(resultAction)) {
      navigate('/admin')
    }
  }

  return (
    <div ref={container} className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="login-card w-full max-w-md glass-card !p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-element space-y-2 relative">
            <label className="text-sm font-medium text-slate-300" htmlFor="username">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <UserRound size={18} />
              </span>
              <input
                id="username"
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 pl-10 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-element space-y-2 relative">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <KeyRound size={18} />
              </span>
              <input
                id="password"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 pl-10 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="form-element p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="form-element pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 disabled:opacity-70 disabled:pointer-events-none hover:-translate-y-0.5"
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
  )
}

export default LoginPage
