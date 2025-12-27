import { motion } from 'framer-motion'
import { Sparkles, Shield, Clock, Zap, HeartHandshake } from 'lucide-react'

const values = [
  { title: 'Open by default', icon: Sparkles, desc: 'Notes, PYQs, and guides stay free forever. No gates, no upsells.' },
  { title: 'Trust first', icon: Shield, desc: 'Verified uploads, spam controls, and transparent moderation keep quality high.' },
  { title: 'Speed for students', icon: Zap, desc: 'Fast filters, lightweight UI, and download-ready links tuned for slow Wi‑Fi.' },
  { title: 'Built with care', icon: HeartHandshake, desc: 'Crafted with empathy for exam stress — clarity over clutter in every screen.' },
]

const milestones = [
  { year: '2023', title: 'Started Notess', detail: 'Scratch-built a tiny notes locker after seeing friends struggle for PDFs.' },
  { year: '2024', title: 'Launch with OTP login', detail: 'Shipped verified uploads, download protection, and admin dashboards.' },
  { year: '2025', title: 'Community vault', detail: 'All resources free forever with curated branches, PYQs, and notes.' },
]

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-24" style={{ color: 'var(--text-primary)' }}>
      <section
        className="relative overflow-hidden rounded-4xl border p-10 shadow-[0_0_80px_rgba(52,211,153,0.12)]"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">About</p>
          <h1 className="text-4xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
            Notess is a student-built library for zero-cost, verified notes.
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            We believe academic resources should flow as freely as curiosity. Notess keeps downloads free, keeps uploads vetted,
            and keeps the interface light so you spend time learning — not hunting for PDFs.
          </p>
        </motion.div>
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'rgba(16, 185, 129, 0.12)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rotate-12 rounded-full blur-3xl"
          style={{ background: 'rgba(59, 130, 246, 0.12)' }}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {values.map(({ title, icon: Icon, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-3xl border p-6"
            style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
          >
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-300">
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">{title}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {desc}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Story</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              Built during late-night study sprints
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {milestones.map((mile) => (
            <div
              key={mile.year}
              className="rounded-3xl border p-5"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">{mile.year}</p>
              <p className="mt-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {mile.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {mile.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
