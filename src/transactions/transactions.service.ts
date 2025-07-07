import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { format } from 'date-fns'

import { Transaction } from '@/entities/transaction.entity'

import { plainToInstance } from 'class-transformer'
import { TransactionsDto } from '@/transactions/dto/transactions.dto'

import type { Repository } from 'typeorm'

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>) {}

  async getTransactionsAll(userId: number, startDate: string, endDate: string) {
    const start = new Date(new Date(startDate).setHours(0, 0, 0))
    const end = new Date(new Date(endDate).setHours(23, 59, 59))

    const rawData: { type: number; date: Date; totalPrice: string }[] = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.created_date)', 'date')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.price)', 'totalPrice')
      .addSelect('transaction.user_id', 'userId')
      .where('transaction.created_date BETWEEN :start AND :end', { start, end })
      .andWhere('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deleted_date IS NULL')
      .groupBy('DATE(transaction.created_date)')
      .addGroupBy('transaction.type')
      .orderBy('date', 'DESC')
      .getRawMany()

    const total = rawData.reduce<{ income: number; expense: number }>(
      (acc, row) => {
        const type = row.type
        const price = Number(row.totalPrice)

        if (type === 1) {
          acc.income += price
        }
        if (type === -1) {
          acc.expense += price
        }
        return acc
      },
      { income: 0, expense: 0 },
    )

    const dates = rawData.reduce<Record<string, { income: number; expense: number }>[]>((acc, row) => {
      const date = format(row.date, 'yyyy-MM-dd')
      const type = row.type
      const price = Number(row.totalPrice)

      const existing = acc.find((entry) => Object.keys(entry)[0] === date)

      if (existing) {
        if (type === 1) {
          existing[date].income += price
        } else if (type === -1) {
          existing[date].expense += price
        }
      } else {
        acc.push({
          [date]: {
            income: type === 1 ? price : 0,
            expense: type === -1 ? price : 0,
          },
        })
      }

      return acc
    }, [])

    const transactionsData = plainToInstance(TransactionsDto, { total, dates })

    return { data: transactionsData }
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
