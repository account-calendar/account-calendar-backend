import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, Min } from 'class-validator'

export class UpdateTargetExpenseDto {
  @ApiProperty({
    description: '지출제한 금액',
    example: 500000,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  targetExpense: number
} 