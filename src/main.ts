import { NestFactory } from '@nestjs/core'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, { cors: true })
  console.log(`Server listening at port ${process.env.PORT}`)

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Account Calendar API')
    .setDescription('가계부 캘린더 백엔드 API')
    .setVersion('1.0')
    .addTag('categories', '카테고리 관련 API')
    .addTag('users', '사용자 관련 API')
    .addTag('transactions', '수입 지출 관련 API')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: true,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 1, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // https only in production
        sameSite: 'lax',
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  })
  await app.listen(PORT)
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error)
  process.exit(1)
})
