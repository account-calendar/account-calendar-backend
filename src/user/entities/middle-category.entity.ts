import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@/user/entities/user.entity'
import { MajorCategory } from '@/user/entities/major-category.entity'

@Entity('middle_category')
export class MiddleCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => MajorCategory, { nullable: false })
  @JoinColumn({ name: 'major_category_id' })
  majorCategory: MajorCategory

  @Column({ type: 'varchar', nullable: false })
  label: string

  @Column({ type: 'varchar', nullable: true, comment: 'ascii code' })
  emoji: string | null

  @Column({ type: 'tinyint', nullable: false, comment: '수입 || 지출' })
  type: number

  @CreateDateColumn({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updated_date', nullable: true })
  updatedDate: Date | null

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_date', nullable: true })
  deletedDate: Date | null
}
