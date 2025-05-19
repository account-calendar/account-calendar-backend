import { Controller, Get, Param, Query } from '@nestjs/common'
import { SomethingService } from '@/something/something.service'

@Controller('something')
export class SomethingController {
  constructor(private somethingService: SomethingService) {}

  @Get()
  getSomething(@Query('query') query?: string) {
    if (query) return this.somethingService.getSomethingWithQuery(query)
    else return this.somethingService.getSomething()
  }

  @Get('another')
  getAnother() {
    return this.somethingService.getAnother()
  }

  @Get(':params')
  getSomethingWithParams(@Param('params') param: string) {
    return this.somethingService.getSomethingWithParams(param)
  }
}
