import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { format } from 'date-fns'
import { Between, IsNull } from 'typeorm'

import { Transaction } from '@/entities/transaction.entity'

import { plainToInstance } from 'class-transformer'
import {
  TransactionsByDateDto,
  TransactionsDto,
  type TransactionsPayloadDto,
} from '@/transactions/dto/transactions.dto'

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
      .where('transaction.registration_date BETWEEN :start AND :end', { start, end })
      .andWhere('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deleted_date IS NULL')
      .groupBy('DATE(transaction.created_date)')
      .addGroupBy('transaction.type')
      .orderBy('date', 'ASC')
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

    const dates = rawData.reduce<Record<string, { income: number; expense: number }>>((acc, row) => {
      const date = format(row.date, 'yyyy-MM-dd')
      const type = row.type
      const price = Number(row.totalPrice)

      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 }
      }

      if (type === 1) {
        acc[date].income += price
      } else if (type === -1) {
        acc[date].expense += price
      }

      return acc
    }, {})

    const transactionsData = plainToInstance(TransactionsDto, { total, dates })

    return { data: transactionsData }
  }

  async getTransactionsByDay(userId: number, day: string) {
    const start = new Date(new Date(day).setHours(0, 0, 0))
    const end = new Date(new Date(day).setHours(23, 59, 59))

    const transactions = await this.transactionsRepository.find({
      where: {
        user: { id: userId },
        registrationDate: Between(start, end),
        deletedDate: IsNull(),
      },
      relations: ['middleCategory', 'majorCategory'],
    })

    const incomeList = transactions.filter((t) => t.type === 1)
    const expenseList = transactions.filter((t) => t.type === -1)

    const transactionsDateData = plainToInstance(TransactionsByDateDto, { incomeList, expenseList })

    return { data: transactionsDateData }
  }

  async createTransactions(userId: number, payload: TransactionsPayloadDto) {
    const transactionEntity = this.transactionsRepository.create({
      user: { id: userId },
      price: payload.price,
      type: payload.type,
      memo: payload.memo,
      majorCategory: payload.majorCategoryId ? { id: payload.majorCategoryId } : null,
      middleCategory: payload.middleCategoryId ? { id: payload.middleCategoryId } : null,
      registrationDate: new Date(payload.registrationDate),
    })

    await this.transactionsRepository.save(transactionEntity)

    return { message: '수입 지출 내역이 등록되었습니다.' }
  }

  async editTransactions(userId: number, transactionId: number, payload: Partial<TransactionsPayloadDto>) {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        user: { id: userId },
        id: transactionId,
      },
    })

    if (!transaction || transaction.deletedDate) {
      throw new NotFoundException('존재하지 않는 내역입니다.')
    }

    // TODO: 유효성 검사 추가 필요
    transaction.price = payload.price ?? transaction.price
    transaction.type = payload.type ?? transaction.type
    transaction.memo = payload.memo ?? transaction.memo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    transaction.majorCategory = payload.majorCategoryId ? { id: payload.majorCategoryId } : transaction.majorCategoryId
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    transaction.middleCategory = payload.middleCategoryId
      ? { id: payload.middleCategoryId }
      : transaction.middleCategory
    transaction.registrationDate = payload.registrationDate
      ? new Date(payload.registrationDate)
      : transaction.registrationDate
    transaction.updatedDate = new Date()

    await this.transactionsRepository.save(transaction)

    return { message: '수입 지출 내역이 수정되었습니다.' }
  }

  async deleteTransaction(userId: number, transactionId: number) {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        user: { id: userId },
        id: transactionId,
      },
    })

    if (!transaction || transaction.deletedDate) {
      throw new NotFoundException('존재하지 않는 내역입니다.')
    }

    transaction.deletedDate = new Date()

    await this.transactionsRepository.save(transaction)
  }
}
