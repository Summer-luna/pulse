import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-dim">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
