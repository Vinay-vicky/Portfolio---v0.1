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
  const container = useRef(null)

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
      <div className="login-card w-full max-w-md glass-card !p-6 sm:!p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 sm:h-16 sm:w-16">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage your portfolio</p>
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
                className="w-full rounded-xl border border-slate-300 bg-white p-3 pl-10 text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                className="w-full rounded-xl border border-slate-300 bg-white p-3 pl-10 text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
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
