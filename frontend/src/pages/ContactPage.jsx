import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SendHorizontal } from 'lucide-react'
import { sendContactMessage } from '../features/portfolio/portfolioSlice'
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

  return (
    <section ref={sectionRef} className="mx-auto max-w-3xl space-y-5">
      <div className="glass-card text-center" data-animate-intro>
        <div className="bg-gradient-primary-to-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg text-white shadow-md shadow-blue-200">
          <SendHorizontal size={18} />
        </div>
        <h1 className="section-title text-slate-900">Get in touch</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Let&apos;s work together! Every message is saved to the database and sent to your configured inbox.</p>
      </div>

      <form className="glass-card space-y-4" onSubmit={handleSubmit} aria-busy={contactStatus === 'loading'} data-animate-reveal>
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
    </section>
  )
}

export default ContactPage
