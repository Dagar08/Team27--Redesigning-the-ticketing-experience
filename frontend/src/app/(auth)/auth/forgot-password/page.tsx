'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import {
  buttonPrimary,
  displayTitle,
  eyebrow,
  fieldError,
  fieldInput,
  fieldLabel,
  inlineLink,
} from '@/lib/styles'

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
          <p className={eyebrow}>Race week access</p>
          <h1 className={`${displayTitle} text-3xl font-black text-white`}>Check your email</h1>
          <p className="text-sm text-zinc-300">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
        </div>

        <Link href="/auth/signin" className={inlineLink}>
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className={eyebrow}>Race week access</p>
        <h1 className={`${displayTitle} text-3xl font-black text-white`}>Reset your password</h1>
        <p className="text-sm text-zinc-300">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className={fieldLabel}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldInput}
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className={fieldError} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonPrimary} min-h-12 w-full`}
        >
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-300">
        Remembered your password?{' '}
        <Link href="/auth/signin" className={inlineLink}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
