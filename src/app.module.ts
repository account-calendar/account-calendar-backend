import { APP_FILTER } from '@nestjs/core'
import { Module, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { LoggingMiddleware } from '@/middleware/logging.middleware'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { getTypeOrmConfig } from '@/config/typeorm.config'
import { UserModule } from '@/user/user.module'
import { CategoryModule } from '@/category/category.module'
import { TransactionsModule } from '@/transactions/transactions.module'

import type { MiddlewareConsumer } from '@nestjs/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
    CategoryModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
