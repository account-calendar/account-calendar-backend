import { Catch, HttpException, HttpStatus } from '@nestjs/common'

import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status: HttpStatus = exception.getStatus()
    const timestamp = Date.now()

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp,
    })
  }
}
