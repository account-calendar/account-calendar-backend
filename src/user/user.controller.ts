import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'

import { UserService } from '@/user/user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  findAllUsers() {
    return this.userService.findAllUsers()
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUser(id)
  }
}
