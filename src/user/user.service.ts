import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
      const userData = await this.validateUser(email, password)

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

  async findUser(user?: Express.User & User): Promise<{ data: UserDto }> {
    if (!user) {
      throw new UnauthorizedException('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.')
    }

    const foundUser = await this.userRepository.findOne({ where: { id: user.id } })

    if (foundUser === null) {
      throw new NotFoundException('사용자를 찾을 수 없습니다')
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

  async onLogout(req: any): Promise<{ data: { message: string } }> {
    try {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err: any) => {
          if (err) {
            reject(new InternalServerErrorException('로그아웃 중 오류가 발생했습니다.'))
          } else {
            resolve()
          }
        })
      })

      return {
        data: {
          message: '로그아웃이 완료되었습니다.',
        },
      }
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalServerErrorException('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }

  async updateTargetExpense(userId: number, targetExpense: number): Promise<{ data: UserDto }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다')
      }

      user.targetExpense = targetExpense
      const updatedUser = await this.userRepository.save(user)

      const userInfo = plainToInstance(UserDto, updatedUser)

      return {
        data: userInfo,
      }
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalServerErrorException('지출제한 금액 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }
}
