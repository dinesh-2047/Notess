import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { resourceApi } from '@/api/resources'

const emptyForm = { title: '', description: '', course: '', branch: '', type: 'note', tags: '' }

const AdminResourceUploadPage = () => {
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState({ file: null, preview: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      try {
        const { data } = await resourceApi.getBySlug(slug)
        const r = data.data.resource
        setForm({
          title: r.title || '',
          description: r.description || '',
          course: r.course || '',
          branch: r.branch || '',
          type: r.type || 'note',
          tags: (r.tags || []).join(', '),
        })
        setEditingId(r._id)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load resource')
      }
    }
    load()
  }, [slug])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!slug && !files.file) {
      toast.error('Attach the main PDF file')
      return
    }
    if (!form.description || form.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters')
      return
    }
    if (isSubmitting) return
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))
    if (files.file) payload.append('file', files.file)
    if (files.preview) payload.append('preview', files.preview)
    try {
      setIsSubmitting(true)
      if (editingId) {
        await resourceApi.update(editingId, payload)
        toast.success('Resource updated')
      } else {
        await resourceApi.create(payload)
        toast.success('Resource uploaded')
      }
      setForm(emptyForm)
      setFiles({ file: null, preview: null })
      setEditingId(null)
    } catch (error) {
      const serverErrors = error.response?.data?.errors
      if (Array.isArray(serverErrors) && serverErrors.length) {
        toast.error(serverErrors[0].message)
      } else {
        toast.error(error.response?.data?.message || 'Upload failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">{slug ? 'Edit resource' : 'Upload notes'}</p>
        <h1 className="text-3xl font-black">{slug ? 'Update resource' : 'Publish new notes/PYQs'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-4xl border border-slate-900 bg-slate-950/70 p-6 md:grid-cols-2">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
        />
        <input
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
        />
        <input
          placeholder="Branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          className="rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
        >
          <option value="note">Note</option>
          <option value="pyq">PYQ</option>
        </select>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="md:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
          rows={3}
        />
        <input
          placeholder="Comma separated tags"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="md:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm"
        />
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm">
          Upload PDF
          <input type="file" accept="application/pdf" onChange={(e) => setFiles({ ...files, file: e.target.files[0] })} />
        </label>
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm">
          Preview image (optional)
          <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, preview: e.target.files[0] })} />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`md:col-span-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
            isSubmitting
              ? 'cursor-not-allowed bg-slate-800 text-slate-400'
              : 'bg-linear-to-r from-emerald-400 to-blue-500 text-slate-950'
          }`}
        >
          {isSubmitting ? 'Saving…' : slug ? 'Update resource' : 'Publish resource'}
        </button>
      </form>
    </div>
  )
}

export default AdminResourceUploadPage