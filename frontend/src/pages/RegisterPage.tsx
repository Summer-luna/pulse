import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/app/auth-context'
import { errorMessage } from '@/lib/error-message'
import { authService, type RegisterDraft } from '@/services/auth-service'

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<RegisterDraft>(() => authService.emptyRegisterDraft())
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await auth.register(draft)
      navigate('/issues', { replace: true })
    } catch (caught) {
      setError(errorMessage(caught) ?? 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-full items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-line bg-panel p-6">
        <div className="mb-6 flex items-center gap-2 font-medium">
          <span className="flex size-6 items-center justify-center rounded bg-accent text-sm font-bold text-white">L</span>
          Linear Clone
        </div>
        <h1 className="mb-4 text-lg font-semibold">Create your account</h1>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-dim">
            Name
            <input
              autoFocus
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Ada Lovelace"
              maxLength={80}
              className="field"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-dim">
            Email
            <input
              type="email"
              value={draft.email}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              placeholder="you@example.com"
              className="field"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-dim">
            Password
            <input
              type="password"
              value={draft.password}
              onChange={(event) => setDraft({ ...draft, password: event.target.value })}
              placeholder="At least 8 characters"
              minLength={8}
              className="field"
              required
            />
          </label>
        </div>
        {error && <p className="mt-3 text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary mt-5 w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="mt-4 text-center text-dim">
          Already have an account?{' '}
          <Link to="/login" className="text-ink hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
