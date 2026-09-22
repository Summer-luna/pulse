import type { Label } from '@/domain/types'
import { labelRepository } from '@/repositories/label-repository'

class LabelService {
  list(): Promise<Label[]> {
    return labelRepository.list()
  }

  sortByName(labels: Label[]): Label[] {
    return [...labels].sort((a, b) => a.name.localeCompare(b.name))
  }

  /** Keeps the order of `ids`, ignoring unknown ones */
  pickByIds(labels: Label[], ids: string[]): Label[] {
    const byId = new Map(labels.map((label) => [label.id, label]))
    return ids.map((id) => byId.get(id)).filter((label): label is Label => Boolean(label))
  }
}

export const labelService = new LabelService()
