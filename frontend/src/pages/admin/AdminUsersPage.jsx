import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminApi } from '@/api/admin'

const AdminUsersPage = () => {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', course: '', branch: '', role: 'user', isVerified: false, password: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await adminApi.users()
      return data.data.users || []
    },
  })

  const { mutate: saveUser, isLoading: isSaving } = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateUser(id, payload),
    onSuccess: ({ data: response }) => {
      const updated = response.data.user
      queryClient.setQueryData(['admin-users'], (old = []) => old.map((u) => (u._id === updated._id ? updated : u)))
      toast.success('User updated')
      setSelected(null)
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errors
      if (Array.isArray(serverErrors) && serverErrors.length) {
        toast.error(serverErrors[0].message)
      } else {
        toast.error(error.response?.data?.message || 'Update failed')
      }
    },
  })

  const startEdit = (user) => {
    setSelected(user._id)
    setForm({
      fullName: user.fullName || '',
      email: user.email || '',
      course: user.course || '',
      branch: user.branch || '',
      role: user.role || 'user',
      isVerified: Boolean(user.isVerified),
      password: '',
    })
  }

  const submitEdit = () => {
    if (!selected) return
    const payload = { ...form }
    if (!payload.password) {
      delete payload.password
    }
    saveUser({ id: selected, payload })
  }

  return (
    <div className="space-y-6" style={{ color: 'var(--text-primary)' }}>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">User management</p>
        <h1 className="text-3xl font-black">Reset passwords, toggle roles & audit OTPs</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Review and update user role, course, branch, and verification.
        </p>
      </div>
      <div className="rounded-4xl border" style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}>
        <div
          className="grid items-center gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ gridTemplateColumns: '1.3fr 1.6fr 0.9fr 0.9fr 0.7fr 0.7fr', borderBottom: `1px solid var(--surface-border)`, color: 'var(--text-secondary)' }}
        >
          <span>Name</span>
          <span>Email</span>
          <span>Course</span>
          <span>Branch</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 animate-pulse rounded-2xl"
                style={{ background: 'var(--surface-bg)', border: `1px solid var(--surface-border)` }}
              />
            ))}
          </div>
        ) : data.length ? (
          data.map((user) => (
            <div
              key={user.email}
              className="grid items-center gap-4 px-6 py-4 text-sm last:border-0"
              style={{
                gridTemplateColumns: '1.3fr 1.6fr 0.9fr 0.9fr 0.7fr 0.7fr',
                borderBottom: `1px solid var(--surface-border)`,
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>{user.fullName}</span>
              <span className="truncate" title={user.email} style={{ color: 'var(--text-primary)' }}>
                {user.email}
              </span>
              <span>{user.course || '—'}</span>
              <span>{user.branch || '—'}</span>
              <span style={{ color: user.isVerified ? '#047857' : '#b45309' }}>
                {user.isVerified ? 'Verified' : 'Pending'}
              </span>
              <button
                type="button"
                onClick={() => startEdit(user)}
                className="justify-self-start rounded-lg border px-3 py-2 text-xs font-semibold"
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#0f766e' }}
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="px-6 py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            No user data available.
          </p>
        )}
      </div>

      {selected && (
        <div
          className="rounded-4xl border p-6"
          style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Editing user</p>
              <p className="text-xl font-bold">Update details</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
              type="email"
            />
            <input
              placeholder="Course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            />
            <input
              placeholder="Branch"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label
              className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
            >
              <input
                type="checkbox"
                checked={form.isVerified}
                onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              />
              Mark as verified
            </label>
            <input
              placeholder="New password (leave blank to keep)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
              type="password"
            />
          </div>
          <button
            type="button"
            onClick={submitEdit}
            disabled={isSaving}
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
              isSaving
                ? 'cursor-not-allowed'
                : 'bg-linear-to-r from-emerald-400 to-blue-500 text-slate-950'
            }`}
            style={
              isSaving
                ? { border: `1px solid var(--surface-border)`, background: 'var(--surface-bg)', color: 'var(--text-secondary)' }
                : undefined
            }
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
