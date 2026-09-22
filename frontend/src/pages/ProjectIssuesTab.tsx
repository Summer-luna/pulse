import { useParams } from 'react-router'
import { IssuesView } from '@/components/IssuesView'

export function ProjectIssuesTab() {
  const { projectId = '' } = useParams()

  return (
    <IssuesView
      scope={{ projectId }}
      emptyTitle="No issues in this project"
      emptyDescription="Create an issue, then break it down into sub-issues."
    />
  )
}
