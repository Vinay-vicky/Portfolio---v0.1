import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendContactMessage } from '../features/portfolio/portfolioSlice'

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
  const [form, setForm] = useState(initialForm)

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
    <section className="mx-auto max-w-3xl glass-card">
      <div className="text-center">
        <div className="bg-gradient-primary-to-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg text-white shadow-md shadow-blue-200">
          ✉
        </div>
        <h1 className="section-title text-slate-900">Get in touch</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Let&apos;s work together!</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
          className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {contactStatus === 'loading' ? 'Sending...' : 'Send message'}
        </button>

        {contactStatus === 'succeeded' && <p className="text-emerald-600">Message sent successfully.</p>}
        {contactStatus === 'failed' && <p className="text-red-600">{contactError}</p>}
      </form>
    </section>
  )
}

export default ContactPage
