import { IsArray, IsObject } from 'class-validator'

export class TransactionsDto {
  @IsObject()
  total: { income: number; expense: number }

  @IsArray()
  dates: { [date: string]: { income: number; expense: number } }[]
}
