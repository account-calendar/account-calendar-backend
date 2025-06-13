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
import { MiddleCategory } from '@/user/entities/middle-category.entity'

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: ' user-id' })
  user: User

  @ManyToOne(() => MajorCategory, { nullable: true })
  @JoinColumn({ name: 'major_category_id' })
  majorCategory: MajorCategory | null

  @ManyToOne(() => MiddleCategory, { nullable: true })
  @JoinColumn({ name: 'middle_category_id' })
  middleCategory: MiddleCategory | null

  @Column({ type: 'int', nullable: false })
  price: number

  @Column({ type: 'tinyint', nullable: false, comment: '수입 || 지출' })
  type: number

  @Column({ type: 'datetime', name: 'registration_date', nullable: false, comment: '수입 지출내역 등록일' })
  registrationDate: Date

  @Column({ type: 'varchar', nullable: true })
  memo: string | null

  @CreateDateColumn({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updated_date', nullable: true })
  updatedDate: Date | null

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_date', nullable: true })
  deletedDate: Date | null
}
