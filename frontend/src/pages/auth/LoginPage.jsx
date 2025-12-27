import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 rounded-4xl border border-slate-900 bg-slate-950/80 p-8 text-white">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Welcome back</p>
        <h1 className="text-3xl font-black">Sign in to Notess</h1>
        <p className="text-sm text-slate-400">Secure OTP-backed sign in for curated resources.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            {...register('email')}
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input
            type="password"
            {...register('password')}
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-linear-to-r from-emerald-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        No account?{' '}
        <Link to="/auth/register" className="text-emerald-300">
          Join now
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
