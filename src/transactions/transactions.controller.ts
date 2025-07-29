import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger'

import { TransactionsService } from '@/transactions/transactions.service'
import { AuthenticatedGuard } from '@/user/auth.guard'

import type { Request } from 'express'
import type { User } from '@/entities/user.entity'
import { TransactionsPayloadDto } from '@/transactions/dto/transactions.dto'

@UseGuards(AuthenticatedGuard)
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: '수입 지출내역 전체조회', description: '수입 지출내역 전체 내역을 조회합니다.' })
  getTransactionsAll(
    @Req() request: Request & { user: User },
    @Query('start-date') startDate: string,
    @Query('end-date') endDate: string,
  ) {
    return this.transactionsService.getTransactionsAll(request.user.id, startDate, endDate)
  }

  @Get(':day')
  @ApiOperation({
    summary: '수입지출 일자별 리스트 조회',
    description: '수입 지출내역을 일자별로 리스트로 조회합니다.',
  })
  getTransactionsByDate(@Req() request: Request & { user: User }, @Param('day') day: string) {
    return this.transactionsService.getTransactionsByDay(request.user.id, day)
  }

  @Post()
  @ApiOperation({ summary: '수입 지출 등록', description: '수입 지출 내역을 등록합니다.' })
  @ApiBody({ type: TransactionsPayloadDto })
  createTransactions(@Req() request: Request & { user: User }, @Body() payload: TransactionsPayloadDto) {
    return this.transactionsService.createTransactions(request.user.id, payload)
  }

  @Put(':transactionId')
  @ApiOperation({ summary: '수입 지출 수정', description: '수입 지출 내역을 수정합니다.' })
  @ApiBody({ type: TransactionsPayloadDto })
  editTransactions(
    @Req() request: Request & { user: User },
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() payload: Partial<TransactionsPayloadDto>,
  ) {
    return this.transactionsService.editTransactions(request.user.id, transactionId, payload)
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '수입 지출 삭제', description: '수입 지출 내역을 삭제합니다.' })
  deleteTransaction(
    @Req() request: Request & { user: User },
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    return this.transactionsService.deleteTransaction(request.user.id, transactionId)
  }
}
