import { Test, TestingModule } from '@nestjs/testing'
import { SomethingController } from '@/something/something.controller'
import { SomethingService } from '@/something/something.service'

describe('SomethingController', () => {
  let somethingController: SomethingController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SomethingController],
      providers: [SomethingService],
    }).compile()

    somethingController = app.get<SomethingController>(SomethingController)
  })

  describe('getSomething', () => {
    it('should return message obj', () => {
      const result = somethingController.getSomething()
      expect(result).toEqual({
        message: 'Hello from SomethingService!',
      })
    })
  })
})
