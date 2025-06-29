import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class MiddleCategoryPayload {
  @ApiProperty({
    description: '대분류 ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  majorCategoryId: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍱',
    required: false,
  })
  @IsOptional()
  @IsString()
  emoji?: string

  @ApiProperty({
    description: '중분류 라벨',
    example: '점심',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  label: string
}

export class MiddleCategoryUpdatePayload {
  @ApiProperty({
    description: '중분류 ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍔',
    required: false,
  })
  @IsOptional()
  @IsString()
  emoji?: string

  @ApiProperty({
    description: '중분류 라벨',
    example: '저녁',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string
}

export class MiddleCategoryResponse {
  @ApiProperty({
    description: '중분류 ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: '대분류 ID',
    example: 1,
  })
  majorCategoryId: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍱',
    nullable: true,
  })
  emoji: string | null

  @ApiProperty({
    description: '중분류 라벨',
    example: '점심',
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
  createdDate: Date

  @ApiProperty({
    description: '수정일',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  updatedDate: Date | null
}
