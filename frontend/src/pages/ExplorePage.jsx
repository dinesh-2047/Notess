import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import ResourceFilters from '@/components/resources/ResourceFilters'
import ResourceCard from '@/components/resources/ResourceCard'
import { useResources } from '@/hooks/useResources'
import { resourceApi } from '@/api/resources'
import { useAuth } from '@/context/AuthContext'

const ExplorePage = () => {
  const [filters, setFilters] = useState({ limit: 12 })
  const { data, isLoading, refetch } = useResources(filters)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const resources = data?.items ?? []

  const ensureAuth = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download')
      navigate('/auth/login')
      return false
    }
    return true
  }

  const handleFreeDownload = async (resource) => {
    if (!ensureAuth()) return
    try {
      const { data: response } = await resourceApi.download(resource._id)
      window.open(response.data.url, '_blank', 'noopener')
      toast.success('Download started')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to generate download link')
    }
  }

  const handleResourceAction = (resource) => {
    handleFreeDownload(resource)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pb-24" style={{ color: 'var(--text-primary)' }}>
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Browse instantly</p>
        <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
          Notes & PYQs by course, branch, and semester
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Refreshed hourly. Filter everything in one responsive grid.
        </p>
      </div>
      <ResourceFilters filters={filters} onChange={setFilters} />
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 animate-pulse rounded-3xl"
              style={{ background: 'var(--surface-bg)', border: `1px solid var(--surface-border)` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} onSelect={handleResourceAction} />
          ))}
          {!resources.length && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No resources found for the selected filters.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ExplorePage
