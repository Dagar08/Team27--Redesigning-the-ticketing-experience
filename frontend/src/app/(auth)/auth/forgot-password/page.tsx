'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword(data.email)
      // Always show the same success state, whether or not the email is
      // registered — this avoids leaking which emails have accounts.
      setSent(true)
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('too-many-requests')) {
        toast.error('Too many attempts. Please wait a bit before trying again.')
      } else if (error instanceof Error && error.message.includes('invalid-email')) {
        toast.error('Please enter a valid email address.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  if (sent) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.2em] text-gp-green-400 uppercase">
            Race week access
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Check your email</h1>
          <p className="text-sm text-zinc-400">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
        </div>

        <Link
          href="/auth/signin"
          className="font-medium text-gp-gold-500 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.2em] text-gp-green-400 uppercase">
          Race week access
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Reset your password</h1>
        <p className="text-sm text-zinc-400">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full rounded-md border border-white/10 bg-asphalt-900 px-3 py-2.5 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-gp-green-500 focus:ring-2 focus:ring-gp-green-500/25 focus:outline-none aria-invalid:border-red-500"
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-400" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-gp-green-500 px-4 py-2.5 text-sm font-semibold text-asphalt-950 transition-colors hover:bg-gp-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gp-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-400">
        Remembered your password?{' '}
        <Link
          href="/auth/signin"
          className="font-medium text-gp-gold-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}