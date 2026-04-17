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
    setFormData({ category: '', name: '', sort_order: 0 })
    setMessage(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete skill' })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="section-shell-muted flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-eyebrow border-cyan-200 bg-cyan-50 text-cyan-700">Capabilities</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Skills Details</h2>
        </div>

        {!editingId ? (
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add New
          </button>
        ) : null}
      </div>

      {message ? (
        <div className={`surface-card ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      ) : null}

      {editingId ? (
        <form onSubmit={handleSubmit} className="section-shell-muted space-y-4">
          <h3 className="mb-4 text-lg font-black text-slate-900">{editingId === 'new' ? 'New Skill' : 'Edit Skill'}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-500">Category</label>
              <input required name="category" value={formData.category || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Skill Name</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Sort Order</label>
              <input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="soft-input mt-1" />
            </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <article key={skill.id} className="surface-card flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">{skill.name}</h3>
                <p className="text-xs font-semibold text-cyan-700">{skill.category}</p>
                <p className="mt-1 text-[10px] text-slate-500">Order: {skill.sort_order}</p>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button onClick={() => handleEdit(skill)} className="rounded-full p-1.5 text-slate-500 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="rounded-full p-1.5 text-slate-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}

          {skills.length === 0 ? <p className="col-span-full text-slate-500">No skills found.</p> : null}
        </div>
      )}
    </div>
  )
}

export default AdminSkills
