import type { InvitedMember, User } from '@/domain/types'
import type { UserRole } from '@/graphql/generated/graphql'
import { userRepository } from '@/repositories/user-repository'

class UserService {
  list(): Promise<User[]> {
    return userRepository.list()
  }

  parseEmails(raw: string): string[] {
    return [...new Set(raw.split(/[\s,]+/).map((email) => email.trim().toLowerCase()).filter(Boolean))]
  }

  invite(rawEmails: string, role: UserRole): Promise<InvitedMember[]> {
    const emails = this.parseEmails(rawEmails)
    if (emails.length === 0) {
      throw new Error('Enter at least one email address')
    }
    return userRepository.invite({ emails, role })
  }

  remove(id: string): Promise<void> {
    return userRepository.remove(id)
  }
}

export const userService = new UserService()
