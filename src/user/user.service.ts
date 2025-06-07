import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'

import { User } from '@/user/entities/user.entity'
import { UserDto } from '@/user/dto/user.dto'

import type { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<{ data: UserDto[] }> {
    const allUsersInfo = await this.userRepository.find()

    const allUsersInfoDto = allUsersInfo.map((user) => plainToInstance(UserDto, user))

    if (allUsersInfoDto.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND)
    }

    return {
      data: allUsersInfoDto,
    }
  }

  async findUser(id: number): Promise<{ data: UserDto | null }> {
    const foundUser = await this.userRepository.findOne({ where: { id } })

    if (foundUser === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const userInfo = plainToInstance(UserDto, foundUser)

    return {
      data: userInfo,
    }
  }
}
