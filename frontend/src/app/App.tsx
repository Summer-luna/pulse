import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppShell } from '@/components/AppShell'
import { SettingsLayout } from '@/components/SettingsLayout'
import { CustomerPage } from '@/pages/CustomerPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { IssuePage } from '@/pages/IssuePage'
import { IssuesPage } from '@/pages/IssuesPage'
import { LoginPage } from '@/pages/LoginPage'
import { MembersPage } from '@/pages/MembersPage'
import { ProjectIssuesTab } from '@/pages/ProjectIssuesTab'
import { ProjectOverviewTab } from '@/pages/ProjectOverviewTab'
import { ProjectPage } from '@/pages/ProjectPage'
import { ProjectReleasesTab } from '@/pages/ProjectReleasesTab'
import { ProjectRequestsTab } from '@/pages/ProjectRequestsTab'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ReleasePage } from '@/pages/ReleasePage'
import { ReleasePipelinePage } from '@/pages/ReleasePipelinePage'
import { ReleasesPage } from '@/pages/ReleasesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AuthProvider } from './AuthProvider'
import { DialogsProvider } from './DialogsProvider'
import { GuestOnly } from './GuestOnly'
import { RequireAdmin } from './RequireAdmin'
import { RequireAuth } from './RequireAuth'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, refetchOnWindowFocus: false, retry: 1 } },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route
                element={
                  <DialogsProvider>
                    <AppShell />
                  </DialogsProvider>
                }
              >
                <Route index element={<Navigate to="/issues" replace />} />
                <Route path="issues" element={<IssuesPage />} />
                <Route path="issues/:identifier" element={<IssuePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:projectId" element={<ProjectPage />}>
                  <Route index element={<Navigate to="issues" replace />} />
                  <Route path="overview" element={<ProjectOverviewTab />} />
                  <Route path="issues" element={<ProjectIssuesTab />} />
                  <Route path="releases" element={<ProjectReleasesTab />} />
                  <Route path="requests" element={<ProjectRequestsTab />} />
                </Route>
                <Route path="projects/:projectId/releases/:releaseId" element={<ReleasePage />} />
                <Route path="releases" element={<ReleasesPage />} />
                <Route path="release-pipelines/:pipelineId" element={<ReleasePipelinePage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:customerId" element={<CustomerPage />} />
                <Route path="*" element={<Navigate to="/issues" replace />} />
              </Route>
              <Route element={<RequireAdmin />}>
                <Route path="settings" element={<SettingsLayout />}>
                  <Route index element={<SettingsPage />} />
                  <Route path="members" element={<MembersPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
