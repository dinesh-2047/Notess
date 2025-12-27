import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const handleNavigate = () => {
    setOpen(false)
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 backdrop-blur-xl"
      style={{ backgroundColor: 'var(--surface-bg)', borderBottom: `1px solid var(--surface-border)` }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-[color:var(--text-primary)]">
        <Link to="/" className="group inline-flex items-center gap-2" onClick={handleNavigate}>
          <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Notess
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            beta
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" style={{ color: 'var(--text-secondary)' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition ${isActive ? 'text-emerald-300' : 'text-[color:var(--text-secondary)]'} hover:text-emerald-300`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border p-2 transition"
            style={{
              borderColor: 'var(--surface-border)',
              backgroundColor: 'var(--surface-bg)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/'}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={{
                  border: '1px solid rgba(52,211,153,0.5)',
                  backgroundColor: 'rgba(52,211,153,0.1)',
                  color: '#34d399',
                }}
              >
                {user?.role === 'admin' ? 'Admin' : 'Home'}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full px-4 py-2 text-sm font-semibold transition"
                style={{ border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="text-sm font-semibold transition"
                style={{ color: 'var(--text-secondary)' }}
              >
                Log in
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-linear-to-r from-emerald-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-slate-800/70 p-2 text-slate-100 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden"
            style={{ backgroundColor: 'var(--surface-bg)', borderTop: `1px solid var(--surface-border)` }}
          >
            <nav className="flex flex-col space-y-4 px-6 py-6 text-sm" style={{ color: 'var(--text-primary)' }}>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigate}
                  className="text-base"
                  style={{ color: location.pathname === item.to ? '#34d399' : 'var(--text-secondary)' }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
              </button>
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={handleNavigate}
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-center font-semibold text-emerald-300"
                  >
                    {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      handleNavigate()
                    }}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-center font-semibold text-slate-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/auth/login" onClick={handleNavigate} className="text-center font-semibold text-slate-200">
                    Log in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={handleNavigate}
                    className="rounded-lg bg-linear-to-r from-emerald-400 to-blue-500 px-4 py-2 text-center font-semibold text-slate-950"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
