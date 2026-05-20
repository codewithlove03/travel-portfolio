// src/pages/admin/ManageBucket.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Pencil, Trash2, CheckCircle, X, Save, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { Button, Input, Select, Textarea, PageLoader, ConfirmDialog, EmptyState, Badge } from '../../components/ui'

const CONTINENTS = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']

function BucketForm({ onSave, onCancel, initial = {} }) {
  const [form, setForm] = useState({
    name: initial.name || '', country: initial.country || '', continent: initial.continent || '',
    flag: initial.flag || '', description: initial.description || '', reason: initial.reason || '',
    priority: initial.priority || 'medium', tags: initial.tags?.join(', ') || '',
    targetYear: initial.targetYear || '', 'coordinates.lat': initial.coordinates?.lat || '',
    'coordinates.lng': initial.coordinates?.lng || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(initial.coverImage || '')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.name || !form.country) { toast.error('Name and country required'); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v))
    if (imageFile) fd.append('coverImage', imageFile)
    onSave(fd)
  }

  return (
    <div className="glass-card p-5 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input label="Place Name *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Machu Picchu" />
        <Input label="Country *" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="e.g. Peru" />
        <Input label="Flag Emoji" value={form.flag} onChange={(e) => set('flag', e.target.value)} placeholder="🇵🇪" />
        <Select label="Continent" value={form.continent} onChange={(e) => set('continent', e.target.value)}>
          <option value="">Select continent</option>
          {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
          <option value="high">🔥 Must Go (High)</option>
          <option value="medium">⭐ Want to Go (Medium)</option>
          <option value="low">🌙 Someday (Low)</option>
        </Select>
        <Input label="Target Year" type="number" value={form.targetYear} onChange={(e) => set('targetYear', e.target.value)} placeholder="2026" />
        <Input label="Tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="adventure, nature, hiking" />
        <Input label="Latitude" type="number" value={form['coordinates.lat']} onChange={(e) => set('coordinates.lat', e.target.value)} placeholder="-13.1631" />
        <Input label="Longitude" type="number" value={form['coordinates.lng']} onChange={(e) => set('coordinates.lng', e.target.value)} placeholder="-72.5450" />
      </div>
      <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className="mb-3" placeholder="What's special about this place?" />
      <Textarea label="Why I want to go" value={form.reason} onChange={(e) => set('reason', e.target.value)} rows={2} className="mb-4" placeholder="I've always dreamed of..." />

      <div className="mb-4">
        <label className="text-sm font-medium dark:text-ivory/70 text-void-600/70 block mb-2">Cover Image</label>
        <div className="flex items-center gap-3">
          {preview && <img src={preview} className="w-16 h-16 rounded object-cover" alt="" />}
          <label className="cursor-pointer flex items-center gap-2 text-sm dark:text-ivory/60 text-void-600/60 border dark:border-white/10 border-black/10 px-3 py-2 rounded-sm hover:border-amber/40 transition-colors">
            <Upload size={14} /> Upload image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if(f){setImageFile(f);setPreview(URL.createObjectURL(f))} }} />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button size="sm" onClick={submit}><Save size={14} /> Save</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}><X size={14} /> Cancel</Button>
      </div>
    </div>
  )
}

export default function ManageBucket() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const { data: items, isLoading } = useQuery('admin-bucket', () =>
    api.get('/bucket').then((r) => r.data.data)
  )

  const createMutation = useMutation((fd) => api.post('/bucket', fd, { headers: { 'Content-Type': 'multipart/form-data' } }), {
    onSuccess: () => { toast.success('Added!'); qc.invalidateQueries('admin-bucket'); setShowForm(false) },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })
  const updateMutation = useMutation(({ id, fd }) => api.put(`/bucket/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }), {
    onSuccess: () => { toast.success('Updated!'); qc.invalidateQueries('admin-bucket'); setEditItem(null) },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  })
  const deleteMutation = useMutation((id) => api.delete(`/bucket/${id}`), {
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries('admin-bucket') },
  })
  const completeMutation = useMutation((id) => api.put(`/bucket/${id}/complete`), {
    onSuccess: () => { toast.success('Marked as visited! 🎉'); qc.invalidateQueries('admin-bucket') },
  })

  const priorityBadge = { high: 'red', medium: 'amber', low: 'default' }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold dark:text-ivory text-void-600">Bucket List</h1>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditItem(null) }}><Plus size={16} /> Add Destination</Button>
      </div>

      {showForm && !editItem && (
        <BucketForm onSave={(fd) => createMutation.mutate(fd)} onCancel={() => setShowForm(false)} />
      )}

      {isLoading ? <PageLoader /> : items?.length === 0 ? (
        <EmptyState title="Bucket list is empty" description="Add dream destinations to get started." />
      ) : (
        <div className="glass-card overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/10 border-black/10 dark:text-ivory/40 text-void-600/40 font-mono text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Destination</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Country</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Priority</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <>
                  <tr key={item._id} className={`border-b dark:border-white/5 border-black/5 transition-colors ${item.isCompleted ? 'opacity-40' : 'dark:hover:bg-white/3 hover:bg-black/3'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.coverImage
                          ? <img src={item.coverImage} className="w-8 h-8 rounded object-cover" alt="" />
                          : <div className="w-8 h-8 rounded dark:bg-void-600 bg-stone flex items-center justify-center text-sm">{item.flag || '📍'}</div>
                        }
                        <div>
                          <span className="font-sans dark:text-ivory/90 text-void-600">{item.name}</span>
                          {item.isCompleted && <span className="ml-2 text-xs text-green-400 font-mono">✓ done</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell dark:text-ivory/50 text-void-600/50 font-mono text-xs">{item.country}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={priorityBadge[item.priority]}>{item.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!item.isCompleted && (
                          <Button variant="ghost" size="sm" title="Mark as visited" onClick={() => completeMutation.mutate(item._id)}>
                            <CheckCircle size={14} className="text-green-400" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => { setEditItem(item); setShowForm(false) }}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(item._id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {editItem?._id === item._id && (
                    <tr key={`edit-${item._id}`}>
                      <td colSpan={4} className="px-4 pb-4">
                        <BucketForm
                          initial={editItem}
                          onSave={(fd) => updateMutation.mutate({ id: editItem._id, fd })}
                          onCancel={() => setEditItem(null)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Bucket Item"
        message="This will permanently remove this destination from your bucket list."
        onConfirm={() => { deleteMutation.mutate(deleteId); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
