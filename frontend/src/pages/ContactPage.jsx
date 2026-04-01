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
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <div className="bg-gradient-primary-to-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg text-white">
          ✉
        </div>
        <h1 className="section-title text-slate-800">Get in touch</h1>
        <p className="mt-2 text-slate-600">Let&apos;s work together!</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-800" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
        <input className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-800" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-800" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
        <input className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-800" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
        <textarea className="min-h-36 w-full rounded-md border border-slate-300 bg-white p-3 text-slate-800" name="message" value={form.message} onChange={handleChange} placeholder="Your message" required />

        <button
          type="submit"
          disabled={contactStatus === 'loading'}
          className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
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
