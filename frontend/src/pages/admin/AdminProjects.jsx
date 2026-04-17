import { useState } from 'react'
import { api, getAssetUrl } from '../../features/portfolio/portfolioApi'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import usePortfolioData from '../../features/portfolio/usePortfolioData'

function AdminProjects() {
  const { projects, refreshData } = usePortfolioData()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleEdit = (project) => {
    setEditingId(project.id)
    setFormData(project)
    setMessage(null)
  }

  const handleCreateNew = () => {
    setEditingId('new')
    setFormData({
      title: '',
      description: '',
      tech_stack: '',
      project_url: '',
      image_url: '',
      sort_order: 0,
    })
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
        await api.post('/portfolio/projects', formData)
        setMessage({ type: 'success', text: 'Project added successfully!' })
      } else {
        await api.put(`/portfolio/projects/${editingId}`, formData)
        setMessage({ type: 'success', text: 'Project updated successfully!' })
      }
      setEditingId(null)
      if (refreshData) refreshData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save project' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await api.delete(`/portfolio/projects/${id}`)
      if (refreshData) refreshData()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete project' })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="section-shell-muted flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-eyebrow border-violet-200 bg-violet-50 text-violet-700">Featured builds</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Projects details</h2>
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
          <h3 className="mb-4 text-lg font-black text-slate-900">{editingId === 'new' ? 'New Project' : 'Edit Project'}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-500">Project Title</label>
              <input required name="title" value={formData.title || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Sort Order</label>
              <input type="number" required name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Tech Stack (Comma Separated)</label>
              <input required name="tech_stack" value={formData.tech_stack || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Project URL</label>
              <input name="project_url" value={formData.project_url || ''} onChange={handleChange} className="soft-input mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-500">Image Asset URL</label>
              <input name="image_url" value={formData.image_url || ''} onChange={handleChange} className="soft-input mt-1" />
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
          {projects.map((project) => (
            <article key={project.id} className="surface-card overflow-hidden">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                    {project.image_url ? (
                      <img src={getAssetUrl(project.image_url)} alt={project.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No Image</div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-black text-slate-900">{project.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-violet-700">{project.tech_stack}</p>
                    <p className="mt-1 text-xs text-slate-500">Order: {project.sort_order}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 px-4 pb-4 md:pb-0">
                  <button onClick={() => handleEdit(project)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="rounded-full p-2 text-slate-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {projects.length === 0 ? <p className="text-slate-500">No projects found.</p> : null}
        </div>
      )}
    </div>
  )
}

export default AdminProjects
