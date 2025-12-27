import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { Bell, Menu, ArrowLeft, Home, Moon, Sun } from 'lucide-react'
import AdminSidebar, { adminLinks } from '@/components/admin/AdminSidebar'
import { useTheme } from '@/context/ThemeContext'

const AdminLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {isMobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm md:hidden"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setIsMobileNavOpen(false)}
          />
          <AdminSidebar isMobile onNavigate={() => setIsMobileNavOpen(false)} />
        </>
      )}

      <div className="flex flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur"
          style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <ArrowLeft size={18} />
            </button>
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <Home size={16} /> Home
            </Link>
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border md:hidden"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Admin control</p>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notess dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-3 text-sm font-semibold lg:flex" style={{ color: 'var(--text-secondary)' }}>
              {adminLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 transition ${
                      isActive ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300' : 'hover:text-emerald-600'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
