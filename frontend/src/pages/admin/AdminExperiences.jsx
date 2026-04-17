import { useState } from 'react'
import { api } from '../../features/portfolio/portfolioApi'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import usePortfolioData from '../../features/portfolio/usePortfolioData'

function AdminExperiences() {
  const { experiences, refreshData } = usePortfolioData()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleEdit = (exp) => {
    setEditingId(exp.id)
    setFormData(exp)
    setMessage(null)
  }

  const handleCreateNew = () => {
    setEditingId('new')
    setFormData({
      company: '', company_url: '', position: '', period_label: '', start_date: '', end_date: '', location: '', description: ''
    })
    setMessage(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      if (editingId === 'new') {
        await api.post('/portfolio/experiences', formData)
        setMessage({ type: 'success', text: 'Experience added successfully!' })
      } else {
        await api.put(`/portfolio/experiences/${editingId}`, formData)
        setMessage({ type: 'success', text: 'Experience updated successfully!' })
      }
      setEditingId(null)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save experience' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return
    try {
      await api.delete(`/portfolio/experiences/${id}`)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete experience' })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="section-shell-muted flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-eyebrow border-blue-200 bg-blue-50 text-blue-700">Timeline editor</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Experience Details</h2>
        </div>
        {!editingId && (
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>
      
      {message && (
        <div className={`surface-card ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {editingId ? (
        <form onSubmit={handleSubmit} className="section-shell-muted space-y-4">
          <h3 className="mb-4 text-lg font-black text-slate-900">{editingId === 'new' ? 'New Experience' : 'Edit Experience'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Position / Title</label>
              <input required name="position" value={formData.position || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Company Name</label>
              <input required name="company" value={formData.company || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Start Date</label>
              <input required name="start_date" value={formData.start_date || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">End Date</label>
              <input name="end_date" value={formData.end_date || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Custom Period Label (Overrides Dates if set)</label>
              <input name="period_label" value={formData.period_label || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Location</label>
              <input name="location" value={formData.location || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-slate-500">Description</label>
            <textarea required name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="soft-input mt-1 min-h-[140px]" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCancel} className="btn-secondary flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="surface-card flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900">{exp.position}</h3>
                <p className="text-sm font-semibold text-blue-700">{exp.company}</p>
                <p className="mt-1 text-xs text-slate-500">{exp.period_label || `${exp.start_date} - ${exp.end_date || 'Present'}`}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(exp)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-slate-500">No experiences found.</p>}
        </div>
      )}
    </div>
  )
}

export default AdminExperiences
