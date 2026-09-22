import type { User } from '@/domain/types'
import { userRepository } from '@/repositories/user-repository'

class UserService {
  list(): Promise<User[]> {
    return userRepository.list()
  }
}

export const userService = new UserService()
