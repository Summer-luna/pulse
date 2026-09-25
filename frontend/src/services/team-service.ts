import type { Team } from '@/domain/types'
import type { CreateTeamInput, TeamAccess, UpdateTeamInput } from '@/graphql/generated/graphql'
import { teamRepository } from '@/repositories/team-repository'

export interface TeamDraft {
  name: string
  key: string
  access: TeamAccess
}

const KEY_PATTERN = /^[A-Za-z]{2,5}$/

class TeamService {
  list(): Promise<Team[]> {
    return teamRepository.list()
  }

  create(draft: TeamDraft): Promise<Team> {
    return teamRepository.create(this.toCreateInput(draft))
  }

  update(id: string, input: UpdateTeamInput): Promise<Team> {
    return teamRepository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return teamRepository.remove(id)
  }

  join(id: string): Promise<Team> {
    return teamRepository.join(id)
  }

  leave(id: string): Promise<Team> {
    return teamRepository.leave(id)
  }

  emptyDraft(): TeamDraft {
    return { name: '', key: '', access: 'PUBLIC' }
  }

  suggestKey(name: string): string {
    const words = name.match(/[A-Za-z]+/g) ?? []
    const initials = words.length > 1 ? words.map((word) => word[0]).join('') : (words[0] ?? '')
    return initials.slice(0, 5).toUpperCase()
  }

  toCreateInput(draft: TeamDraft): CreateTeamInput {
    const name = draft.name.trim()
    const key = draft.key.trim()
    if (!name) {
      throw new Error('Team name is required')
    }
    if (!KEY_PATTERN.test(key)) {
      throw new Error('Team key must be 2-5 letters')
    }
    return {
      name,
      key: key.toUpperCase(),
      access: draft.access,
    }
  }
}

export const teamService = new TeamService()
