import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  actions?: ReactNode
}

export function PageHeader({ children, actions }: Props) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-line px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
