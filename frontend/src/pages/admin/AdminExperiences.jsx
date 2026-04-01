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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Experience Details</h2>
        {!editingId && (
          <button onClick={handleCreateNew} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {editingId ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4">{editingId === 'new' ? 'New Experience' : 'Edit Experience'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Position / Title</label>
              <input required name="position" value={formData.position || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Company Name</label>
              <input required name="company" value={formData.company || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Start Date</label>
              <input required name="start_date" value={formData.start_date || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">End Date</label>
              <input name="end_date" value={formData.end_date || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Custom Period Label (Overrides Dates if set)</label>
              <input name="period_label" value={formData.period_label || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Location</label>
              <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-slate-400">Description</label>
            <textarea required name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCancel} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5">
              <X size={16} /> Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/30 p-5 hover:border-white/10 transition-colors">
              <div>
                <h3 className="font-bold text-white">{exp.position}</h3>
                <p className="text-sm text-indigo-300">{exp.company}</p>
                <p className="text-xs text-slate-500 mt-1">{exp.period_label || `${exp.start_date} - ${exp.end_date || 'Present'}`}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(exp)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
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
