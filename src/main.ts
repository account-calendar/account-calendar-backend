import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, { cors: true })
  console.log(`Server listening at port ${process.env.PORT}`)

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  })
  await app.listen(PORT)
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error)
  process.exit(1)
})
