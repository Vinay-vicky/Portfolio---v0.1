import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Clock3, Mail, MapPin, Phone, SendHorizontal } from 'lucide-react'
import { sendContactMessage } from '../features/portfolio/portfolioSlice'
import usePortfolioData from '../features/portfolio/usePortfolioData'
import usePageReveal from '../hooks/usePageReveal'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function ContactPage() {
  const dispatch = useDispatch()
  const { contactStatus, contactError, contactSuccessMessage } = useSelector((state) => state.portfolio)
  const { profile } = usePortfolioData()
  const [form, setForm] = useState(initialForm)
  const sectionRef = usePageReveal()

  const isPartialDelivery =
    contactStatus === 'succeeded' &&
    contactSuccessMessage?.toLowerCase().includes('could not be delivered')

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

  const contactHighlights = [
    {
      label: 'Email',
      value: profile?.email || 'yourmail@example.com',
      icon: Mail,
    },
    {
      label: 'Phone',
      value: profile?.phone || '+91 XXX XXX XXXX',
      icon: Phone,
    },
    {
      label: 'Location',
      value: profile?.location || 'Remote / India',
      icon: MapPin,
    },
    {
      label: 'Reply time',
      value: 'Usually within 24 hours',
      icon: Clock3,
    },
  ]

  if (contactStatus === 'loading' && !profile) {
    return (
      <section className="space-y-8 sm:space-y-10">
        <div className="section-shell animate-pulse space-y-5">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-200/80" />
          <div className="mx-auto h-8 w-52 rounded-full bg-slate-200/80" />
          <div className="mx-auto h-4 w-80 max-w-full rounded-full bg-slate-200/60" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="section-shell-muted animate-pulse space-y-4">
            <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            <div className="h-6 w-3/4 rounded-full bg-slate-200/70" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="h-20 rounded-[1.5rem] bg-slate-200/70" />
              <div className="h-20 rounded-[1.5rem] bg-slate-200/60" />
              <div className="h-20 rounded-[1.5rem] bg-slate-200/60" />
              <div className="h-20 rounded-[1.5rem] bg-slate-200/70" />
            </div>
          </div>

          <div className="section-shell animate-pulse space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-12 rounded-2xl bg-slate-200/70" />
              <div className="h-12 rounded-2xl bg-slate-200/70" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-12 rounded-2xl bg-slate-200/70" />
              <div className="h-12 rounded-2xl bg-slate-200/70" />
            </div>
            <div className="h-36 rounded-2xl bg-slate-200/70" />
            <div className="h-12 w-40 rounded-full bg-slate-200/80" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="space-y-8 sm:space-y-10">
      <div className="section-shell overflow-hidden text-center" data-animate-intro>
        <div className="bg-gradient-primary-to-secondary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-lg text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)]">
          <SendHorizontal size={18} />
        </div>
        <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">
          <SendHorizontal size={12} />
          Direct contact
        </p>
        <h1 className="section-title mt-4 text-slate-900">Get in touch</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Let&apos;s work together! Every message is stored in the inbox and routed to your configured email.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="section-shell-muted space-y-5" data-animate-reveal>
          <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">Contact details</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Let&apos;s discuss your next build</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Share your idea, timeline, and expectations. I&apos;ll reply with a practical plan and execution approach.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contactHighlights.map(({ label, value, icon: Icon }) => (
              <article key={label} className="surface-card">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Icon size={13} className="text-blue-600" />
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800 break-words">{value}</p>
              </article>
            ))}
          </div>

          <div className="surface-card">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">How it works</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />Submit your message and requirements</li>
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />Receive a response with execution plan</li>
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />Start implementation with milestones</li>
            </ul>
          </div>
        </aside>

        <form className="section-shell space-y-5" onSubmit={handleSubmit} aria-busy={contactStatus === 'loading'} data-animate-reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="soft-input" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            <input className="soft-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input className="soft-input" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            <input className="soft-input" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
          </div>

          <textarea className="soft-input min-h-36 resize-y" name="message" value={form.message} onChange={handleChange} placeholder="Your message" required />

          <button
            type="submit"
            disabled={contactStatus === 'loading'}
            className="btn-primary w-full gap-2 sm:w-auto disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-70"
          >
            <SendHorizontal size={15} />
            {contactStatus === 'loading' ? 'Sending...' : 'Send message'}
          </button>

          <div aria-live="polite" aria-atomic="true">
            {contactStatus === 'succeeded' ? (
              <p className={isPartialDelivery ? 'text-amber-600' : 'text-emerald-600'}>
                {contactSuccessMessage || 'Message sent successfully.'}
              </p>
            ) : null}
            {contactStatus === 'failed' ? <p className="text-red-600">{contactError}</p> : null}
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactPage
