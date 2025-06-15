import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

import { UserService } from '@/user/user.service'

import type { User } from '@/entities/user.entity'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super()
  }

  serializeUser(user: User, done: (err: any, userId: number) => void) {
    done(null, user.id)
  }

  async deserializeUser(userId: number, done: (err: any, user: Partial<User>) => void) {
    const user = await this.userService.findUser(userId)
    const { data } = user
    done(null, { id: data.userId, email: data.email })
  }
}
