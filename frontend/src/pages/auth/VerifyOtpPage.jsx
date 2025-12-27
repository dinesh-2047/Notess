import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
  email: z.string().email('Email required'),
  otp: z.string().length(6, 'Enter the 6-digit code'),
})

const VerifyOtpPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { verifyOtp, resendOtp } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: state?.email || '',
    },
  })

  const onSubmit = async (values) => {
    try {
      await verifyOtp(values)
      toast.success('Account verified!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    }
  }

  const handleResend = async () => {
    const email = state?.email
    if (!email) {
      toast.error('Enter your email first')
      return
    }
    try {
      await resendOtp({ email })
      toast.success('OTP resent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to resend')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 rounded-4xl border border-slate-900 bg-slate-950/80 p-8 text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Verify email</p>
        <h1 className="text-3xl font-black">Enter the OTP we emailed you</h1>
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
          <label className="text-sm text-slate-300">OTP</label>
          <input
            type="text"
            maxLength={6}
            {...register('otp')}
            autoComplete="one-time-code"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center text-2xl tracking-[0.4em]"
          />
          {errors.otp && <p className="mt-1 text-xs text-rose-400">{errors.otp.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-linear-to-r from-emerald-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {isSubmitting ? 'Verifying…' : 'Verify & continue'}
        </button>
      </form>
      <button type="button" onClick={handleResend} className="text-sm font-semibold text-emerald-300">
        Resend OTP
      </button>
    </div>
  )
}

export default VerifyOtpPage
