import { Injectable, Logger } from '@nestjs/common'

import type { NestMiddleware } from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const { method, ip, originalUrl, hostname } = req
    const startTime = Date.now()

    res.on('finish', () => {
      const { statusCode, statusMessage } = res
      const responseTime = Date.now() - startTime

      const logMessage = `${method} | ${statusCode} | ${statusMessage} | ${originalUrl} | ${ip} | ${hostname} | ${responseTime}ms`

      if (statusCode >= 500) {
        this.logger.error(logMessage)
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage)
      } else {
        this.logger.log(logMessage)
      }
    })

    next()
  }
}
