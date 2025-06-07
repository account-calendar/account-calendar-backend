import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ type: 'int', nullable: true })
  target_expense: number

  @CreateDateColumn({ type: 'datetime' })
  created_date: Date

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_date: Date | null
}
