interface Props {
  isLoading: boolean
  error: string | null
  notFound?: boolean
}

export function PageState({ isLoading, error, notFound = false }: Props) {
  if (isLoading) {
    return <p className="p-6 text-dim">Loading…</p>
  }
  if (error) {
    return <p className="p-6 text-danger">{error}</p>
  }
  return notFound ? <p className="p-6 text-dim">Not found</p> : null
}
