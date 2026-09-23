import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/ui/EmptyState'

export function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader>
        <h1 className="font-medium">Settings</h1>
      </PageHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EmptyState title="Workspace settings" description="Coming soon." />
      </div>
    </div>
  )
}
