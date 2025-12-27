const Footer = () => (
  <footer className="border-t" style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}>
    <div
      className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between"
      style={{ color: 'var(--text-secondary)' }}
    >
      <div>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Notess
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Smarter way to study & share premium notes.
        </p>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        © {new Date().getFullYear()} Notess. Crafted for learners.
      </p>
    </div>
  </footer>
)

export default Footer
