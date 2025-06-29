import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { UserService } from '@/user/user.service'
import { AuthenticatedGuard, LocalAuthGuard } from '@/user/auth.guard'

import type { Request } from 'express'
import type { User } from '@/entities/user.entity'

class LoginDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}

@ApiTags('users')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인', description: '이메일과 비밀번호로 로그인합니다.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
  async login(@Body() { email, password }: LoginDto) {
    return await this.userService.onLogin(email, password)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용자 정보 조회', description: '로그인된 사용자의 정보를 세션을 통해 조회합니다.' })
  @ApiResponse({ status: HttpStatus.OK, description: '사용자 정보 조회 성공' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '사용자 정보가 없습니다.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '세션 인증 실패 (만료 || 세션이 없는 사용자)' })
  async getUser(@Req() req: Request & { user: User }) {
    const user = req.user
    return await this.userService.findUser(user)
  }
}
