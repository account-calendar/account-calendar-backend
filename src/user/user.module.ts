import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { User } from '@/entities/user.entity'
import { UserService } from '@/user/user.service'
import { UserController } from '@/user/user.controller'
import { LocalStrategy } from '@/user/local.strategy'
import { SessionSerializer } from '@/user/session.serializer'

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule.register({ session: true })],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, SessionSerializer],
})
export class UserModule {}
