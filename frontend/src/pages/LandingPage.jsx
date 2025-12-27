import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Shield, Sparkles } from 'lucide-react'
import { useResources } from '@/hooks/useResources'
import ResourceCard from '@/components/resources/ResourceCard'

const features = [
  {
    icon: Shield,
    title: 'Verified uploads',
    description: 'Every upload goes through academic and plagiarism checks before publishing.',
  },
  {
    icon: Sparkles,
    title: 'Motion-grade UI',
    description: 'Fluid interactions, quick filters, and responsive design optimized for study flow.',
  },
  {
    icon: CheckCircle2,
    title: 'Always free',
    description: 'All resources are free to download—no paywalls, no checkout, just instant access.',
  },
]

const LandingPage = () => {
  const { data, isLoading } = useResources({ limit: 6 })
  const resources = data?.items ?? []

  return (
    <div className="space-y-24 px-6 pb-24">
      <section
        className="relative overflow-hidden rounded-4xl border px-6 py-16 shadow-[0_0_120px_rgba(16,185,129,0.18)] sm:px-10"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
      >
        <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rotate-6 rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-14 bottom-8 h-64 w-64 -rotate-6 rounded-full bg-blue-500/18 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 text-left" style={{ color: 'var(--text-primary)' }}>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black leading-[1.05] sm:text-5xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Notess
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-200">Built for late-night crammers.</p>
              <p className="mt-1">Download curated notes and PYQs in one tap. Friendly anime UI, zero friction.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }} className="flex flex-wrap items-center gap-4">
              <Link
                to="/explore"
                className="rounded-full bg-linear-to-r from-emerald-400 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
              >
                Explore resources
              </Link>
              <Link
                to="/about"
                className="rounded-full px-6 py-3 text-base font-semibold"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
              >
                About Notess
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="flex flex-wrap gap-3 text-xs font-semibold"
            >
              <span
                className="rounded-full border px-3 py-2"
                style={{
                  borderColor: 'rgba(16, 185, 129, 0.35)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#0f766e',
                }}
              >
                Free forever
              </span>
              <span
                className="rounded-full border px-3 py-2"
                style={{
                  borderColor: 'rgba(59, 130, 246, 0.35)',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#1d4ed8',
                }}
              >
                One-tap downloads
              </span>
              <span
                className="rounded-full border px-3 py-2"
                style={{
                  borderColor: 'rgba(236, 72, 153, 0.35)',
                  backgroundColor: 'rgba(236, 72, 153, 0.12)',
                  color: '#be185d',
                }}
              >
                OTP protected
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            <div className="relative h-80 w-full max-w-md" style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}>
              <div
                className="absolute inset-0 rounded-3xl border shadow-[0_30px_80px_rgba(16,185,129,0.18)]"
                style={{
                  borderColor: 'rgba(16, 185, 129, 0.25)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14), rgba(59, 130, 246, 0.14))',
                }}
              />
              <div className="absolute -left-10 top-10 h-16 w-16 animate-bounce rounded-2xl bg-gradient-to-br from-emerald-400/60 to-blue-500/60 blur-lg" />
              <div className="absolute -right-10 bottom-12 h-16 w-16 animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-gradient-to-br from-pink-400/60 to-purple-500/60 blur-lg" />
              <div
                className="absolute inset-4 rounded-3xl border backdrop-blur"
                style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
              >
                <div className="flex h-full flex-col justify-center gap-5 px-6">
                  <div
                    className="rounded-2xl border p-3"
                    style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
                  >
                    <svg viewBox="0 0 200 140" className="h-40 w-full" role="img" aria-label="Animated study character">
                      <defs>
                        <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="desk" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0f172a" />
                          <stop offset="100%" stopColor="#1f2937" />
                        </linearGradient>
                      </defs>
                      <rect x="15" y="90" width="170" height="24" rx="6" fill="url(#desk)" />
                      <rect x="30" y="35" width="60" height="40" rx="12" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                      <rect x="110" y="30" width="50" height="30" rx="10" fill="#0ea5e9" opacity="0.85" />
                      <circle cx="70" cy="70" r="6" fill="#22c55e" />
                      <path d="M95 55 q10 -18 26 0" fill="#0f172a" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                      <path d="M96 58 q10 -14 24 0" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                      <path d="M100 64 q8 -8 16 0" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="104" cy="78" r="18" fill="url(#hair)" />
                      <rect x="94" y="74" width="20" height="16" rx="6" fill="#0f172a" />
                      <circle cx="100" cy="80" r="3" fill="#e5e7eb" />
                      <circle cx="114" cy="80" r="3" fill="#e5e7eb" />
                      <path d="M103 90 q5 4 10 0" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <rect x="60" y="102" width="80" height="10" rx="4" fill="#22d3ee" opacity="0.4">
                        <animate attributeName="x" values="60;62;60" dur="4s" repeatCount="indefinite" />
                      </rect>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Why learners switch</p>
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            Purpose-built for modern study squads
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Automated metadata, lightning filters, and OTP auth keep every branch organized.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border p-6"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
            >
              <Icon className="mb-4 h-10 w-10 text-emerald-500 dark:text-emerald-300" />
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Trending drops</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              Fresh uploads from toppers
            </h2>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            Browse all resources →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
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
              <ResourceCard key={resource._id} resource={resource} />
            ))}
            {!resources.length && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No resources yet. Be the first to upload!
              </p>
            )}
          </div>
        )}
      </section>

      <section id="pricing" className="mx-auto max-w-5xl">
        <div
          className="rounded-4xl border p-8 text-center shadow-[0_0_60px_rgba(34,197,94,0.15)]"
          style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Free forever</p>
          <h3 className="mt-4 text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            Community vault
          </h3>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Unlimited free downloads curated by contributors and verified faculty.
          </p>
          <ul className="mt-6 space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>• Unlimited branches</li>
            <li>• Inline preview reader</li>
            <li>• Brevo OTP to lock spam accounts</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
