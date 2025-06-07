import type { ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

const isProduction = process.env.NODE_ENV === 'production'

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', 'root'),
  database: configService.get('DB_DATABASE', 'account_calendar'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE', !isProduction) === 'true',
})
