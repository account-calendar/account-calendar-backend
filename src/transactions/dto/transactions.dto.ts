import { Transform } from 'class-transformer'
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { format } from 'date-fns'

import type { Transaction } from '@/entities/transaction.entity'

export class TransactionsDto {
  @IsObject()
  total: { income: number; expense: number }

  @IsArray()
  dates: { [date: string]: { income: number; expense: number } }[]
}

export class TransactionsByDateDto {
  @IsArray()
  @Transform(({ value }) =>
    value.map((item: Transaction) => ({
      id: item.id,
      price: item.price,
      createdAt: format(item.createdDate, 'yyyy-MM-dd HH:mm:ss'),
      updatedAt: item.updatedDate ? format(item.updatedDate, 'yyyy-MM-dd HH:mm:ss') : null,
      deletedAt: item.deletedDate ? format(item.deletedDate, 'yyyy-MM-dd HH:mm:ss') : null,
      registrationAt: format(item.registrationDate, 'yyyy-MM-dd HH:mm:ss'),
      memo: item.memo,
      majorCategory: item.majorCategory
        ? {
            id: item.majorCategory.id || 0,
            emoji: item.majorCategory.emoji || null,
            label: item.majorCategory.label || '기타',
          }
        : null,
      middleCategory: item.middleCategory
        ? {
            id: item.middleCategory.id || 0,
            emoji: item.middleCategory.emoji || null,
            label: item.middleCategory.label || '기타',
          }
        : null,
    })),
  )
  incomeList: {
    id: number
    price: number
    memo: string | null
    registrationAt: string
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
    majorCategory: { id: number; emoji: string | null; label: string } | null
    middleCategory: { id: number; emoji: string | null; label: string } | null
  }[]

  @IsArray()
  @Transform(({ value }) =>
    value.map((item: Transaction) => ({
      id: item.id,
      price: item.price,
      createdAt: format(item.createdDate, 'yyyy-MM-dd HH:mm:ss'),
      updatedAt: item.updatedDate ? format(item.updatedDate, 'yyyy-MM-dd HH:mm:ss') : null,
      deletedAt: item.deletedDate ? format(item.deletedDate, 'yyyy-MM-dd HH:mm:ss') : null,
      registrationAt: format(item.registrationDate, 'yyyy-MM-dd HH:mm:ss'),
      memo: item.memo,
      majorCategory: item.majorCategory
        ? {
            id: item.majorCategory.id || 0,
            emoji: item.majorCategory.emoji || null,
            label: item.majorCategory.label || '기타',
          }
        : null,
      middleCategory: item.middleCategory
        ? {
            id: item.middleCategory.id || 0,
            emoji: item.middleCategory.emoji || null,
            label: item.middleCategory.label || '기타',
          }
        : null,
    })),
  )
  expenseList: {
    id: number
    price: number
    memo: string | null
    registrationAt: string
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
    majorCategory: { id: number; emoji: string | null; label: string } | null
    middleCategory: { id: number; emoji: string | null; label: string } | null
  }[]
}

export class TransactionsPayloadDto {
  @ApiProperty({ 
    description: '거래 유형 (1: 수입, -1: 지출)', 
    example: 1,
    enum: [1, -1]
  })
  @IsNumber()
  type: number // 1: 수입, -1: 지출

  @ApiProperty({ 
    description: '금액', 
    example: 50000 
  })
  @IsNumber()
  price: number

  @ApiProperty({ 
    description: '대분류 ID', 
    example: 1,
    nullable: true
  })
  @IsNumber()
  majorCategoryId: number | null

  @ApiProperty({ 
    description: '중분류 ID', 
    example: 2,
    nullable: true
  })
  @IsNumber()
  middleCategoryId: number | null

  @ApiProperty({ 
    description: '메모', 
    example: '월급',
    nullable: true
  })
  @IsString()
  memo: string | null

  @ApiProperty({ 
    description: '등록 날짜 (YYYY-MM-DD 형식)', 
    example: '2024-01-15'
  })
  @IsString()
  registrationDate: string // 'YYYY-MM-DD' 형식으로 입력
}
