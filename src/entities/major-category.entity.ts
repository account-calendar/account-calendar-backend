import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { User } from '@/entities/user.entity'

@Entity('major_category')
export class MajorCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'varchar', nullable: true })
  label: string | null

  @Column({ type: 'varchar', nullable: true, comment: 'ascii code' })
  emoji: string | null

  @Column({ type: 'tinyint', nullable: false, comment: '수입 || 지출' })
  type: number

  @CreateDateColumn({ type: 'datetime', name: 'created_date', nullable: false })
  created_date: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updated_date', nullable: true })
  updated_date: Date | null

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_date', nullable: true })
  deleted_date: Date | null
}
