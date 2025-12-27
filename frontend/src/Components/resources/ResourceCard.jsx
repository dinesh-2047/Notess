import { motion } from 'framer-motion'
import { Download, Share2 } from 'lucide-react'

const ResourceCard = ({ resource, onSelect }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="group flex flex-col rounded-3xl border p-5 text-left transition"
    style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
  >
    <div
      className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide"
      style={{ color: 'var(--text-secondary)' }}
    >
      <span
        className="rounded-full border px-3 py-1 text-[11px]"
        style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
      >
        {resource.type === 'pyq' ? 'PYQ' : 'Notes'}
      </span>
      <span
        className="rounded-full px-3 py-1"
        style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          color: '#0f766e',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        }}
      >
        Free
      </span>
    </div>

    {resource.previewUrl ? (
      <div
        className="mt-4 overflow-hidden rounded-2xl border"
        style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-bg)' }}
      >
        <img
          src={resource.previewUrl}
          alt={resource.title}
          className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    ) : (
      <div
        className="mt-4 h-40 rounded-2xl border"
        style={{
          borderColor: 'var(--surface-border)',
          background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.12), rgba(59, 130, 246, 0.1))',
        }}
      />
    )}

    <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
      {resource.title}
    </h3>
    <p className="mt-2 line-clamp-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      {resource.description}
    </p>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
      <span
        className="rounded-full border px-3 py-1"
        style={{ backgroundColor: 'rgba(148, 163, 184, 0.12)', borderColor: 'var(--surface-border)' }}
      >
        {resource.course}
      </span>
      <span
        className="rounded-full border px-3 py-1"
        style={{ backgroundColor: 'rgba(148, 163, 184, 0.12)', borderColor: 'var(--surface-border)' }}
      >
        {resource.branch}
      </span>
      {resource.tags?.slice(0, 2).map((tag) => (
        <span
          key={tag}
          className="rounded-full border px-3 py-1"
          style={{ backgroundColor: 'rgba(148, 163, 184, 0.12)', borderColor: 'var(--surface-border)' }}
        >
          #{tag}
        </span>
      ))}
    </div>
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm font-semibold text-teal-600 dark:text-teal-300">Free download</p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {resource.downloadCount ?? 0} downloads
      </p>
    </div>

    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={() => onSelect?.(resource)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 cursor-pointer"
      >
        <Download size={16} />
        Download
      </button>
      <button
        type="button"
        onClick={() => {
          const shareUrl = `${window.location.origin}/resources/${resource.slug || resource._id}`
          const shareText = `${resource.title} - ${resource.description?.slice(0, 100) || ''}`
          if (navigator.share) {
            navigator.share({ title: resource.title, text: shareText, url: shareUrl }).catch(() => {})
          } else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(shareUrl).catch(() => {})
          }
        }}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-200 hover:border-emerald-400 hover:text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 cursor-pointer"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
        aria-label="Share resource"
      >
        <Share2 size={16} />
      </button>
    </div>
  </motion.div>
)

export default ResourceCard
