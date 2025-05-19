import { Module } from '@nestjs/common'
import { SomethingController } from '@/something/something.controller'
import { SomethingService } from '@/something/something.service'

@Module({
  imports: [],
  controllers: [SomethingController],
  providers: [SomethingService],
  exports: [],
})
export class SomethingModule {}
