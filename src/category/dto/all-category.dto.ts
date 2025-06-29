import { ApiProperty } from '@nestjs/swagger'

export class AllCategoryResponse {
  @ApiProperty({
    description: '카테고리 타입 (major: 대분류, middle: 중분류)',
    example: 'major',
    enum: ['major', 'middle'],
  })
  type: 'major' | 'middle'

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: '대분류 ID (중분류인 경우에만)',
    example: 1,
    nullable: true,
  })
  majorCategoryId?: number

  @ApiProperty({
    description: '이모지 (ASCII 코드)',
    example: '🍔',
    nullable: true,
  })
  emoji: string | null

  @ApiProperty({
    description: '카테고리 라벨',
    example: '식비',
  })
  label: string

  @ApiProperty({
    description: '타입 (수입/지출)',
    example: 1,
  })
  categoryType: number

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
