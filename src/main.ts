import { NestFactory } from '@nestjs/core'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, { cors: true })
  console.log(`Server listening at port ${process.env.PORT}`)

  app.use(cookieParser())

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 1, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // https only in production
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
