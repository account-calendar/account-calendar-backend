import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'

import { UserService } from '@/user/user.service'

import { LocalAuthGuard } from '@/user/auth.guard'
import type { Request } from 'express'

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: { email: string; password: string }) {
    return await this.userService.onLogin(email, password)
  }
}
