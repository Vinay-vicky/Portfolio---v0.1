import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendContactMessage } from '../features/portfolio/portfolioSlice'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Send, Mail, MapPin, Phone } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function ContactPage() {
  const dispatch = useDispatch()
  const { contactStatus, contactError } = useSelector((state) => state.portfolio)
  const { profile } = usePortfolioData()
  const [form, setForm] = useState(initialForm)
  const container = useRef()

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(".page-header", { y: -30, opacity: 0, duration: 0.8 })
      .from(".contact-info", { x: -30, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".contact-form", { x: 30, opacity: 0, duration: 0.6 }, "-=0.6")
      .from(".form-element", { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
  }, { scope: container })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await dispatch(sendContactMessage(form)).unwrap()
      setForm(initialForm)
    } catch {
      // handled by Redux state
    }
  }

  return (
    <section ref={container} className="pb-10">
      <div className="page-header text-center max-w-2xl mx-auto mb-16">
        <h1 className="section-title text-gradient inline-block">Get in Touch</h1>
        <p className="mt-4 text-lg text-slate-400">Have a project in mind or just want to say hi? I'd love to hear from you. Fill out the form and I'll get back to you shortly.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="contact-info lg:col-span-1 space-y-6">
          <div className="glass-card !p-8 flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Details</h2>
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Email</p>
                <a href={`mailto:${profile?.email || 'vignesh@example.com'}`} className="mt-1 font-semibold text-slate-200 transition-colors hover:text-indigo-400">
                  {profile?.email || 'vignesh@example.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Phone</p>
                <a href={`tel:${profile?.phone || '+91 93614 77185'}`} className="mt-1 font-semibold text-slate-200 transition-colors hover:text-emerald-400">
                  {profile?.phone || '+91 93614 77185'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Location</p>
                <p className="mt-1 font-semibold text-slate-200">
                  {profile?.location || 'Chennai, Tamil Nadu, India'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form lg:col-span-2">
          <form className="glass-card !p-8" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="form-element space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="name">Full Name *</label>
                <input id="name" className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-element space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="email">Email Address *</label>
                <input id="email" className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
              <div className="form-element space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="phone">Phone Number</label>
                <input id="phone" className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
              </div>
              <div className="form-element space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="subject">Subject</label>
                <input id="subject" className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" name="subject" value={form.subject} onChange={handleChange} placeholder="How can I help you?" />
              </div>
              <div className="form-element md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="message">Message *</label>
                <textarea id="message" className="min-h-36 w-full rounded-xl border border-white/10 bg-slate-900/50 p-3 text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
              </div>
            </div>

            <div className="form-element mt-8 flex items-center justify-between flex-wrap-reverse gap-4">
              <div>
                {contactStatus === 'succeeded' && <p className="text-emerald-400 font-medium">Message sent successfully!</p>}
                {contactStatus === 'failed' && <p className="text-red-400 font-medium">{contactError}</p>}
              </div>
              
              <button
                type="submit"
                disabled={contactStatus === 'loading'}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:-translate-y-1 disabled:opacity-70 disabled:pointer-events-none"
              >
                {contactStatus === 'loading' ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="translate-y-[-1px]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
