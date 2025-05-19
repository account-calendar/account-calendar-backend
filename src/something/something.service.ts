import { Injectable } from '@nestjs/common'

@Injectable()
export class SomethingService {
  getSomething() {
    return {
      message: 'Hello from SomethingService!',
    }
  }

  getSomethingWithParams(params: string) {
    return {
      message: `Hello from SomethingService with params: ${params}!`,
    }
  }

  getSomethingWithQuery(query: string) {
    return {
      message: `Hello from SomethingService with query: ${query}!`,
    }
  }

  getAnother() {
    return {
      message: 'Hello from another service!',
    }
  }
}
