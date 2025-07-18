import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TransactionsController } from '@/transactions/transactions.controller'
import { TransactionsService } from '@/transactions/transactions.service'
import { Transaction } from '@/entities/transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
