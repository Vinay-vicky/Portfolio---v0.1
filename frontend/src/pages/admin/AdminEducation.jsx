import { useState } from 'react'
import { api } from '../../features/portfolio/portfolioApi'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import usePortfolioData from '../../features/portfolio/usePortfolioData'

function AdminEducation() {
  const { education, refreshData } = usePortfolioData()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleEdit = (edu) => {
    setEditingId(edu.id)
    setFormData(edu)
    setMessage(null)
  }

  const handleCreateNew = () => {
    setEditingId('new')
    setFormData({
      institution: '', years: '', level: '', field: '', location: '', description: ''
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
        await api.post('/portfolio/education', formData)
        setMessage({ type: 'success', text: 'Education added successfully!' })
      } else {
        await api.put(`/portfolio/education/${editingId}`, formData)
        setMessage({ type: 'success', text: 'Education updated successfully!' })
      }
      setEditingId(null)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save education' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return
    try {
      await api.delete(`/portfolio/education/${id}`)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete education' })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="section-shell-muted flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-eyebrow border-violet-200 bg-violet-50 text-violet-700">Learning history</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Education Details</h2>
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
          <h3 className="mb-4 text-lg font-black text-slate-900">{editingId === 'new' ? 'New Education' : 'Edit Education'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Institution Name</label>
              <input required name="institution" value={formData.institution || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Years (e.g. 2018 - 2022)</label>
              <input required name="years" value={formData.years || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Degree/Level</label>
              <input required name="level" value={formData.level || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Field of Study</label>
              <input required name="field" value={formData.field || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Location</label>
              <input required name="location" value={formData.location || ''} onChange={handleChange} className="soft-input mt-1" />
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
          {education.map(edu => (
            <div key={edu.id} className="surface-card flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900">{edu.institution}</h3>
                <p className="text-sm font-semibold text-violet-700">{edu.level} in {edu.field}</p>
                <p className="mt-1 text-xs text-slate-500">{edu.years}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(edu)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(edu.id)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {education.length === 0 && <p className="text-slate-500">No education entries found.</p>}
        </div>
      )}
    </div>
  )
}

export default AdminEducation
