import usePortfolioData from '../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../features/portfolio/portfolioApi'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Download, ArrowRight, MessageCircle } from 'lucide-react'
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'

function HomePage() {
  const { profile, loading, error } = usePortfolioData()
  const container = useRef()

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.5 })
      .from(".hero-quote", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
      .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero-bio", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-action", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.2")
      .from(".hero-image", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.5)" }, "-=1")
      .from(".about-section", { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")

  }, { scope: container, dependencies: [loading] })

  if (loading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error && !profile) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <section ref={container} className="space-y-20 pb-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="hero-badge inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] uppercase">
            {profile?.role || 'Full Stack Developer'}
          </div>
          <p className="hero-quote mt-6 text-xl italic text-slate-400 border-l-4 border-indigo-500/50 pl-4 py-1">
            "{profile?.quote}"
          </p>
          <h1 className="hero-title section-title text-gradient mt-6">
            {profile?.tagline || 'Crafting Innovative Digital Experiences'}
          </h1>
          <p className="hero-bio mt-6 max-w-2xl text-lg text-slate-300 leading-relaxed">
            {profile?.bio}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {profile?.resume_pdf_url ? (
              <a
                href={getAssetUrl(profile.resume_pdf_url)}
                target="_blank"
                rel="noreferrer"
                className="hero-action group flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:-translate-y-1"
              >
                <Download size={18} className="transition-transform group-hover:-translate-y-1" />
                Download Resume
              </a>
            ) : null}
            <Link to="/projects" className="hero-action group flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/50 px-6 py-3 font-semibold text-slate-200 backdrop-blur-sm transition-all hover:bg-slate-700 hover:text-white hover:-translate-y-1">
              View Projects
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="hero-image mx-auto w-full max-w-md relative mt-10 lg:mt-0">
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
           <div className="relative rounded-3xl border border-white/10 bg-darkCard/50 p-3 shadow-2xl backdrop-blur-sm">
            {profile?.profile_image_url ? (
                <img
                src={getAssetUrl(profile.profile_image_url)}
                alt={profile.full_name}
                className="h-auto w-full rounded-2xl object-cover shadow-inner"
                />
            ) : null}
           </div>
        </div>
      </div>

      <div className="about-section glass-card">
        <h2 className="text-gradient text-3xl font-black">{profile?.about_intro || 'About Me'}</h2>
        <div className="mt-6 text-slate-300 space-y-4 leading-relaxed whitespace-pre-line">
            {profile?.about_text}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
           <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5 transition-colors hover:border-white/10">
              <span className="block text-sm text-slate-400">Name</span>
              <span className="font-semibold text-slate-100">{profile?.full_name}</span>
           </div>
           <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5 transition-colors hover:border-white/10">
              <span className="block text-sm text-slate-400">Email</span>
              <span className="font-semibold text-slate-100 block truncate" title={profile?.email}>{profile?.email}</span>
           </div>
           <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5 transition-colors hover:border-white/10">
              <span className="block text-sm text-slate-400">Phone</span>
              <span className="font-semibold text-slate-100">{profile?.phone}</span>
           </div>
           <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5 transition-colors hover:border-white/10">
              <span className="block text-sm text-slate-400">Location</span>
              <span className="font-semibold text-slate-100">{profile?.location}</span>
           </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {profile?.whatsapp_url ? <a className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/30 hover:text-emerald-300" href={profile.whatsapp_url} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a> : null}
          {profile?.linkedin_url ? <a className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-500/30 hover:text-blue-300" href={profile.linkedin_url} target="_blank" rel="noreferrer"><FaLinkedin size={16}/> LinkedIn</a> : null}
          {profile?.github_url ? <a className="flex items-center gap-2 rounded-full border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-500/30 hover:text-white" href={profile.github_url} target="_blank" rel="noreferrer"><FaGithub size={16}/> GitHub</a> : null}
          {profile?.instagram_url ? <a className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-400 transition-colors hover:bg-pink-500/30 hover:text-pink-300" href={profile.instagram_url} target="_blank" rel="noreferrer"><FaInstagram size={16}/> Instagram</a> : null}
          {profile?.facebook_url ? <a className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300" href={profile.facebook_url} target="_blank" rel="noreferrer"><FaFacebook size={16}/> Facebook</a> : null}
        </div>
      </div>
    </section>
  )
}

export default HomePage
