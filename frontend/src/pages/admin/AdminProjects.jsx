import { useState } from 'react'
import { api } from '../../features/portfolio/portfolioApi'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import usePortfolioData from '../../features/portfolio/usePortfolioData'
import { getAssetUrl } from '../../features/portfolio/portfolioApi'

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
      title: '', description: '', tech_stack: '', project_url: '', image_url: '', sort_order: 0
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
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete project' })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Projects details</h2>
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
          <h3 className="text-lg font-bold text-white mb-4">{editingId === 'new' ? 'New Project' : 'Edit Project'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Project Title</label>
              <input required name="title" value={formData.title || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Sort Order (lower is first)</label>
              <input type="number" required name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Tech Stack (Comma Separated)</label>
              <input required name="tech_stack" value={formData.tech_stack || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Project URL (Live Link/GitHub)</label>
              <input name="project_url" value={formData.project_url || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-400">Image Asset URL (e.g. /legacy-assets/img/project1.jpg)</label>
              <input name="image_url" value={formData.image_url || ''} onChange={handleChange} className="w-full rounded-lg border border-white/5 bg-slate-800 p-2 text-white mt-1 text-sm focus:border-indigo-500" />
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
          {projects.map(project => (
            <div key={project.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/30 overflow-hidden hover:border-white/10 transition-colors">
              <div className="flex flex-1 items-center gap-4">
                <div className="h-24 w-32 shrink-0 bg-slate-800">
                   {project.image_url ? 
                     <img src={getAssetUrl(project.image_url)} alt={project.title} className="h-full w-full object-cover" /> 
                     : <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">No Image</div>
                   }
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-white">{project.title}</h3>
                  <p className="text-xs text-indigo-300 mt-1 line-clamp-1">{project.tech_stack}</p>
                  <p className="text-xs text-slate-400 mt-1">Order: {project.sort_order}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 pr-4">
                <button onClick={() => handleEdit(project)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-slate-500">No projects found.</p>}
        </div>
      )}
    </div>
  )
}

export default AdminProjects
