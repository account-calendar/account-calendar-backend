import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ type: 'int', name: 'target_expense', nullable: true })
  targetExpense: number

  @CreateDateColumn({ type: 'datetime', name: 'created_date' })
  createdDate: Date

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_date', nullable: true })
  deletedDate: Date | null
}
