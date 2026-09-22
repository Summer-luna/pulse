import type { Progress } from '@/domain/types'

export function progressPercent(progress: Progress | null | undefined): number {
  if (!progress || progress.total === 0) {
    return 0
  }
  return Math.round((progress.completed / progress.total) * 100)
}
