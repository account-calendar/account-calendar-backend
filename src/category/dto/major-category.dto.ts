import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export class MajorCategoryPayload {
  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍔',
    required: false,
  })
  @IsOptional()
  @IsString()
  emoji?: string

  @ApiProperty({
    description: '대분류 라벨',
    example: '식비',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  label: string
}

export class MajorCategoryUpdatePayload {
  @ApiProperty({
    description: '대분류 ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍕',
    required: false,
  })
  @IsOptional()
  @IsString()
  emoji?: string

  @ApiProperty({
    description: '대분류 라벨',
    example: '피자',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string
}

export class MajorCategoryResponse {
  @ApiProperty({
    description: '대분류 ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍔',
    nullable: true,
  })
  emoji: string | null

  @ApiProperty({
    description: '대분류 라벨',
    example: '식비',
  })
  label: string

  @ApiProperty({
    description: '타입 (수입/지출)',
    example: 1,
  })
  type: number

  @ApiProperty({
    description: '생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_date: Date

  @ApiProperty({
    description: '수정일',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  updated_date: Date | null
}
