'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import {
  buttonPrimary,
  buttonSecondary,
  displayTitle,
  eyebrow,
  fieldError,
  fieldInput,
  fieldLabel,
  inlineLink,
} from '@/lib/styles'

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading, signUpWithEmail, signInWithGoogle } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    if (!loading && !isSubmitting && user) {
      router.replace('/dashboard')
    }
  }, [loading, isSubmitting, user, router])

  // Inside the auth card, so a compact spinner rather than a full-page one.
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('popup-closed-by-user')) {
        return
      }
      toast.error('Google sign-in failed. Please try again.')
    }
  }

  const onSubmit = async (data: SignupInput) => {
    try {
      await signUpWithEmail(data.email, data.password, data.displayName)
      router.push('/auth/signin?verification=sent')
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('email-already-in-use')) {
        toast.error('An account with this email already exists')
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className={eyebrow}>Grid entry</p>
        <h1 className={`${displayTitle} text-3xl font-black text-white`}>Create account</h1>
        <p className="text-sm text-zinc-300">Set up your account before tickets go on sale.</p>
      </div>

      <button type="button" onClick={handleGoogleSignIn} className={`${buttonSecondary} w-full`}>
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-white/15" />
        <span className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">or</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="displayName" className={fieldLabel}>
            Name
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? 'display-name-error' : undefined}
            className={fieldInput}
            placeholder="Your full name"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p id="display-name-error" className={fieldError} role="alert">
              {errors.displayName.message}
            </p>
          )}
        </div>

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

        <div className="space-y-1.5">
          <label htmlFor="password" className={fieldLabel}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={fieldInput}
            placeholder="Min. 8 characters, 1 uppercase, 1 number"
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className={fieldError} role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className={fieldLabel}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className={fieldInput}
            placeholder="••••••••"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className={fieldError} role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonPrimary} min-h-12 w-full`}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-300">
        Already have an account?{' '}
        <Link href="/auth/signin" className={inlineLink}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
