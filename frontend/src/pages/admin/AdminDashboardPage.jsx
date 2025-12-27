import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await adminApi.stats()
      return data.data
    },
  })

  const cards = [
    { title: 'Total resources', value: data?.totalResources ?? 0 },
    { title: 'Total downloads', value: data?.totalDownloads ?? 0 },
    { title: 'Active branches', value: data?.activeBranches ?? 0 },
    { title: 'Total users', value: data?.totalUsers ?? 0 },
  ]

  const recent = data?.recentResources ?? []

  return (
    <div className="space-y-8" style={{ color: 'var(--text-primary)' }}>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Control center</p>
        <h1 className="text-3xl font-black">Admin dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Monitor uploads, QA resources, and manage branches.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border p-6"
            style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {card.title}
            </p>
            <p className="mt-3 text-3xl font-black">{isLoading ? '—' : card.value}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-4xl border p-6"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Recent resources
          </p>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Latest 5 entries
          </span>
        </div>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 animate-pulse rounded-2xl"
                style={{ background: 'var(--surface-bg)', border: `1px solid var(--surface-border)` }}
              />
            ))}
          </div>
        ) : recent.length ? (
          <div className="mt-4 divide-y" style={{ borderColor: 'var(--surface-border)' }}>
            {recent.map((resource) => (
              <div key={resource._id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{resource.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {resource.course} • {resource.branch}
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {resource.downloadCount ?? 0} downloads
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            No resources yet.
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
