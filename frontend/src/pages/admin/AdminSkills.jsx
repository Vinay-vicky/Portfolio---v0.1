import { useState } from 'react'
import { api } from '../../features/portfolio/portfolioApi'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import usePortfolioData from '../../features/portfolio/usePortfolioData'

function AdminSkills() {
  const { skills, refreshData } = usePortfolioData()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleEdit = (skill) => {
    setEditingId(skill.id)
    setFormData(skill)
    setMessage(null)
  }

  const handleCreateNew = () => {
    setEditingId('new')
    setFormData({
      category: '', name: '', sort_order: 0
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
        await api.post('/portfolio/skills', formData)
        setMessage({ type: 'success', text: 'Skill added successfully!' })
      } else {
        await api.put(`/portfolio/skills/${editingId}`, formData)
        setMessage({ type: 'success', text: 'Skill updated successfully!' })
      }
      setEditingId(null)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save skill' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return
    try {
      await api.delete(`/portfolio/skills/${id}`)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete skill' })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Skills Details</h2>
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
          <h3 className="text-lg font-bold text-white mb-4">{editingId === 'new' ? 'New Skill' : 'Edit Skill'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Category (e.g., Frontend, Backend, Tools)</label>
              <input required name="category" value={formData.category || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Skill Name (e.g., React, Node.js)</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Sort Order (Number, lower means first)</label>
              <input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/30 p-4 hover:border-white/10 transition-colors">
              <div>
                <h3 className="font-bold text-white text-sm">{skill.name}</h3>
                <p className="text-xs text-indigo-300">{skill.category}</p>
                <p className="text-[10px] text-slate-500 mt-1">Order: {skill.sort_order}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => handleEdit(skill)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-slate-500 col-span-full">No skills found.</p>}
        </div>
      )}
    </div>
  )
}

export default AdminSkills
