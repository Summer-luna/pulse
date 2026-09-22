import { describe, expect, it } from 'vitest'
import type { Label } from '@/domain/types'
import { labelService } from './label-service'

function label(id: string, name: string): Label {
  return { id, name, color: '#5e6ad2' }
}

describe('labelService', () => {
  const labels = [label('b', 'Improvement'), label('a', 'Bug'), label('c', 'Feature')]

  it('sorts labels by name', () => {
    expect(labelService.sortByName(labels).map((l) => l.name)).toEqual(['Bug', 'Feature', 'Improvement'])
  })

  it('picks labels in the order of the given ids and drops unknown ones', () => {
    expect(labelService.pickByIds(labels, ['c', 'a', 'missing']).map((l) => l.id)).toEqual(['c', 'a'])
  })

  it('returns an empty list when no ids are given', () => {
    expect(labelService.pickByIds(labels, [])).toEqual([])
  })
})
