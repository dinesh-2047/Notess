import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
  fullName: z.string().min(3, 'Enter your full name'),
  email: z.string().email('Provide a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, 'Must include upper, lower & number'),
  course: z.string().min(2, 'Course is required'),
  branch: z.string().min(2, 'Branch is required'),
})

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await registerUser(values)
      toast.success('OTP sent to your email')
      navigate('/auth/verify', { state: { email: values.email } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to register')
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 rounded-4xl border border-slate-900 bg-slate-950/80 p-8 text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Create account</p>
        <h1 className="mt-2 text-3xl font-black">Get curated PDFs, PYQs & uploads</h1>
        <p className="text-sm text-slate-400">Brevo OTP ensures every profile stays authentic.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Full name</label>
          <input
            {...register('fullName')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.fullName && <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>}
        </div>
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
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Course</label>
          <input
            {...register('course')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.course && <p className="mt-1 text-xs text-rose-400">{errors.course.message}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Branch</label>
          <input
            {...register('branch')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white"
          />
          {errors.branch && <p className="mt-1 text-xs text-rose-400">{errors.branch.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 rounded-2xl bg-linear-to-r from-emerald-400 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Continue with OTP'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-emerald-300">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
