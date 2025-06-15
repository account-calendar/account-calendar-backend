import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: any): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = (await super.canActivate(context)) as boolean
      const request = context.switchToHttp().getRequest()
      await super.logIn(request) // 세션 저장
      return result
    } catch (err: unknown) {
      console.error('Authentication error:', err)
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.')
    }
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    return req.isAuthenticated()
  }
}
