import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

import { UserService } from '@/user/user.service'

import type { User } from '@/entities/user.entity'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super()
  }

  serializeUser(user: User, done: (err: any, user: User) => void) {
    done(null, user)
  }

  async deserializeUser(user: User, done: (err: any, user: Partial<User>) => void) {
    const userData = await this.userService.findUser(user)
    const { data } = userData
    done(null, { id: data.userId, email: data.email })
  }
}
