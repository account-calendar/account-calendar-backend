import { APP_FILTER } from '@nestjs/core'
import { Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { LoggingMiddleware } from '@/middleware/logging.middleware'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { SomethingModule } from '@/something/something.module'

import type { MiddlewareConsumer } from '@nestjs/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SomethingModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
