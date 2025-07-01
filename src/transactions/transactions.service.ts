import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Transaction } from '@/entities/transaction.entity'

import type { Repository } from 'typeorm'

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>) {}

  getTransactionsAll(startDate: string, endDate: string) {
    return { startDate, endDate }
  }

  getTransactionsByDay(day: string) {
    return { day }
  }

  createTransactions() {
    return 'created'
  }

  editTransactions() {
    return 'edited'
  }
}
