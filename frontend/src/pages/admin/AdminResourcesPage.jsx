import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useResources } from '@/hooks/useResources'
import { resourceApi } from '@/api/resources'

const AdminResourcesPage = () => {
  const navigate = useNavigate()
  const { data, refetch, isLoading } = useResources({ limit: 200, status: 'all' })
  const resources = data?.items ?? []

  const handleDelete = async (id) => {
    try {
      await resourceApi.remove(id)
      toast.success('Removed')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete')
    }
  }

  const handleEdit = (resource) => {
    navigate(`/admin/resources/upload?slug=${resource.slug}`)
  }

  const handleToggleStatus = async (resource) => {
    const nextStatus = resource.status === 'published' ? 'archived' : 'published'
    try {
      await resourceApi.update(resource._id, { status: nextStatus })
      toast.success(`Resource ${nextStatus === 'published' ? 'published' : 'hidden'}`)
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update status')
    }
  }

  return (
    <div className="space-y-8" style={{ color: 'var(--text-primary)' }}>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Manage uploads</p>
        <h1 className="text-3xl font-black">Notes & PYQs</h1>
      </div>
      <div className="rounded-4xl border p-6" style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">All resources</h2>
          <button
            type="button"
            onClick={() => navigate('/admin/resources/upload')}
            className="rounded-xl border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#0f766e', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
          >
            Upload new
          </button>
        </div>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 animate-pulse rounded-2xl"
                style={{ background: 'var(--surface-bg)', border: `1px solid var(--surface-border)` }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className="flex flex-col gap-3 rounded-2xl border p-4"
                style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-secondary)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {resource.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {resource.course} • {resource.branch} • {resource.type?.toUpperCase()}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={
                      resource.status === 'published'
                        ? { backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#0f766e', border: '1px solid rgba(16, 185, 129, 0.35)' }
                        : { backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#b45309', border: '1px solid rgba(245, 158, 11, 0.35)' }
                    }
                  >
                    {resource.status}
                  </span>
                </div>
                {resource.previewUrl ? (
                  <img
                    src={resource.previewUrl}
                    alt={resource.title}
                    className="h-32 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-32 rounded-xl border"
                    style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-bg)' }}
                  />
                )}
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{resource.downloadCount ?? 0} downloads</span>
                  <span>{resource.tags?.slice(0, 2).map((t) => `#${t}`).join(' ')}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleEdit(resource)}
                    className="rounded-lg border px-3 py-2"
                    style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#0f766e' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(resource)}
                    className="rounded-lg border px-3 py-2"
                    style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
                  >
                    {resource.status === 'published' ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(resource._id)}
                    className="rounded-lg border px-3 py-2"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#b91c1c' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!resources.length && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No resources yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminResourcesPage
