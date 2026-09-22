import { keyColor } from '@/lib/key-color'

interface Props {
  projectKey: string
  size?: number
}

export function ProjectBadge({ projectKey, size = 18 }: Props) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded font-semibold text-white"
      style={{ width: size, height: size, background: keyColor(projectKey), fontSize: size * 0.5 }}
    >
      {projectKey[0]}
    </span>
  )
}
