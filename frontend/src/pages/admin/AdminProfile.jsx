import { useState, useEffect } from 'react'
import { api } from '../../features/portfolio/portfolioApi'
import { Save } from 'lucide-react'

function AdminProfile({ profile, onUpdated }) {
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (profile) setFormData(profile)
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      await api.put('/portfolio/profile', formData)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      if (onUpdated) onUpdated()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'full_name', label: 'Full Name', type: 'text' },
    { name: 'role', label: 'Role/Title', type: 'text' },
    { name: 'tagline', label: 'Tagline', type: 'text' },
    { name: 'quote', label: 'Quote', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'github_url', label: 'GitHub URL', type: 'url' },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { name: 'whatsapp_url', label: 'WhatsApp URL', type: 'url' },
    { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
    { name: 'profile_image_url', label: 'Profile Image URL', type: 'text' },
    { name: 'resume_pdf_url', label: 'Resume PDF URL', type: 'text' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="section-shell-muted">
        <p className="section-eyebrow border-cyan-200 bg-cyan-50 text-cyan-700">Profile editor</p>
        <h2 className="mt-3 text-2xl font-black text-slate-900">Profile Settings</h2>
      </div>
      
      {message && (
        <div className={`surface-card ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="section-shell-muted space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium text-slate-600">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="soft-input"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="about_intro" className="text-sm font-medium text-slate-600">About Intro (Greeting)</label>
          <textarea
            id="about_intro"
            name="about_intro"
            rows={2}
            value={formData.about_intro || ''}
            onChange={handleChange}
            className="soft-input min-h-[96px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-slate-600">Short Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={formData.bio || ''}
            onChange={handleChange}
            className="soft-input min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="about_text" className="text-sm font-medium text-slate-600">Detailed About Text (Home & Resume Page)</label>
          <textarea
            id="about_text"
            name="about_text"
            rows={5}
            value={formData.about_text || ''}
            onChange={handleChange}
            className="soft-input min-h-[160px]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <Save size={18} />
            )}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProfile
