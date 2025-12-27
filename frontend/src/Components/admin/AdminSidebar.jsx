import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, LogOut, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/resources', label: 'Resources', icon: FileText },
  { to: '/admin/users', label: 'Users', icon: Users },
]

const AdminSidebar = ({ isMobile = false, onNavigate }) => {
  const { logout } = useAuth()
  const visibilityClasses = isMobile ? 'fixed inset-y-0 left-0 z-50 w-72 md:hidden' : 'hidden w-64 md:flex'
  const panelClasses = 'border-r'
  const handleNavigate = () => {
    if (isMobile && typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <aside
      className={`${visibilityClasses} flex flex-col p-6 ${panelClasses}`}
      style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
    >
      {isMobile && (
        <button
          type="button"
          aria-label="Close navigation"
          className="ml-auto mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
          onClick={handleNavigate}
        >
          <X size={18} />
        </button>
      )}
      <div className="mb-10">
        <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
          Notess Admin
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Control panel
        </p>
      </div>
      <nav className="flex flex-col gap-2">
        {adminLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300'
                  : 'hover:bg-emerald-500/10'
              }`
            }
            onClick={handleNavigate}
            style={{ color: 'var(--text-secondary)' }}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => {
          logout()
          handleNavigate()
        }}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
        style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  )
}

export default AdminSidebar
