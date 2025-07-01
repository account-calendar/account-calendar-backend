import { Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { TransactionsService } from '@/transactions/transactions.service'

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: '수입 지출내역 전체조회', description: '수입 지출내역 전체 내역을 조회합니다.' })
  getTransactionsAll(@Query('start-date') startDate: string, @Query('end-date') endDate: string) {
    return this.transactionsService.getTransactionsAll(startDate, endDate)
  }

  @Get(':day')
  @ApiOperation({
    summary: '수입지출 일자별 리스트 조회',
    description: '수입 지출내역을 일자별로 리스트로 조회합니다.',
  })
  getTransactionsByDate(@Param('day') day: string) {
    return this.transactionsService.getTransactionsByDay(day)
  }

  @Post()
  @ApiOperation({ summary: '수입 지출 등록', description: '수입 지출 내역을 등록합니다.' })
  createTransactions() {
    return this.transactionsService.createTransactions()
  }

  @Put()
  @ApiOperation({ summary: '수입 지출 수정', description: '수입 지출 내역을 수정합니다.' })
  editTransactions() {
    return this.transactionsService.editTransactions()
  }
}
