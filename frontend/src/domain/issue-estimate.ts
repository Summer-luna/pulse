export const ISSUE_ESTIMATE_VALUES: readonly number[] = [0, 1, 2, 3, 5, 8]

export function estimateLabel(value: number | null): string {
  if (value === null) {
    return 'No estimate'
  }
  return value === 1 ? '1 Point' : `${value} Points`
}
