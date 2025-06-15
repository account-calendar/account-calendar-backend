import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import bcrypt from 'bcrypt'

import { User } from '@/entities/user.entity'
import { UserDto } from '@/user/dto/user.dto'

import type { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onLogin(email: string, password: string) {
    try {
      const userData = await this.userRepository.findOne({ where: { email } })

      await this.validateUser(email, password)

      const userInfo = plainToInstance(UserDto, userData)

      return {
        data: userInfo,
      }
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalServerErrorException('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }

  async findUser(id: number): Promise<{ data: UserDto }> {
    const foundUser = await this.userRepository.findOne({ where: { id } })

    if (foundUser === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const userInfo = plainToInstance(UserDto, foundUser)

    return {
      data: userInfo,
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('이메일 또는 비밀번호가 일치하지 않습니다.')
    }

    return user
  }
}
