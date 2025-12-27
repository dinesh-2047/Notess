import { useAuth } from '@/context/AuthContext'

const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-8 text-white">
      <div className="rounded-4xl border border-slate-900 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black">{user?.fullName || user?.name}</h1>
        <p className="text-sm text-slate-400">{user?.email}</p>
      </div>
      <div className="rounded-4xl border border-slate-900 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black">All resources are free</h2>
        <p className="mt-2 text-sm text-slate-400">Browse the Explore page and download anything without payments.</p>
      </div>
    </div>
  )
}

export default DashboardPage
