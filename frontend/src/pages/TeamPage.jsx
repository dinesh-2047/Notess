const profile = {
  name: 'Dinesh',
  handle: '@dinesh-2047',
  avatar: 'https://github.com/dinesh-2047.png',
  role: 'Builder of Notess',
  bio: 'Designs and codes the free notes library so students grab PDFs fast.',
  github: 'https://github.com/dinesh-2047',
  linkedin: 'https://www.linkedin.com/in/dinesh-2047',
}

const TeamPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pb-24" style={{ color: 'var(--text-primary)' }}>
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Team</p>
        <h1 className="text-4xl font-black">The humans behind Notess</h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          Small, fast, and obsessed with making study resources free and easy.
        </p>
      </div>

      <div
        className="rounded-4xl border p-6"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-28 w-28 rounded-3xl border object-cover"
            style={{ borderColor: 'var(--surface-border)' }}
          />
          <div className="space-y-1">
            <p className="text-2xl font-black">{profile.name}</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{profile.role}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {profile.bio}
            </p>
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>
              {profile.handle}
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-4 py-2 text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-500 dark:text-emerald-200"
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
              >
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-4 py-2 text-sky-700 transition hover:border-sky-400 hover:text-sky-500 dark:text-blue-200"
                style={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPage
